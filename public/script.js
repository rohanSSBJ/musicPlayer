window.currentSong = new Audio();
let songs;
let currFolder;
let gdata = {
    songs: [],
    folder: ""
};

let data;

const playMusic = (track, pause = false) => {
    window.currentSong.src = `songs/${currFolder}/` + track;
    if (!pause) {
        window.currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder
    gdata.folder = currFolder;

    songs = data[folder];

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${decodeURI(song)}</div>
                                <small>Artist : Rohan</small>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                            </div> 
                            <img src="img/play.svg" alt="">
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    gdata.songs = songs;

    localStorage.setItem("myData", JSON.stringify(gdata));
    return songs
}

async function displayAlbums() {
    console.log("displaying albums")
    const array = Object.keys(data);
    let cardContainer = document.querySelector(".cardContainer")
    for (let i = 0; i < array.length; i++) {

            // Get the metagdata of the folder
            let a = await fetch(`songs/${Object.keys(data)[i]}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${Object.keys(data)[i]}" class="card">
            <div class="play">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" /> 
                </svg>
            </div>

            <img src="songs/${Object.keys(data)[i]}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <h5>${response.description}</h5>
        </div>`
        }
    

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            document.querySelector(".left").style.left = 0;
        })
    })
}

async function main() {
    const res = await fetch("songs/index.json");
    data = await res.json();
    await getSongs(Object.keys(data)[1]);
    playMusic(songs[0], true)
    //Display albums
    await displayAlbums()


    //Attach an event listner to play,next and previous
    play.addEventListener("click", () => {
        if (window.currentSong.paused) {
            window.currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            window.currentSong.pause()
            play.src = "img/play.svg"
        }
        event.stopPropagation();
    })

    //Listen for timeupdate event
    window.currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(window.currentSong.currentTime)} / ${secondsToMinutesSeconds(window.currentSong.duration)}`
        document.querySelector(".circle").style.left = `${(window.currentSong.currentTime / window.currentSong.duration) * 100}%`;
        document.querySelector(".completed").style.width = `${(window.currentSong.currentTime / window.currentSong.duration) * 100}%`;

    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.clientWidth) * 100;
        window.currentSong.currentTime = ((window.currentSong.duration) * percent) / 100
        event.stopPropagation();

    })

    //Add event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    }
    )

    //Add event listner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%"
    }
    )

    //Add an event listner to previous
    previous.addEventListener("click", () => {
        const index = songs.indexOf(decodeURI(window.currentSong.src.split("/").slice(-1)[0]))
        if (index - 1 >= 0) {
            playMusic(songs[index - 1].trim())
        }
        event.stopPropagation();

    }
    )

    //Add an event listner to next
    next.addEventListener("click", () => {
        const index = songs.indexOf(decodeURI(window.currentSong.src.split("/").slice(-1)[0]))
                
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1].trim())
        }
        event.stopPropagation();

    }
    )

    //Add an event listner to playbar
    document.querySelector(".playbar").addEventListener("click", () => {
        let add;
        if (window.currentSong.paused) {
            // window.currentSong.play();
            add = "fa-play";
        }
        else {
            // window.currentSong.pause();
            add = 'fa-pause';
        }
        console.log(add);

        const pop = `<div class="outer">
        <div class="popup">
            <div class="background">
                <img src="assets/1.jpg" id="bg-img">
            </div>

            <div class="box">
                <img class="close-pop invert" width="35" src="img/close.svg" alt="">
                <div class="player-img">
                    <img src="assets/1.jpg" class="active" id="cover">
                </div>

                <div class="music-title"><h2 id="music-title"></h2></div>
                <h3 id="music-artist"></h3>

                <div class="player-progress" id="player-progress">
                    <div class="progress" id="progress"></div>
                    <div class="music-duration">
                        <span id="current-time">0:00</span>
                        <span id="duration">0:00</span>
                    </div>
                </div>

                <div class="player-controls">
                    <i class="fa-solid fa-backward" title="Previous" id="prev"></i>
                    <i class="fa-solid ${add} play-button" id="play-pop"></i>
                    <i class="fa-solid fa-forward" title="Next" id="next-pop"></i>
                </div>

            </div>
        </div>
      </div>`

        const popupContainer = document.getElementById("popup-container");
        popupContainer.innerHTML = pop;

        // Only load new.js once
        if (!document.getElementById("newjs")) {
            const script = document.createElement("script");
            script.src = "new.js";
            script.id = "newjs";
            script.onload = () => {
                if (typeof initPopupUI === "function") initPopupUI(); // optional
            };
            document.body.appendChild(script);
        }
        else {
            if (typeof initPopupUI === "function") initPopupUI(); // optional re-init
        }
    }
    )

}

main()
