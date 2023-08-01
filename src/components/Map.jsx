/* eslint-disable react/prop-types */
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from './Button';


function Map() {
    const {cities} = useCities();
    const [map_position , set_map_position] = useState([40,0]);
    const {isLoading:is_loading_position , position:geolocation_position, getPosition } = useGeoLocation();
    const [map_lat , map_lng] = useUrlPosition();


    //if url changes so does map_lat and lng so we gotta sync them with the map position
    useEffect(function() {
        if(map_lat && map_lng) set_map_position([map_lat, map_lng])
    }, [map_lat , map_lng]);

    useEffect(function() {
        if(geolocation_position) set_map_position([geolocation_position.lat , geolocation_position.lng]);
    } , [geolocation_position])


    return (
        <div className={styles.mapContainer} >
            {!geolocation_position && <Button type='position' onClick={getPosition} >
                {is_loading_position?'Loading...' : 'Use your position'}
            </Button>}
            <MapContainer center={map_position} zoom={6} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(city=> ( <Marker position={[city.position.lat , city.position.lng]} key={city.id}>
                    <Popup>
                        <span>{city.emoji}</span> <span>{city.cityName}</span>
                    </Popup>
                </Marker>))}
                <ChangeCenter position={map_position}/>
                <DetectClick />
            </MapContainer>
        </div>
    )
}


function ChangeCenter({position}) {
    const map = useMap(); 
    map.setView(position);
    return null;
}


function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}


export default Map
