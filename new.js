function initPopupUI() {
    const image = document.getElementById('cover'),
        title = document.getElementById('music-title'),
        artist = document.getElementById('music-artist'),
        currentTimeEl = document.getElementById('current-time'),
        durationEl = document.getElementById('duration'),
        progress = document.getElementById('progress'),
        playerProgress = document.getElementById('player-progress'),
        prevBtn = document.getElementById('prev'),
        nextBtn = document.getElementById('next-pop'),
        playBtn = document.getElementById('play-pop'),
        background = document.getElementById('bg-img');

    const mydata = JSON.parse(localStorage.getItem("myData"));
    const songss = mydata.songs;
    const songFolder = mydata.folder;


    let covers = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg'];
    title.innerHTML = decodeURI(window.currentSong.src.split("/").slice(-1)[0].trim());
    artist.innerHTML = `Artist: Rohan`;

    function getCover() {
        if (covers.indexOf(image.src.split("/").slice(-2)[0] + `/` + image.src.split("/").slice(-2)[1]) != covers.length - 1) {
            return covers[covers.indexOf(image.src.split("/").slice(-2)[0] + `/` + image.src.split("/").slice(-2)[1]) + 1];
        }

        else {
            // console.log(covers.indexOf(image.src));
            return covers[0];
        }
    }
    function playmusic(track) {
        window.currentSong.src = `/${songFolder}/` + track;
        window.currentSong.play();
        title.innerHTML = decodeURI(track);
        document.querySelector(".songinfo").innerHTML = decodeURI(track);
        const cover = getCover();
        image.src = cover;
        background.src = cover;
    }



    function updateProgressBar() {
        const { duration, currentTime } = window.currentSong;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
        currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
    }

    function setProgressBar(e) {
        const width = playerProgress.clientWidth;
        const clickX = e.offsetX;
        window.currentSong.currentTime = (clickX / width) * window.currentSong.duration;
    }

    playBtn.addEventListener('click', () => {
        if (window.currentSong.paused) {
            window.currentSong.play();
            playBtn.classList.replace('fa-play', 'fa-pause');
            play.src="/img/pause.svg"
        } else {
            window.currentSong.pause();
            playBtn.classList.replace('fa-pause', 'fa-play');
            play.src="/img/play.svg"
        }
    });

    prevBtn.addEventListener('click', () => {
        const index = songss.indexOf(window.currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songss[index - 1].trim());
        }
        playBtn.classList.replace('fa-play', 'fa-pause');
        play.src="/img/pause.svg"

    });

    nextBtn.addEventListener('click', () => {
        const index = songss.indexOf(window.currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songss.length) {
            playmusic(songss[index + 1].trim());
        }
        playBtn.classList.replace('fa-play', 'fa-pause');
        play.src="/img/pause.svg"

    });

    window.currentSong.addEventListener('timeupdate', updateProgressBar);
    playerProgress.addEventListener('click', setProgressBar);

    // Close popup and clean up DOM
    const closeBtn = document.querySelector(".close-pop");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const popupContainer = document.getElementById("popup-container");
            popupContainer.innerHTML = ""; // remove popup cleanly
        });
    }
    window.currentSong.addEventListener('ended', () => {
        const index = songss.indexOf(window.currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songss.length) {
            playmusic(songss[index + 1].trim());
        }
    });
}



