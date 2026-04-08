const API_KEY="457b55dbde80a3afd8e17a6a8d33c64d";
const API_URL=`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const $=id=>document.getElementById(id);
const movies=$("movies"), loading=$("loading"), search=$("search-bar"), sort=$("sort-dropdown"), filter=$("filter-dropdown");
let allMovies=[];
[search,sort,filter].forEach(el=>el.addEventListener(el===search?"input":"change", render));
async function fetchMovies(){
  try{
    const res=await fetch(API_URL);
    if(!res.ok) throw new Error(res.statusText);
    allMovies=(await res.json()).results||[];
    loading.style.display="none";
    render();
  }catch(e){
    loading.innerHTML=`<span class="error">❌ Failed to load movies. ${e.message}</span>`;
  }
}
function render(){
  const q=search.value.toLowerCase().trim();
  const min=filter.value==="all"?0:+filter.value;
  const sorted=allMovies
    .filter(m=>`${m.title||m.name||""}`.toLowerCase().includes(q) && (m.vote_average||0)>=min)
    .sort((a,b)=>{
      const ra=a.vote_average||0, rb=b.vote_average||0;
      const ta=(a.title||a.name||"").toLowerCase(), tb=(b.title||b.name||"").toLowerCase();
      return sort.value==="rating-desc"?rb-ra:
             sort.value==="rating-asc"?ra-rb:
             sort.value==="title-asc"?ta.localeCompare(tb):
             sort.value==="title-desc"?tb.localeCompare(ta):0;
    });
  if(!sorted.length){
    movies.innerHTML=`<div style="grid-column:1/-1;text-align:center;color:#8b8fa3;padding:40px 0;">No movies found matching your criteria.</div>`;
    return;
  }
  movies.innerHTML=sorted.map(m=>{
    const title=m.title||m.name||"Untitled";
    const image=m.poster_path?`<img src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${title}" loading="lazy"/>`:`<div class="no-poster">No Image</div>`;
    return `<div class="movie-card">${image}<div class="movie-info"><h3>${title}</h3><p class="rating">⭐ ${(m.vote_average||0).toFixed(1)}</p>${m.release_date?`<p class="release-date">${m.release_date}</p>`:""}${m.overview?`<p class="overview">${m.overview.slice(0,120)}${m.overview.length>120?"…":""}</p>`:""}</div></div>`;
  }).join("");
}
fetchMovies();

const modal = document.getElementById("movie-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalBody = document.getElementById("modal-body");

moviesDiv.addEventListener("click", (e) => {
  const card = e.target.closest(".movie-card");
  if (!card) return;

  const movieId = card.dataset.id;
  if (!movieId) return;

  openModal(movieId);
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

async function openModal(id) {
  modal.classList.add("active");
  modalBody.innerHTML = '<div class="modal-spinner">Loading details...</div>';

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch details");
    
    const movie = await res.json();
    
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";
    const title = movie.title || movie.name || "Untitled";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const releaseDate = movie.release_date || "Unknown Release Date";
    const overview = movie.overview || "No overview available.";
    const runtime = movie.runtime ? `${movie.runtime} min` : "Unknown runtime";
    const genres = movie.genres ? movie.genres.map(g => `<span class="modal-tag">${g.name}</span>`).join("") : "";

    modalBody.innerHTML = `
      <div class="modal-body-content">
        ${poster ? `<img src="${poster}" alt="${title}" class="modal-poster" />` : `<div class="modal-poster" style="display:flex;align-items:center;justify-content:center;background:#1e1e2a;color:#555;">No Image</div>`}
        <div class="modal-info">
          <h2 class="modal-title">${title}</h2>
          <div class="modal-meta">
            <span>⭐ ${rating}</span>
            <span>📅 ${releaseDate}</span>
            <span>⏱️ ${runtime}</span>
          </div>
          <div class="modal-meta" style="margin-bottom: 24px; gap: 8px;">
            ${genres}
          </div>
          <p class="modal-overview">${overview}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    modalBody.innerHTML = `<div class="modal-spinner" style="color: #f87171;">Failed to load movie details.</div>`;
  }
}