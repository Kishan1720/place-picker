import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {

  const [availableplPlaces, setAvailablePlaces] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true)

      try {

        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          )
          setAvailablePlaces(sortPlaces)
          setIsFetching(false)
        })

      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, Please try again later'
        })
        setIsFetching(false)
      }

    }

    fetchPlaces()
  }, [])

  if (error) {
    return <Error
      title="An error occured!"
      message={error.message}
    />
  }

  return (
    <Places
      title="Available Places"
      places={availableplPlaces}
      isLoading={isFetching}
      loadingText="Feching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
