/* eslint-disable react/prop-types */
import React from 'react'
import styles from './CityItem.module.css'
import {Link} from 'react-router-dom'
import { useCities } from '../contexts/CitiesContext';


const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",

  }).format(new Date(date));


function CityItem({city}) {
    const {currentCity, delete_city} = useCities();
    const {cityName , emoji , date, id, position} = city;

    function handle_click(e) {
      e.preventDefault();
      delete_city(id);
    }


  return (
    <li>
      <Link className={`${styles.cityItem} ${id===currentCity.id? styles['cityItem--active']:''}`} 
            to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>{formatDate(date)}</time>
          <button className={styles.deleteBtn} onClick={(e)=> handle_click(e)}>&times;</button>
      </Link>
    </li>
  )
}

export default CityItem