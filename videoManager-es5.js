var localPlayer;

function initVideo(player) {
  localPlayer = player;
  
  hs.remotePlayer.addEventListener("timeupdate", function() {
    localPlayer.getMediaElement().currentTime = hs.remotePlayer.currentTime || 0;
  });

  hs.remotePlayer.addEventListener("ended", function() {
    hs.lifecycle.moveToForeground();
  });

  hs.lifecycle.addEventListener("onstatechange", function(event) {
    if (event.state === "background") {
      pauseVideo();
    } else if (event.state === "foreground") {
      playVideo();
    }
  });
}

function loadVideo(url) {
  return localPlayer.load(url).then(function() {
    return hs.remotePlayer.load(url);
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
  hs.lifecycle.moveToForeground();
}

function moveToBackground() {
  var currentTime = localPlayer.getMediaElement().currentTime;
  hs.remotePlayer.currentTime = currentTime;
  hs.remotePlayer.play();
}

function  toggleBackground() {
  hs.lifecycle.getState().then(function(currentState) {
    if (currentState == "background" || currentState == "inTransitionToBackground") {
      hs.lifecycle.moveToForeground();
    } else {
      moveToBackground();
    }
  });
}
