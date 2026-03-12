const musicPlayer = document.querySelector(".music-player");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const progress = document.querySelector("#progress");
const progressContainer = document.querySelector("#progress-container");
const title = document.querySelector(".title");
const cover = document.querySelector("#cover");
const musicsPlayList = document.querySelector("#musicsPlayList");
const playlistOverlay = document.querySelector("#playlist-overlay");
const playlistBtn = document.querySelector("#playlist-btn");
const closePlaylistBtn = document.querySelector("#close-playlist");
const playIcon = document.querySelector("#play-icon");
const currentTimeEl = document.querySelector("#currenTime");
const endSondEl = document.querySelector("#timeEndSond");

// song titles
const songs = ["Goddess_Nightcore", "POP-STARS", "HOPEX-Warrior"];

let songIndex = 0;

// initially load song info
loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song.replace(/_/g, ' '); // Beautify title
  audio.src = `music/${song}.mp3`;
  cover.src = `img/${song}.jpg`;
  updatePlaylistActiveState();
}

function playSong() {
  musicPlayer.classList.add("play");
  playIcon.classList.remove("fa-play");
  playIcon.classList.remove("fa-play-circle");
  playIcon.classList.add("fa-pause");
  audio.play();
  updateTimeduration();
}

function pauseSong() {
  musicPlayer.classList.remove("play");
  playIcon.classList.add("fa-play");
  playIcon.classList.remove("fa-pause");
  audio.pause();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if(isNaN(duration)) return;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.innerText = segundosAMinutosSegundos(currentTime);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

playBtn.addEventListener("click", () => {
  const isPlaying = musicPlayer.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

function updateTimeduration() {
  if(audio.duration) {
      endSondEl.innerText = segundosAMinutosSegundos(audio.duration);
  }
}

// Ensure duration updates when metadata loads (jumping songs)
audio.addEventListener('loadedmetadata', () => {
    endSondEl.innerText = segundosAMinutosSegundos(audio.duration);
});


function segundosAMinutosSegundos(segundos) {
  if (isNaN(segundos)) return "00:00";
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  const minutosFormateados = String(minutos).padStart(2, "0");
  const segundosFormateados = String(segundosRestantes).padStart(2, "0");
  return `${minutosFormateados}:${segundosFormateados}`;
}

// Show Music Playlist on menu
function renderPlaylist() {
  musicsPlayList.innerHTML = songs.map((song, index) => {
    return `<li data-index="${index}" class="${index === songIndex ? 'active' : ''}">${song.replace(/_/g, ' ')}</li>`;
  }).join('');
}

function updatePlaylistActiveState() {
  const items = musicsPlayList.querySelectorAll('li');
  // may be called before playlist renders
  if(!items.length) return; 
  items.forEach(item => item.classList.remove('active'));
  const activeItem = musicsPlayList.querySelector(`li[data-index="${songIndex}"]`);
  if (activeItem) activeItem.classList.add('active');
}

// Open/Close Playlist
playlistBtn.addEventListener("click", () => {
  playlistOverlay.classList.remove("hidden");
});

closePlaylistBtn.addEventListener("click", () => {
  playlistOverlay.classList.add("hidden");
});

// Click outside to close playlist
playlistOverlay.addEventListener("click", (e) => {
  if (e.target === playlistOverlay) {
    playlistOverlay.classList.add("hidden");
  }
});

// Select music from playlist
musicsPlayList.addEventListener("click", (e) => {
  const listItem = e.target.closest('li');
  if (listItem) {
    songIndex = parseInt(listItem.getAttribute('data-index'));
    loadSong(songs[songIndex]);
    playSong();
    playlistOverlay.classList.add("hidden"); // Close on play
  }
});

// Initial render
renderPlaylist();

// Event listeners
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextSong);
