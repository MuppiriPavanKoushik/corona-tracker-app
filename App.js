import React, {useEffect, useState} from "react";
import  {MenuItem, FormControl, Select,Card,CardContent} from "@material-ui/core";
import InfoBox from  "./Infobox";
import numeral from "numeral";



import './App.css';

import Table from "./Table";

import LineGraph from "./LineGraph";

import Map from  './Map';

import  'leaflet/dist/leaflet.css';

import Animation from "./Animation";



function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom,setMapZoom] = useState(5);
  const [mapcountries,setmapcountries] = useState([]);
  const [casesType,setCasestype]=useState("cases");
  

  
useEffect(() => {
  fetch("https://disease.sh/v3/covid-19/all")
  .then((response) => response.json())
  .then((data) => {
    setCountryInfo(data);
    
  });
}, []);

    useEffect(() => {
      const getCountriesData = async () => {
        await fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => { 
          const countries = data.map((country) => (
            {
              name:country.country, // Unitedstates, united kingdom
              value: country.countryInfo.iso2  //  UK,USA,FR
            }
            
            
          ));
          
          
           setTableData(data);
           setmapcountries(data);
          setCountries(countries);
        });  
      };
      
          getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
      setCountry(countryCode);
     

      const url = 
        countryCode === "worldwide" 
        ? "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

      await fetch(url)
      .then((response) => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)

        setMapCenter([data.countryInfo.lat,data.countryInfo.long])
        setMapZoom(13);
        
      })

    }

    return (
    <div className="app"> 
     <div className="app__left">
     <div className="app__header">
       <h1>COVID19-Tracker</h1>
       <img className="imagenet" src="https://image.shutterstock.com/image-vector/corona-virus-2020covid19white-backgroundvector-illustration-600w-1630211680.jpg" alt="hi" height="50px" width="50px"/>
      <FormControl className="app__dropdown">
        <Select
          variant="outlined"
          onChange = {onCountryChange}
          value={country}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map(country => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          )   
          )}
        </Select>
      </FormControl>
       </div>

       <div className="app__stats">
       
       <InfoBox 
       isRed
       active={casesType==="cases"}
       onClick={e=>setCasestype("cases")} 
       title="Coronvirus Cases"
        cases={numeral(countryInfo.todayCases).format("0.0a")}  
        total={numeral(countryInfo.cases).format("0.0a")} />
       <InfoBox  
       
       active={casesType==="recovered"}
       onClick={e=>setCasestype("recovered")}
        title="Recovered"
         cases={numeral(countryInfo.todayRecovered).format("0.0a")} 
          total={numeral(countryInfo.recovered).format("0.0a")} />
       <InfoBox 
       isRed
        active={casesType==="deaths"}
        onClick={e=>setCasestype("deaths")}
         title="Deaths" 
         cases={numeral(countryInfo.todayDeaths).format("0.0a")} 
         total={numeral(countryInfo.deaths).format("0.0a")} />
       </div>

       <Map 
        onChange = {onCountryChange}
        casesType={casesType}
        countries={mapcountries}
       center={mapCenter}
       zoom={mapZoom}
        
       />
     </div>

     <Card className="app_right">
     <CardContent>
              <h3>Live cases by country</h3>
             <Table countries={tableData}/>
             <h3 className="app_graphtitle">Worldwide newer cases {casesType}</h3>
             <LineGraph casesType={casesType}/>
           <Animation 
             frontword="Be"
             element1="Safe"
             element2="Strong"
           />
              
</CardContent>
     </Card>
     


    </div>
  );
}

export default App;