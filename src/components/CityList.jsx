/* eslint-disable react/prop-types */
import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from './Spinner'
import Message from './Message'
import { useCities } from '../contexts/CitiesContext'

function CityList() {
    const {cities , is_loading} = useCities();
    
    if (is_loading) return <Spinner />

    if (!cities.length) return <Message message='Add your first city by clicking on the map!'/>
    return (
        <ul className={styles.cityList}>
            {cities.map(city => (<CityItem city={city} key={city.id} />))}
        </ul>
    )
}

export default CityList
