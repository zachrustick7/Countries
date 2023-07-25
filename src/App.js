import {React, useState, useEffect, useCallback, Fragment} from 'react';

import './App.css';
import Autocomplete from '@mui/joy/Autocomplete';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';


import {getAllCountries, getCountryByName} from './services.js';

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [countryData, setCountryData] = useState();
  const [currentCountry, setCurrentCountry] = useState();
  const [searchString, setSearchString] = useState();
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [coatOfArmsLoaded, setCoatOfArmsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  //fetch list of all countries on initial load
  useEffect(() => {
    fetchAllCountries();
    // eslint-disable-next-line
  }, []);

  //triggered when list of all countries returns
  useEffect(() => {
    console.log(allCountries)
  }, [allCountries]);

  //triggered when search button is pressed
  useEffect(() => {
    if (searching) {
      setShowWelcome(false);
      setErrorMessage(false);
      setCurrentSearchString(searchString);
      fetchCountryByName(searchString);
      setSearching(false);
    }
    // eslint-disable-next-line
  }, [searching]);

  //handles response for country search
  useEffect(() => {
    if (countryData && countryData.status && countryData.status === 404) {
      console.log('No countries found');
      setErrorMessage(true);
    } else if (countryData && countryData[0]) {
      setErrorMessage(false);
      setLoading(false);
      setCurrentCountry(countryData[0]);
      console.log(countryData);
    }
    setLoading(false);
  }, [countryData]);

  const fetchAllCountries = useCallback(async () => {
    const data = await getAllCountries();
    setAllCountries(data);
  }, []);

  const fetchCountryByName = useCallback(async (ss) => {
    let parsedSearchString = encodeURIComponent(ss.trim());
    const data = await getCountryByName(parsedSearchString);
    setCountryData(data);
  }, []);

  const handleCountrySearch = () => {
    setSearching(true);
    setLoading(true);
    setFlagLoaded(false);
    setCoatOfArmsLoaded(false);
  };

  return (
    <div className="App">
      <div className='App-container'>
        <div className='Search-bar'>
          <Autocomplete
            sx={{width: '100%'}}
            placeholder="Search for a country"
            type="search"
            freeSolo
            disableClearable
            options={allCountries.map((option) => option.name.common)}
            onChange={(event, value) => {setSearchString(value)}}
            onInputChange={(event, value) => {setSearchString(value.replace(/[^\w\s]/gi, ''))}}
          />
            <Button
              onClick={() => {handleCountrySearch()}}
              style={{marginLeft: '16px'}}
            >
                Search
            </Button>
        </div>
      </div>
      <div className='Dashboard-container'>
        <div className='Dashboard-subcontainer'>
          {/* Country Info */}
          <div className='Data-container' style={{width: '70%'}}>
            <div className='Data-subcontainer'>
              {showWelcome &&
                <div className='Message'>
                  <h2>Welcome to the country display dashboard. Please search for a country to get started.</h2>
                </div>
              }
              {!loading && countryData && countryData[0] && !errorMessage &&
                <div >
                  <h2><strong>{currentCountry.name.common + " " + (currentCountry.flag ? currentCountry.flag : '')}</strong></h2>
                  <Divider orientation="horizontal" />
                  <p><strong>Official Name:  </strong>{currentCountry.name.official}</p>
                  <p><strong>Currency:  </strong>{currentCountry.currencies[Object.keys(currentCountry.currencies)[0]].name}</p>
                  <p><strong>Currency Symbol:  </strong>{currentCountry.currencies[Object.keys(currentCountry.currencies)[0]].symbol}</p>
                  <p><strong>Language:  </strong>{currentCountry.languages[Object.keys(currentCountry.languages)[0]]}</p>
                  <p><strong>Capital City:  </strong>{currentCountry.capital[0]}</p>
                  <p><strong>Population:  </strong>{currentCountry.population.toLocaleString()}</p>
                </div>
              }
              {loading && !errorMessage &&
                <div className='Loading-icon'>
                  <Button loading variant="plain">
                    Plain
                  </Button>
                </div>
              }
              {errorMessage &&
                <div className='Message'>
                  <h2>No search results found for "{currentSearchString}"</h2>
                </div>
              }
            </div>
          </div>

          {/* Country Flag */}
          <div className='Data-container' style={{width: '30%'}}>
            <div className='Data-subcontainer' style={{alignItems: 'center'}}>
              {!loading && countryData && countryData[0] &&
                <Fragment>
                  {currentCountry && 
                  currentCountry.flags && 
                  (currentCountry.flags.svg || currentCountry.flags.png) &&
                    <Fragment>
                      <h3>Flag</h3>
                      {flagLoaded ? null : (
                        <div className='Image-container'>
                          <Button loading variant="plain">
                            Plain
                          </Button>
                        </div>
                      )}
                      <img
                        onLoad={() => setFlagLoaded(true)}
                        style={flagLoaded ? 
                          {border: '2px solid grey',
                          borderRadius: '8px',
                          maxHeight: '30%',
                          maxWidth: '100%',
                          boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'} : 
                          {display: 'none'}
                        }
                        src={currentCountry.flags.svg ? String(currentCountry.flags.svg) : String(currentCountry.flags.png)}
                        alt={currentCountry.flags.alt ? currentCountry.flags.alt : `${searchString} flag`}
                      />
                    </Fragment>
                  }
                  {currentCountry && 
                  currentCountry.coatOfArms && 
                  (currentCountry.coatOfArms.svg || currentCountry.coatOfArms.png) &&
                    <Fragment>
                      <h3>Coat of Arms</h3>
                      {coatOfArmsLoaded ? null : (
                        <div className='Image-container'>
                          <Button loading variant="plain">
                            Plain
                          </Button>
                        </div>
                      )}
                      <img
                        onLoad={() => setCoatOfArmsLoaded(true)}
                        style={coatOfArmsLoaded ? 
                          {border: '2px solid grey',
                          borderRadius: '8px',
                          maxHeight: '30%',
                          maxWidth: '100%',
                          boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'} : 
                          {display: 'none'}
                        }
                        src={currentCountry.coatOfArms.svg ? String(currentCountry.coatOfArms.svg) : String(currentCountry.coatOfArms.png)}
                        alt={currentCountry.coatOfArms.alt ? currentCountry.coatOfArms.alt : `${searchString} coat of arms.`}
                      />
                    </Fragment>
                  }
                  {currentCountry && 
                  currentCountry.coatOfArms && 
                  !currentCountry.coatOfArms.svg &&
                    <p>No coat of arms found.</p>
                  }
                </Fragment>
              }
              {loading &&
                <div className='Loading-icon'>
                  <Button loading variant="plain">
                    Plain
                  </Button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
