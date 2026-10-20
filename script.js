// Sample Playlist Data (Audio & Cover Art)
const songs = [
  {
    title: "Durge Durge Durgotinashini",
    artist: "Asha Bhosle",
    src: "music/audio1.mp3",
    cover: "image/img1.png",
    isFavorite: false
  },
  {
    title: "Mai tera kabil hoo yaar",
    artist: "Jubin Nautiyal and Palak Muchhal",
    src: "music/audio2.mp3",
    cover: "image/img2.png",
    isFavorite: false
  },
  {
    title: "Daona muche sontaneri moner kalima",
    artist: "Shreya Ghoshal",
    src: "music/audio3.mp3",
    cover: "image/img3.png",
    isFavorite: false
  }
];

// DOM Elements
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const favoriteBtn = document.getElementById("favorite-btn");

const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverArt = document.getElementById("cover-art");
const artworkWrapper = document.querySelector(".artwork-wrapper");

const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");

const volumeSlider = document.getElementById("volume-slider");
const muteBtn = document.getElementById("mute-btn");
const volumeIcon = document.getElementById("volume-icon");

const playlistToggleBtn = document.getElementById("playlist-toggle-btn");
const closePlaylistBtn = document.getElementById("close-playlist");
const playlistSection = document.getElementById("playlist-section");
const playlistSongsList = document.getElementById("playlist-songs");

// State Variables
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let previousVolume = 0.8;

// Initial Load
function loadSong(song) {
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverArt.src = song.cover;
  audio.src = song.src;

  updateFavoriteButton();
  highlightActivePlaylistItem();
}

// Play / Pause Logic
function playSong() {
  isPlaying = true;
  audio.play();
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");
  artworkWrapper.classList.add("playing");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");
  artworkWrapper.classList.remove("playing");
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Previous & Next Song
function prevSong() {
  if (isShuffle) {
    playRandomSong();
    return;
  }
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

function nextSong() {
  if (isShuffle) {
    playRandomSong();
    return;
  }
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

function playRandomSong() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (songs.length > 1 && randomIndex === currentSongIndex);
  currentSongIndex = randomIndex;
  loadSong(songs[currentSongIndex]);
  playSong();
}

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Progress & Time Format
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  totalDurationEl.textContent = formatTime(audio.duration);
});

// Seek Track
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}
progressContainer.addEventListener("click", setProgress);

// Autoplay / Song End Handling
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// Repeat Mode Toggle
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Shuffle Mode Toggle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// Favorite Toggle
favoriteBtn.addEventListener("click", () => {
  songs[currentSongIndex].isFavorite = !songs[currentSongIndex].isFavorite;
  updateFavoriteButton();
});

function updateFavoriteButton() {
  const favIcon = favoriteBtn.querySelector("i");
  if (songs[currentSongIndex].isFavorite) {
    favoriteBtn.classList.add("active");
    favIcon.classList.remove("fa-regular");
    favIcon.classList.add("fa-solid");
  } else {
    favoriteBtn.classList.remove("active");
    favIcon.classList.remove("fa-solid");
    favIcon.classList.add("fa-regular");
  }
}

// Volume & Mute Controls
volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value;
  updateVolumeIcon(value);
});

muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = previousVolume || 0.5;
    volumeSlider.value = audio.volume;
  }
  updateVolumeIcon(audio.volume);
});

function updateVolumeIcon(vol) {
  volumeIcon.className = "";
  if (vol == 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else if (vol < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}

// Playlist Setup & Interaction
function renderPlaylist() {
  playlistSongsList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    li.innerHTML = `
      <div class="playlist-info">
        <h4>${song.title}</h4>
        <span>${song.artist}</span>
      </div>
      <i class="fa-solid fa-play play-item-icon"></i>
    `;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(songs[currentSongIndex]);
      playSong();
      playlistSection.classList.remove("open");
    });
    playlistSongsList.appendChild(li);
  });
}

function highlightActivePlaylistItem() {
  const items = playlistSongsList.querySelectorAll("li");
  items.forEach((item, idx) => {
    if (idx === currentSongIndex) {
      item.classList.add("playing");
    } else {
      item.classList.remove("playing");
    }
  });
}

playlistToggleBtn.addEventListener("click", () => {
  playlistSection.classList.add("open");
});

closePlaylistBtn.addEventListener("click", () => {
  playlistSection.classList.remove("open");
});

// App Initialization
renderPlaylist();
loadSong(songs[currentSongIndex]);
audio.volume = volumeSlider.value;