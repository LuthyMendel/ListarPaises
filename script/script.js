let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');
  //prettier-ignore
  totalPopulationFavorites = 
  document.querySelector('#totalPopulationFavorites' );

  numberFormat = Intl.NumberFormat('pt-BR');
  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population: population,
      formattedPopulation: formatNumber(population),
      flag: flag,
    };
  });
  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHtml = '<div>';

  //prettier-ignore
  allCountries.forEach(country => {
    const { name, flag, id, population, formattedPopulation } = country;
    const countryHTML = `
    <div class='country'>
      <div><img src="${flag}" alt="${name}"> 
      <a id="${id}" <a class="waves-effect waves-light btn">+</a>
      </div>
      <div>
        <ul>
        <li>${name}</li>
        <li>${formattedPopulation}</li>
        </ul>
      </div>
    </div>
    `;
    countriesHtml += countryHTML;
  });
  countriesHtml += '</div>';
  tabCountries.innerHTML = countriesHtml;
}

function renderFavorites() {
  let favoritesHTML = '<div>';
  favoriteCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;
    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>  
    `;
    favoritesHTML += favoriteCountryHTML;
  });
  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });
  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}
function addToFavorites(id) {
  const contryToadd = allCountries.find((country) => country.id === id);
  favoriteCountries = [...favoriteCountries, contryToadd];

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  //reatribui no array porém não reatribui o que for igual ao que foi passado no id
  allCountries = allCountries.filter((country) => country.id !== id);
  console.log(favoriteCountries);
  render();
}
function removeFromFavorites(id) {
  const contryToRemove = favoriteCountries.find((country) => country.id === id);
  allCountries = [...allCountries, contryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  //reatribui no array porém não reatribui o que for igual ao que foi passado no id
  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);
  console.log(favoriteCountries);
  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
