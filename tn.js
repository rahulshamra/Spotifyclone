let folders = [];
async function getfolders() {
  let response = await fetch("http://127.0.0.1:5500/songs/");
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let a = div.getElementsByTagName("a");
  for (const folder of a) {
    if (folder.href.startsWith("http://127.0.0.1:5500/songs")) {
      folders.push(folder.href.split("http://127.0.0.1:5500/songs/")[1]);
    }
  }
}

async function getsongs(folder) {
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let songs = [];
  let as = div.getElementsByTagName("a");
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(decodeURIComponent(element.href.split(`http://127.0.0.1:5500/${folder}/`)[1]));
    }
  }
  return songs;
}

let currentsong = new Audio();
let currentsongindex = 0;

const playmusic = (track, bool) => {
  currentsong.src = `/songs/${currentfolder}/${encodeURIComponent(track)}`;
  if (bool) {
    currentsong.play();
  }
  play.src = "pause.svg";
  songinfo.innerHTML = track;
  settime();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function settime() {
  currentsong.addEventListener("timeupdate", () => {
    let currentTime = formatTime(currentsong.currentTime);
    let duration = formatTime(currentsong.duration);
    songtime.innerHTML = currentTime + "/" + duration;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
}

let currentfolder;
async function main() {
  await getfolders();
  folders.shift();
  
  let cardelement = '';
  folders.forEach((folder) => {
    cardelement += `<div class="card rounded ">
      <div class="play"><img data-folder="${folder}" src="play.svg" alt=""></div>
      <img src="https://i.scdn.co/image/ab67616d00001e029bb2d30b01ac2cada8a8ad03" alt="">
      <h3>Happy family</h3>
      <p>Subh</p>
    </div>`;
  });

  // Ensure that cardcontainer is updated correctly
  let cardContainer = document.getElementsByClassName("cardcontainer")[0];
  if (cardContainer) {
    cardContainer.innerHTML = cardelement;
  } else {
    console.error("No element with class 'cardcontainer' found.");
  }

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async () => {
      currentfolder = e.getElementsByTagName("img")[0].getAttribute("data-folder");
      let songs = await getsongs(`songs/${currentfolder}`);
      playmusic(songs[0], false);
      let songUL = document.querySelector(".songlist ul");
      let listitems = '';
      for (const song of songs) {
        let adv = decodeURIComponent(song.split("_320(PagalWorld.com.sb).mp3")[0]);
        listitems += `<li>
          <img class="invert" src="music.svg" alt="">
          <div class="songinfo" data-fullsong="${encodeURIComponent(song)}">${adv}</div>
          <div><img class="invert" src="play2.svg" alt=""></div>
          </li>`;
      }
      songUL.innerHTML = listitems;

      document.querySelectorAll(".songlist li").forEach((e, index) => {
        e.addEventListener("click", () => {
          let fullsong = e.querySelector(".songinfo").getAttribute("data-fullsong");
          currentsongindex = index;
          currentsongindex--;
          playmusic(decodeURIComponent(fullsong), true);
        });
      });
    });
  });

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play2.svg";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  hamber.addEventListener("click", (e) => {
    document.querySelector(".left").style.cssText = "left: 0%; z-index: 4;";
  });

  cross.addEventListener("click", () => {
    document.querySelector(".left").style.cssText = "left: -100%;";
  });

  prev.addEventListener("click", () => {
    if (currentsongindex > 0) {
      currentsongindex--;
    }
    playmusic(songs[currentsongindex], true);
  });

  next.addEventListener("click", () => {
    if (currentsongindex < songs.length) {
      currentsongindex++;
    }
    playmusic(songs[currentsongindex], true);
  });

  const volumeSlider = document.getElementById('vol');
  let currentsongvol;
  volumeSlider.addEventListener('change', (e) => {
    let atr = document.getElementsByClassName("volume")[0].getElementsByTagName("img")[0];
    if ((parseInt(e.target.value)) == 0) {
      atr.src = "mute.svg";
    } else {
      atr.src = "soundon.svg";
    }
    currentsongvol = parseInt(e.target.value) / 100;
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  document.getElementsByClassName("volume")[0].getElementsByTagName("img")[0].addEventListener("click", (e) => {
    const imgElement = e.target;
    if (imgElement.src.endsWith("mute.svg")) {
      imgElement.src = "soundon.svg";
      currentsong.volume = currentsongvol;
      volumeSlider.value = currentsongvol * 100;
    } else {
      imgElement.src = "mute.svg";
      currentsong.volume = 0;
      volumeSlider.value = 0;
    }
  });
}

main();
