let birthMonth;
let birthDay;
let birthYear;
let gender;
let country;
let state;
let city;

const states = document.getElementById("displayStates")
states.style.display = "none";

const handleBirthdayMonth = event => birthMonth = event.target.value;
const handleBirthdayDay = event => birthDay = event.target.value;
const handleBirthdayYear = event => birthYear = event.target.value;
const handleGender = value => gender = value;
const handleCountrySelection = event => {
  country = event.target.value;
  countryId = event.target[event.srcElement.selectedIndex].id

  if (country === "United States") {
    states.style.display = "block";

    let statesList = ["<option selected disabled>State</option>"]
    axios.get('/register/api/state-list')
    .then(states => {
      states.data.map(state => statesList.push(`<option id=${state.id}>${state.name}</option>`))
      document.getElementById('states-list').innerHTML = statesList;
    })
  } else {
    states.style.display = "none";
    let citiesList = ["<option selected disabled>City</option>"]
    axios.get(`/register/api/cities-list?countryId=${countryId}`)
    .then(cities => {
      cities.data.map(city => citiesList.push(`<option>${city.name}</option>`))
      document.getElementById('cities-list').innerHTML = citiesList;
    })
  }
};

const handleStateSelection = event => {
  state = event.target.value
  stateId = event.target[event.srcElement.selectedIndex].id

  let citiesList = ["<option selected disabled>City</option>"]
  axios.get(`/register/api/cities-list?stateId=${stateId}`)
  .then(cities => {
    cities.data.map(city => citiesList.push(`<option>${city.name}</option>`))
    document.getElementById('cities-list').innerHTML = citiesList;
  })
};

const handleCitySelection = event => city = event.target.value;

const handleProfileInfo = () => {

  const userInfo = {
    birthMonth,
    birthDay,
    birthYear,
    gender,
    country,
    state,
    city,
  }
  console.log("userInfo\n", userInfo);
}