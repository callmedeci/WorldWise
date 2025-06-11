import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useEffect } from 'react';
import { useGeoLocation } from './../hooks/useGeoLocation';
import styles from './Map.module.css';
import Button from './Button';
import { useUrlPostion } from '../hooks/useUrlPosition';

function Map() {
  const { cities } = useCities();
  const [mapLat, mapLng] = useUrlPostion();
  const [mapPoistion, setMapPoistion] = useState([40, 0]);
  const {
    position: geoLocationPosition,
    isLoading: isLoadingPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPoistion([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPoistion([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}

      <MapContainer
        className={styles.map}
        center={mapPoistion}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />

        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeMapPosition position={mapPoistion} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeMapPosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
}

export default Map;
