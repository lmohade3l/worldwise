import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Product from "./pages/Product"
import Pricing from "./pages/Pricing"
import HomePage from "./pages/HomePage"
import PageNotFound from "./pages/PageNotFound"
import AppLayout from "./pages/AppLayout"
import Login from "./pages/Login"
import CityList from "./components/CityList"
import CountryList from "./components/CountryList"
import City from "./components/City"

const BASE_URL = 'http://localhost:9000'

function App() {

  const [cities , set_cities] = useState([]);
  const [is_loading , set_is_loading] = useState(false);

  useEffect(function() {
    async function fetchCities() {
      try {
        set_is_loading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        set_cities(data);
      } catch{
        alert('there was an error loading data');
      } finally {
        set_is_loading(false);
      }
    }
    fetchCities();
  } , [])
  
 
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<Login />} />
          <Route path="app" element={<AppLayout />}>
              <Route index element={<CityList cities={cities} is_loading={is_loading}/>} />
              <Route path="cities" element={<CityList cities={cities} is_loading={is_loading}/>} />
              <Route path="cities/:id" element={<City />}/>
              <Route path="countries" element={<CountryList cities={cities} is_loading={is_loading}/>} />
              <Route path="form" element={<p>from</p>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
    );
}

export default App