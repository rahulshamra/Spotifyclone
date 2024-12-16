let currentfolder;
let folders = [];
async function getfolders() {
  let response = await fetch("http://127.0.0.1:5500/songs/");
  let text = await response.text();
  // text.getElementsByTagName("a");
  let div = document.createElement("div");
  div.innerHTML = text;
  let a = div.getElementsByTagName("a")
  for (const folder of a) {
    // if(folder.start)
    if (folder.href.startsWith("http://127.0.0.1:5500/songs")) {
      {
        folders.push(folder.href.split("http://127.0.0.1:5500/songs/")[1]);


      }
    }
  }
}



// console.log(element)

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
      // Decode the song name
      songs.push(decodeURIComponent(element.href.split(`http://127.0.0.1:5500/${folder}/`)[1]));
    }
  }
  return songs;
}
let currentsong = new Audio();
let currentsongindex = 0;

const playmusic = (track, bool) => {
  // Properly encode the track name
  // let audio = new Audio(`/songs/${encodeURIComponent(track)}`);
  currentsong.src = `/songs/${currentfolder}/${encodeURIComponent(track)}`;
  if (bool == true) {
    currentsong.play();
  }
  play.src = "pause.svg";
  songinfo.innerHTML = track;
  settime();
}
// playmusic();
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
async function main2(){
  let  cardcontainer=document.getElementsByClassName("cardcontainer")[0];
  let cardelement='';
  for(let i=0;i<folders.length;i++){
    let songs = await getsongs(`songs/${currentfolder}`);
    let response = await fetch(`http://127.0.0.1:5500/songs/${folders[i]}/info.json`);
    let data = await response.json();
    console.log(data.title);
    console.log(data.discription);
    console.log(data.image);
    

    cardelement+=
    `<div class="card rounded ">
    <div   class="play"><img data-folder="${folders[i]}" src="play.svg" alt=""></div>
    <img  src="${data.image}" alt="cxv">
    <h3>${data.discription}</h3>
    <p>${data.title}</p>
    </div>`
    // console.log(folder)
    cardcontainer.innerHTML=cardelement;
    }
  }
  async function main() {
    await getfolders();
    folders.shift();
     await main2();
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async () => {
      currentfolder = e.getElementsByTagName("img")[0].getAttribute("data-folder");
      let songs = await getsongs(`songs/${currentfolder}`);
      playmusic(songs[0], false);
      let songUL = document.querySelector(".songlist ul");
      let listitems = '';
      for (const song of songs) {
        // Split the song name to display
        let adv = decodeURIComponent(song.split("_320(PagalWorld.com.sb).mp3")[0]);
        listitems += `<li>
          <img class="invert" src="music.svg" alt="">
          <div class="songinfo" data-fullsong="${encodeURIComponent(song)}">${adv}</div>
          <div><img class="invert" src="play2.svg" alt=""></div>
          </li>`;
      }
      songUL.innerHTML = listitems;

      // Attach event listeners to each song
      document.querySelectorAll(".songlist li").forEach((e, index) => {
        e.addEventListener("click", () => {
          // Retrieve the full song name from the data attribute
          let fullsong = e.querySelector(".songinfo").getAttribute("data-fullsong");
          currentsongindex = index;
          currentsongindex--;
          playmusic(decodeURIComponent(fullsong), true);
        });
      });
    });
  });
  // attech an event listener to play next and previous
  //  let obj=document.getElementById("play")
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    }
    else {
      currentsong.pause();
      play.src = "play2.svg";
    }
  })
  document.querySelector(".seekbar").addEventListener("click", e => {

    let parsent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = parsent + "%";
    currentsong.currentTime = (currentsong.duration * parsent) / 100;
  })
  hamber.addEventListener("click", (e) => {
    document.querySelector(".left").style.cssText = "left: 0%; z-index: 4; width:256px ";

  })
  cross.addEventListener("click", () => {
    document.querySelector(".left").style.cssText = "left: -100%; ";
  })
  prev.addEventListener("click", () => {
    if (currentsongindex > 0) {
      currentsongindex--;
    }
    playmusic(songs[currentsongindex], true);
  })
  next.addEventListener("click", () => {
    if (currentsongindex < songs.length) {
      currentsongindex++;
    }
    playmusic(songs[currentsongindex], true);
  })
  //add volume to
  // document.querySelector("#range").getElementsByTagName("input")[0].addEventListener("change",()=>{
  // console.log("dksf");
  // })
  const volumeSlider = document.getElementById('vol');
  let currentsongvol;
  volumeSlider.addEventListener('change', (e) => {
    console.log(e);
    let atr = document.getElementsByClassName("volume")[0].getElementsByTagName("img")[0]
    console.log(parseInt(e.target.value));
    if ((parseInt(e.target.value)) == 0) {
      atr.src = "mute.svg"

    }
    else {
      atr.src = "soundon.svg"
    }
    currentsongvol = parseInt(e.target.value) / 100;
    currentsong.volume = parseInt(e.target.value) / 100;

  })
  document.getElementsByClassName("volume")[0].getElementsByTagName("img")[0].addEventListener("click", (e) => {
    const imgElement = e.target;
    if (imgElement.src.endsWith("mute.svg")) {
      imgElement.src = "soundon.svg";
      currentsong.volume = currentsongvol;
      volumeSlider.value = "currentsongvol";
    } else {
      imgElement.src = "mute.svg";
      currentsong.volume = 0;
      volumeSlider.value = "0";
    }
  });
};

//get  song by card click
main();
