const API_KEY = "457b55dbde80a3afd8e17a6a8d33c64d";

const URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=457b55dbde80a3afd8e17a6a8d33c64d`
fetch(URL)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
  const movies = data.results;
console.log(movies);

const moviesDiv = document.getElementById("movies");
movies.map(movie => {
  console.log(movie.title);
});