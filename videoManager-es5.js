var localPlayer;

function initVideo(player) {
  localPlayer = player;
  
  senza.remotePlayer.addEventListener("timeupdate", function() {
    localPlayer.getMediaElement().currentTime = senza.remotePlayer.currentTime || 0;
  });

  senza.remotePlayer.addEventListener("ended", function() {
    senza.lifecycle.moveToForeground();
  });

  senza.lifecycle.addEventListener("onstatechange", function(event) {
    if (event.state === "background") {
      pauseVideo();
    } else if (event.state === "foreground") {
      playVideo();
    }
  });
}

function loadVideo(url) {
  return localPlayer.load(url).then(function() {
    return senza.remotePlayer.load(url);
  });
}

function playVideo() {
  localPlayer.getMediaElement().play().catch(function (error) {
    console.log("Unable to play video. Possibly the browser will not autoplay video with sound.");
  });
}

function pauseVideo() {
  localPlayer.getMediaElement().pause();
}

function playPause() {
  if (localPlayer.getMediaElement().paused) {
    playVideo();
  } else {
    pauseVideo();
  }
}

function skip(seconds) {
  localPlayer.getMediaElement().currentTime = localPlayer.getMediaElement().currentTime + seconds;
}

function moveToForeground() {
  senza.lifecycle.moveToForeground();
}

function moveToBackground() {
  var currentTime = localPlayer.getMediaElement().currentTime;
  senza.remotePlayer.currentTime = currentTime;
  senza.remotePlayer.play();
}

function toggleBackground() {
  senza.lifecycle.getState().then(function(currentState) {
    if (currentState == "background" || currentState == "inTransitionToBackground") {
      senza.lifecycle.moveToForeground();
    } else {
      moveToBackground();
    }
  });
}
