const API_KEY = "457b55dbde80a3afd8e17a6a8d33c64d";

const API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

const moviesDiv = document.getElementById("movies");
const loading = document.getElementById("loading");

async function fetchMovies() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const movies = data.results;

    if (!movies || movies.length === 0) {
      loading.textContent = "No trending movies found.";
      return;
    }

    const html = movies
      .map((movie) => {
        const image = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "";
        const title = movie.title || movie.name || "Untitled";
        const rating = movie.vote_average
          ? movie.vote_average.toFixed(1)
          : "N/A";
        const overview = movie.overview
          ? movie.overview.slice(0, 120) + (movie.overview.length > 120 ? "…" : "")
          : "";
        const releaseDate = movie.release_date || "";

        return `
        <div class="movie-card">
          ${
            image
              ? `<img src="${image}" alt="${title}" loading="lazy" />`
              : `<div class="no-poster">No Image</div>`
          }
          <div class="movie-info">
            <h3>${title}</h3>
            <p class="rating">⭐ ${rating}</p>
            ${releaseDate ? `<p class="release-date">${releaseDate}</p>` : ""}
            ${overview ? `<p class="overview">${overview}</p>` : ""}
          </div>
        </div>
      `;
      })
      .join("");

    loading.style.display = "none";
    moviesDiv.innerHTML = html;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    loading.innerHTML = `<span class="error">❌ Failed to load movies. ${error.message}</span>`;
  }
}

fetchMovies();