import { lifecycle } from "senza-sdk";

class LifecycleAdditions {
  constructor() {
    if (LifecycleAdditions.instance) {
      return LifecycleAdditions.instance;
    }
    LifecycleAdditions.instance = this;

    this._autoBackground = false;
    this._autoBackgroundDelay = 30;

    document.addEventListener("keydown", () => {
      if (this._autoBackground) {
        if (lifecycle.state === lifecycle.UiState.BACKGROUND || 
            lifecycle.state === lifecycle.UiState.IN_TRANSITION_TO_BACKGROUND) {
          lifecycle.moveToForeground();
        } else {
          if (this.autoBackground) {
            this.startCountdown();
          }
        }
      }
    });
    
    lifecycle.addEventListener("onstatechange", () => {
      if (this._autoBackground && lifecycle.state === lifecycle.UiState.FOREGROUND) {
        this.startCountdown();
      }
    });
  }

  // remove this when player syncs timecode automatically before moving to background
  set syncTime(func) {
    this._syncTime = func;
  }

  get autoBackground() {
    return this._autoBackground;
  }

  set autoBackground(value) {
    this._autoBackground = value;
    
    if (this._autoBackground) {
      this.startCountdown();
    }
  }

  get autoBackgroundDelay() {
    return this._autoBackgroundDelay;
  }

  set autoBackgroundDelay(value) {
    this._autoBackgroundDelay = value;
    if (this.autoBackground) {
      this.startCountdown();
    }
  }
  
  startCountdown() {
    this.stopCountdown();
    console.log('startCountdown: ' + this._autoBackgroundDelay);
    this.countdown = setTimeout(() => {
      if (typeof this._syncTime === 'function') {
        this._syncTime();
      }
      lifecycle.moveToBackground();
    }, this.autoBackgroundDelay * 1000);
  }
  
  stopCountdown() {
    if (this.countdown) {
      clearTimeout(this.countdown);
    }
    this.countdown = null;
  }
}

export default new LifecycleAdditions(); 
