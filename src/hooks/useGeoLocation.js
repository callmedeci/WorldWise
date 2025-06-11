import { useState } from 'react';

export function useGeoLocation(defaultPosition = null) {
  const [position, setPosition] = useState(defaultPosition);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setIsError('Your broswer does not support geolocation');

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setIsError(err.message);
      }
    );
  }

  return { position, getPosition, isLoading, isError };
}
