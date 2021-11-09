let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: ""
  }
};
const numberOfBreweriesToDisplay = 10;

//DOM TOOL FUNCTIONS
function createElement(tag){
  const element = document.createElement(tag);
  return element;
}

function createElementWithText(tag, text){
  const element = document.createElement(tag);
  element.innerText = text;
  return element;
}

function createElementWithClass(tag, className){
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function createFormWithId(id){
  const form = createElement('form');
  form.id = id;
  form.setAttribute('autocomplete', 'off');
  return form;
}

function createLabelFor(text){
  const label = createElement('label');
  label.setAttribute('for', text);
  return label;
}

function createInputElement(name, type, id = '', value = ''){
  const input = createElement('input');
  input.id = id;
  input.setAttribute('value', value);
  input.setAttribute('name', name);
  input.setAttribute('type', type);
  return input;
}

/****** MAIN FUNCTIONS ******/

//FILTERING FUNCTIONS
function filterByCity(input, event, breweries, breweriesContainer){
  const selectedCityFilter = event.target.value;
  if(!state.filters.city.includes(selectedCityFilter)){
    state.filters.city.push(selectedCityFilter);
  }
  if(!input.checked){
    state.filters.city.splice(state.filters.city.indexOf(selectedCityFilter), 1);
  }
  const filteredCities = state.filters.city;
  let filteredBreweries = [];
  filteredCities.forEach(city => {
    breweries.forEach(brewery => {
      if(brewery.city === city){
        filteredBreweries.push(brewery);
      }
    });
  });
  if(state.filters.city.length === 0){
    initializeMainSection(breweries, breweriesContainer);
  }
  else {
    initializeMainSection(filteredBreweries, breweriesContainer);
  }
}

function filterByType(event, breweries, parentElement){
  const selectedTypeFilter = event.target.value;
  state.filters.type = selectedTypeFilter;
  if(selectedTypeFilter === 'all'){
    initializeMainSection(breweries, parentElement);
  }
  else{
    const filteredBreweries = breweries.filter((brewery) => brewery.type === selectedTypeFilter);
    initializeMainSection(filteredBreweries, parentElement);
  }
}

function filterByName(event, input, breweries, parentElement){
  event.preventDefault();
  const selectedFilterWord = input.value;
  state.filters.search = selectedFilterWord;
  let filteredBreweries = [];
  breweries.forEach(brewery => {
    if(brewery.city.toLowerCase() === selectedFilterWord.toLowerCase()){
      filteredBreweries.push(brewery);
    }
    else if ((brewery.name).toLowerCase().includes(selectedFilterWord.toLowerCase())){
      filteredBreweries.push(brewery);
    }
  });
  initializeMainSection(filteredBreweries, parentElement);
}

//CHECKBOXES FUNCTIONS
function extractCitiesData(data){
  const cities = [];
  data.forEach(brewery => {
    if(!cities.includes(brewery.city)){
      cities.push(brewery.city);
    }
  })
  return cities;
}

function renderCityCheckBoxes(cities, parentElement, breweries, breweriesContainer){
  cities.forEach(city => {
    const input = createInputElement(city, 'checkbox', city, city);
    input.addEventListener('click', (event) => filterByCity(input, event, breweries, breweriesContainer));
    const label = createLabelFor(city);
    label.innerText = city;
    parentElement.append(input, label);
  });
}

function clearCheckboxes(event, cities, breweries, breweriesContainer){
  event.preventDefault();
  cities.forEach(city => {
    document.querySelector(`#${city}`).checked = false;
  });
  initializeMainSection(breweries, breweriesContainer);
}


//INITIALIZE PAGE FUNCTIONS
function initializeAsideSection(breweries, breweriesContainer){
  const aside = createElementWithClass('aside', 'filters-section');
  const mainDiv = createElement('div');
  const h2 = createElementWithText('h2', 'Filter By:');
  const filterByTypeForm = createFormWithId('filter-by-type-form');
  const label = createLabelFor('filter-by-type');
  const h3Form = createElementWithText('h3', 'Type of Brewery');
  const select = createElement('select');
  select.setAttribute('name', 'filter-by-type');
  select.id = 'filter-by-type';
  select.addEventListener('change', (event) => filterByType(event, breweries, breweriesContainer));
  const defaultOption = createElementWithText('option','Select a type...');
  defaultOption.value = 'all';
  const microOption = createElementWithText('option', 'Micro');
  microOption.value = 'micro';
  const regOption = createElementWithText('option', 'Regional');
  regOption.value = 'regional';
  const brewOption = createElementWithText('option', 'Brewpub');
  brewOption.value = 'brewpub';
  const filterDiv = createElementWithClass('div', 'filter-by-city-heading');
  const h3Filter = createElementWithText('h3', 'Cities');
  const button = createElementWithText('button', 'clear all');
  button.className = 'clear-all-btn';
  const filterByCityForm = createFormWithId('filter-by-city-form');
  const cities = extractCitiesData(breweries);
  renderCityCheckBoxes(cities, filterByCityForm, breweries, breweriesContainer);
  button.addEventListener('click', (event) => clearCheckboxes(event, cities, breweries, breweriesContainer));
  filterDiv.append(h3Filter, button);
  select.append(defaultOption, microOption, regOption, brewOption);
  filterByTypeForm.append(label, h3Form, select);
  mainDiv.append(h2, filterByTypeForm, filterDiv, filterByCityForm);
  aside.append(mainDiv);
  return aside;
}

function renderBreweriesList(breweries, parentElement){
  breweries.forEach(brewery => {
    const li = createElement('li');
    const h2 = createElementWithText('h2', brewery.name);
    const typeDiv = createElementWithText('div', brewery.type);
    typeDiv.className = 'type';
    const addressSection = createElementWithClass('section', 'address');
    const h3Address = createElementWithText('h3', 'Address:');
    const pStreet = createElementWithText('p', brewery.street);
    const strong = createElementWithText('strong', `${brewery.city}, ${brewery.postal_code}`);
    const pStrong = createElement('p');
    pStrong.append(strong);
    addressSection.append(h3Address, pStreet, pStrong);
    const linkSection = createElementWithClass('section', 'link');
    const link = createElementWithText('a', 'Visit Website');
    link.setAttribute('href', brewery.website_url);
    link.setAttribute('target', '_blank');
    linkSection.append(link);
    li.append(h2, typeDiv, addressSection, linkSection);
    parentElement.append(li); 
  });
}


function initializeMainSection(breweries, parentElement){
  while(parentElement.firstChild){
    parentElement.removeChild(parentElement.firstChild);
  }
  const h1 = createElementWithText('h1','List of Breweries');
  const headerSection = createElementWithClass('header', 'search-bar');
  const searchForm = createFormWithId('search-breweries-form');
  const label = createLabelFor('search-breweries');
  const h2 = createElementWithText('h2', 'Search breweries:');
  const input = createInputElement('search-breweries', 'text', 'search-breweries');
  searchForm.addEventListener('submit', (event) => filterByName(event, input, breweries, parentElement));
  label.append(h2);
  searchForm.append(label, input);
  headerSection.append(searchForm);
  const article = createElement('article');
  const breweriesUl = createElementWithClass('ul', 'breweries-list');
  renderBreweriesList(breweries, breweriesUl);
  article.append(breweriesUl);
  parentElement.append(h1, headerSection, article);
}

function initializePage(breweries){
  const mainPage = document.querySelector('main');
  mainPage.innerText = '';
  const breweriesSection = createElement('section');
  const aside = initializeAsideSection(breweries, breweriesSection);
  initializeMainSection(breweries, breweriesSection);
  mainPage.append(aside, breweriesSection);
}

//FETCH & CLEAN DATA FUNCTIONS
function pushCleanData(data, input){
  state.selectStateInput = input;
  data.forEach(brewery => {
    state.breweries.push(brewery.name);
    state.cities.push(brewery.city);
  });
}

function cleanData(data, input){
  const wantedTypes = ['micro', 'regional', 'brewpub'];
  const listOfFilteredBreweries = [];
  data.forEach(brewery => {
    if (wantedTypes.includes(brewery.brewery_type) && listOfFilteredBreweries.length < numberOfBreweriesToDisplay) {
      const newBrewery = {
        name: brewery.name,
        city: brewery.city,
        type: brewery.brewery_type,
        street: brewery.street,
        postal_code: brewery.postal_code,
        phone: '',
        website_url: brewery.website_url    
      }
    if(brewery.phone === null){
      newBrewery.phone = 'N/A';
    }  
    else{
      newBrewery.phone = brewery.phone;
    }
    listOfFilteredBreweries.push(newBrewery)
    }
  });
  pushCleanData(listOfFilteredBreweries, input);
  initializePage(listOfFilteredBreweries);
}

function fetchData(input){
  fetch('https://api.openbrewerydb.org/breweries?by_state=' + input)
    .then(res => res.json())
    .then(data => cleanData(data, input));
}

//GET STATE INPUT
const inputForm = document.querySelector('#select-state-form');
const inputState = document.querySelector('#select-state');
inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let input = inputState.value;
  fetchData(input);
});