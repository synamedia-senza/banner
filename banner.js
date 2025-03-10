import * as senza from "senza-sdk";

// Implements four forms of license server authentication, based on examples from
// https://shaka-player-demo.appspot.com/docs/api/tutorial-license-server-auth.html 
// Set the auth parameter to no_auth, header_auth, param_auth or cookie_auth

let options = {
  "auth": getParam("auth", "no_auth"),
  "url": "https://d75lt43xddusd.cloudfront.net/shaka-demo-assets/sintel-widevine/dash.mpd",
  "licenseServer": "https://cwip-shaka-proxy.appspot.com/no_auth",
  "autoBackground": getParam("autoBackground", "true") == "true",
  "delay": Number(getParam("delay", 15)),
  "maxHeight": Number(getParam("maxHeight", 1080))
}

let player;

window.addEventListener("load", async () => {
  try {
    await senza.init();
    player = new senza.ShakaPlayer();
    player.configure(playerConfig());
    await player.attach(video);
    player.getNetworkingEngine().registerRequestFilter((type, request, context) => {
      if (type == senza.shaka.net.NetworkingEngine.RequestType.LICENSE) {
        if (options.auth == "header_auth") {
          banner.innerHTML = "Header Authentication";
          request.headers['CWIP-Auth-Header'] = 'VGhpc0lzQVRlc3QK';
        } else if (options.auth == "param_auth") {
          banner.innerHTML = "Parameter Authentication";
          request.uris[0] += '?CWIP-Auth-Param=VGhpc0lzQVRlc3QK';
        } else if (options.auth == "cookie_auth") {
          banner.innerHTML = "Cookie Authentication";
          // go to https://cwip-shaka-proxy.appspot.com/set_cookie in the debugger to set the cookie
          request.allowCrossSiteCredentials = true;
        } else {
          banner.innerHTML = "No Authentication";
        }
      }
    });
    await player.load(options.url);
    await video.play();

    senza.lifecycle.autoBackgroundDelay = options.delay;
    senza.lifecycle.autoBackground = options.autoBackground;
    senza.lifecycle.addEventListener("onstatechange", updateBanner);

    senza.uiReady();
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

function skip(seconds) {
  video.currentTime = video.currentTime + seconds;
}

function updateBanner() {
  banner.style.opacity = senza.lifecycle.state === senza.lifecycle.UiState.IN_TRANSITION_TO_BACKGROUND ? 0.5 : 0.9;
}

function getParam(name, defaultValue = null) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(name) ? urlParams.get(name) : defaultValue;
}

function playerConfig() {
  let config = {
    abr: {restrictions: {maxHeight: options.maxHeight}},
    drm: {
      servers: {"com.widevine.alpha": options.licenseServer.replace("no_auth", options.auth)},
      advanced: {'com.widevine.alpha': {'videoRobustness': 'SW_SECURE_CRYPTO', 'audioRobustness': 'SW_SECURE_CRYPTO'}}
    }
  };
  return config;
}
