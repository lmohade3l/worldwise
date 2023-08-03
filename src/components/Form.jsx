/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat , lng] = useUrlPosition();
  const {create_city, is_loading} = useCities();
  const navigate = useNavigate();
  const [isLoading_geoLoading , set_isLoading_geoLoading] = useState();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geo_error , set_geo_error] = useState("");
  const [emoji , set_emoji] = useState("");

  useEffect(function() {
    if(!lat && !lng) return;

    async function fetch_city_data() {
      try{
        set_isLoading_geoLoading(true);
        set_geo_error('');

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if(!data.countryCode) throw new Error("That's in the middle of nowhere, Click somewhere else!")

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        set_emoji(convertToEmoji(data.countryCode));
      } catch (err){
        set_geo_error(err.message);
      } finally {
        set_isLoading_geoLoading(false)
      }
    }
    fetch_city_data();
  },[lat , lng])


  async function handle_submit(e) {
    e.preventDefault();


    if(!cityName || !date) return;

    const newCity = {
      cityName, country, emoji, date, notes, position:{lat,lng}, 
    };
    await create_city(newCity);
    navigate('/app/cities');
  }


  if (isLoading_geoLoading) return <Spinner /> 
  if(!lat && !lng) return <Message message='Start by clicking somewhere on the map!'/>
  if(geo_error) return <Message message={geo_error} />


  return (
    <form className={`${styles.form} ${is_loading?styles.loading:''}`} onSubmit={handle_submit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat='dd/MM/yyyy' id="date"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton /> 
      </div>
    </form>
  );
}

export default Form;
