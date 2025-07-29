const movieWatchlist = document.getElementById('movie-watchlist');
let myWatchlist = [];

renderWatchlist();

document.addEventListener('click', (e) => {
  if (e.target.dataset.remove) {
    handleRemoveFromWatclistClick(e.target.dataset.remove);
  }
});

function handleRemoveFromWatclistClick(imdbID) {
  myWatchlist = myWatchlist.filter((id) => id !== imdbID);
  localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
  renderWatchlist();
}

async function getWatchlistMovies() {
  myWatchlist = JSON.parse(localStorage.getItem('myWatchlist'));
  if (myWatchlist && myWatchlist.length > 0) {
    const moviePromises = myWatchlist.map(async (movie) => {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${movie}&apikey=599e8214`
      );
      const data = await response.json();
      return data;
    });

    const movies = await Promise.all(moviePromises);
    return movies;
  }

  return [];
}

async function renderWatchlist() {
  const movies = await getWatchlistMovies();

  if (movies.length > 0) {
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
            <button data-remove=${movie.imdbID} class="watchlist-btn remove-btn">Remove</button>
          </div>
          <p class="movie-description">${movie.Plot}</p>
           </div>
      </div>
      `;
      })
      .join('');
    movieWatchlist.innerHTML = movieCards;
  } else {
    movieWatchlist.innerHTML = `
         <div class="default default-watchlist">
        <p>Your watchlist is looking a little empty...</p>
        <a href="index.html">Let’s add some movies!</a>
      </div>
    `;
  }
}
