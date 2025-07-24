const searchForm = document.querySelector('.search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieResult = document.getElementById('movie-result');
const mainDefault = document.querySelector('.default');
const watchlistLink = document.getElementById('whatchlist-link');

let movies = [];
let myWatchlist = [];

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  render();
});

document.addEventListener('click', (e) => {
  if (e.target.dataset.add) {
    handleAddToWatchlistClick(e.target.dataset.add);
  }
});

watchlistLink.addEventListener('click', () => {
  localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
});

function handleAddToWatchlistClick(imdbID) {
  if (!myWatchlist.includes(imdbID)) {
    myWatchlist.push(imdbID);
  }
  console.log(myWatchlist);
}

async function getMovies(movieToSearch) {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${movieToSearch}&apikey=599e8214`
  );
  const data = await response.json();

  if (data.Response === 'False') {
    return null;
  }

  const movies = await Promise.all(
    data.Search.map(async (m) => {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${m.imdbID}&apikey=599e8214`
      );
      const data = await response.json();
      return data;
    })
  );

  return movies;
}

async function render() {
  movies = await getMovies(searchInput.value);

  if (!movies) {
    document.querySelector('.default').innerHTML = `
    <p class="invalid-title">
      Unable to find what you’re looking for. Please try another search.
    </p>`;
  }

  const movieCards = movies
    .map((movie) => {
      return `
      <div id=${movie.imdbID} class="movie-card">
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} movie poster" />
        <div class="movie-info">
          <div class="title-rating">
            <h2>${movie.Title}</h2>
            <span class="rating">⭐${movie.imdbRating}</span>
          </div>
          <div class="movie-meta">
            <span>${movie.Runtime}</span>
            <span>${movie.Genre}</span>
            <button data-add=${movie.imdbID} class="watchlist-btn">Watchilst</button>
          </div>
          <p class="movie-description">${movie.Plot}</p>
           </div>
      </div>
    `;
    })
    .join('');

  movieResult.innerHTML = movieCards;
}
