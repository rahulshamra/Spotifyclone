async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
  
    let div = document.createElement("div");
    div.innerHTML = response;
    let songs = [];
  
    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith("mp3")) {
        // Decode the song name
        songs.push(decodeURIComponent(element.href.split("http://127.0.0.1:5500/songs/")[1]));
      }
    }
    return songs;
  }
  
  let currentsong = new Audio();
  
  const playmusic = (track) => {
    // Properly encode the track name
    currentsong.src = `/songs/${encodeURIComponent(track)}`;
    currentsong.play();
  };
  
  async function main() {
    let songs = await getsongs();
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
    document.querySelectorAll(".songlist li").forEach(e => {
      e.addEventListener("click", () => {
        // Retrieve the full song name from the data attribute
        let fullsong = e.querySelector(".songinfo").getAttribute("data-fullsong");
        playmusic(decodeURIComponent(fullsong));
      });
    });
  }
  
  main();
  