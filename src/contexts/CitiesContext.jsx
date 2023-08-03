/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext , useState , useEffect, useContext} from "react";

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:9000';

function CitiesProvider({children}) {
    const [cities , set_cities] = useState([]);
  const [is_loading , set_is_loading] = useState(false);
  const [currentCity , setCurrentCity] = useState({});

  useEffect(function() {
    async function fetchCities() {
      try {
        set_is_loading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data);
        set_cities(data);
      } catch{
        alert('there was an error loading data');
      } finally {
        set_is_loading(false);
      }
    }
    fetchCities();
  } , []);


  async function getCity(id) {
        try {
          set_is_loading(true);
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();

          setCurrentCity(data);
        } catch{
          alert('there was an error loading data');
        } finally {
          set_is_loading(false);
        }
  }


  async function create_city(new_city) {
    try {
      set_is_loading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(new_city),
        headers: {'Content-Type':'application/json'}
      });
      const data = await res.json();
      set_cities(cities => [...cities, data]);
    } catch{
      alert('there was an error adding the city.');
    } finally {
      set_is_loading(false);
    }
}


async function delete_city(id) {
  try {
    set_is_loading(true);
    const res = await fetch(`${BASE_URL}/cities/${id}`, {
      method: 'DELETE',
    });

    set_cities(cities => cities.filter(city => city.id !== id));
  } catch{
    alert('there was an error deleting the city.');
  } finally {
    set_is_loading(false);
  }
}


  return (
    <CitiesContext.Provider value={ {
        cities,
        is_loading,
        currentCity,
        getCity,
        create_city,
        delete_city,
    }}>
        {children}
    </CitiesContext.Provider>)
}


function useCities() {
    const context = useContext(CitiesContext);
    if(context === undefined) throw new Error("Citiescontext was used outside of the CitiesProvider!")
    return context;
}


export {CitiesProvider , useCities};