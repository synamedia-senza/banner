const TEST_VIDEO = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
const MUTE = true;

window.addEventListener("load", function() {
  try {
    hs.init().then(function() {
      initVideo(new shaka.Player(document.getElementById("video")));
      loadVideo(TEST_VIDEO).then(function () {
        playVideo();
        hs.uiReady();
      });
    });
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", async function(event) {
	switch (event.key) {
    case "Enter": toggleBackground(); break;
    case "Escape": playPause(); break;
    case "ArrowLeft": skip(-30); break;
    case "ArrowRight": skip(30); break;      
		default: return;
	}
	event.preventDefault();
});
