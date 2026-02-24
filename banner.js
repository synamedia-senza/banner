const url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

let player;

window.addEventListener("load", async () => {
  try {
    await senza.init();

    player = new senza.ShakaPlayer();
    player.configure(playerConfig());
    player.attach(video);
    await player.load(url);
    await video.play();

    senza.lifecycle.configure({
      autoBackground: {enabled: false, timeout: {playing: 15, idle: 15}},
      autoSuspend: {enabled: false, timeout: {playing: 30, idle: 30 }},
    });

    senza.uiReady();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", async function (event) {
  switch (event.key) {
    case "Enter": await toggleBackground(); break;
    case "Escape": await playPause(); break;
    case "ArrowUp": break;
    case "ArrowDown": break;
    case "ArrowLeft": await skip(-30); break;
    case "ArrowRight": await skip(30); break;
    default: return;
  }
  event.preventDefault();
});

async function toggleBackground() {
  if (senza.lifecycle.state == senza.lifecycle.UiState.BACKGROUND) {
    await senza.lifecycle.moveToForeground();
  } else {
    await senza.lifecycle.moveToBackground();
  }
}

async function playPause() {
  if (video.paused) {
    await video.play();
  } else {
    await video.pause();
  }
}

async function skip(seconds) {
  await moveToForegroundIfNeeded();
  video.currentTime = video.currentTime + seconds;
}

async function moveToForegroundIfNeeded() {
  if (senza.lifecycle.state == senza.lifecycle.UiState.BACKGROUND) {
    await senza.lifecycle.moveToForeground();
  }
}

function playerConfig() {
  return {abr: {restrictions: {maxHeight: 1080}}};
}
