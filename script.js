const searchForm = document.querySelector('.search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieResult = document.getElementById('movie-result');
const mainDefault = document.querySelector('.default');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const movies = await getMovies(searchInput.value);

  if (!movies) {
    document.querySelector('.default').innerHTML = `
    <p class="invalid-title">
      Unable to find what you’re looking for. Please try another search.
    </p>`;
  }

  const movieCards = movies
    .map((movie) => {
      return `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} movie poster" />
        <div class="movie-info">
          <div class="title-rating">
            <h2>${movie.Title}</h2>
            <span class="rating">⭐${movie.imdbRating}</span>
          </div>
          <div class="movie-meta">
            <span>${movie.Runtime}</span>
            <span>${movie.Genre}</span>
            <button class="watchlist-btn">Watchilst</button>
          </div>
          <p class="movie-description">${movie.Plot}</p>
           </div>
      </div>
    `;
    })
    .join('');

  movieResult.innerHTML = movieCards;
});

async function getMovies(movieToSearch) {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${movieToSearch}&apikey=599e8214`
  );
  const data = await response.json();

  if (data.Response === 'False') {
    return null;
  }

  const movies = Promise.all(
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
