export const getAllCountries = async () => {
    let resp = await fetch('https://restcountries.com/v3.1/all')
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data;
    })
    .catch((err) => {
      return err.message;
   });
   return resp;
}

export const getCountryByName = async (name) => {
    let resp = await fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data;
    })
    .catch((err) => {
      return err.message;
   });
   return resp;
}