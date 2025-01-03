import { init, uiReady, ShakaPlayer, lifecycle } from "senza-sdk";

const TEST_VIDEO = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

let player;

window.addEventListener("load", async () => {
  try {
    await init();
    player = new ShakaPlayer(video);
    await player.load(TEST_VIDEO);
    await video.play();
    uiReady();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", async function (event) {
  switch (event.key) {
    case "Enter": await toggleBackground(); break;
    case "Escape": await playPause(); break;
    case "ArrowLeft": skip(-30); break;
    case "ArrowRight": skip(30); break;
    default: return;
  }
  event.preventDefault();
});

async function toggleBackground() {
  if (lifecycle.state == lifecycle.UiState.BACKGROUND) {
    await lifecycle.moveToForeground();
  } else {
    // remove this line once the remotePlayer has been updated to sync 
    // automatically regardless of whether seamless switch is enabled
    player.remotePlayer.currentTime = video.currentTime;
    await lifecycle.moveToBackground();
  }
}

async function playPause() {
  if (video.paused) {
    await video.play();
  } else {
    await video.pause();
  }
}

function skip(seconds) {
  video.currentTime = video.currentTime + seconds;
}
