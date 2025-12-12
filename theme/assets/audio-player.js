class AudioPlayerBar extends HTMLElement {
  constructor() {
    super();
    this.container = this.querySelector('div');
    this.playPauseBtn = this.querySelector('#player-play-pause');
    this.prevBtn = this.querySelector('#player-prev');
    this.nextBtn = this.querySelector('#player-next');
    this.closeBtn = this.querySelector('#player-close');
    this.progressBar = this.querySelector('#player-progress-bar');
    this.progressHandle = this.querySelector('#player-progress-handle');
    this.progressContainer = this.querySelector('#player-progress-container');
    this.title = this.querySelector('#player-title');
    this.image = this.querySelector('#player-image');
    this.time = this.querySelector('#player-time');
    this.duration = this.querySelector('#player-duration');
    this.iconPlay = this.querySelector('#icon-play');
    this.iconPause = this.querySelector('#icon-pause');

    this.sound = null;
    this.isPlaying = false;
    this.playlist = [];
    this.currentIndex = 0;
    this.requestRef = null;

    // Load persisted state if exists
    const savedState = localStorage.getItem('audio-player-state');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            // We could restore playlist here, but auto-playing might be annoying.
            // Let's just restore the playlist structure so if they hit play it works.
            this.playlist = state.playlist || [];
            this.currentIndex = state.currentIndex || 0;
            // Don't auto-play on load unless we implement Soft Nav properly.
        } catch(e) {}
    }

    this.init();
  }

  init() {
    if (this.playPauseBtn) this.playPauseBtn.addEventListener('click', () => this.togglePlay());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.stop());
    
    if (this.progressContainer) {
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
    }

    // Global listener for track clicks (delegated)
    document.addEventListener('click', (e) => {
        const trackItem = e.target.closest('[data-audio-src]');
        if (trackItem) {
            // Build playlist from the DOM list
            const container = trackItem.closest('[data-audio-player-container]');
            if (container) {
                const tracks = Array.from(container.querySelectorAll('[data-audio-src]'));
                const newPlaylist = tracks.map(el => ({
                    title: el.querySelector('.font-sans')?.textContent.trim() || 'Unknown Track',
                    src: el.dataset.audioSrc,
                    image: document.querySelector('.pdp-image')?.src || '', // Grab main product image
                    element: el
                }));
                
                this.playlist = newPlaylist;
                this.currentIndex = parseInt(trackItem.dataset.trackIndex);
                this.play(this.currentIndex);
            }
        }
    });

    // Listen for soft nav re-init
    this.bindTrackListeners();
    document.addEventListener('page:loaded', () => this.bindTrackListeners());
  }

  bindTrackListeners() {
    // Remove old listener if exists (simplified: using delegate on document so just need to re-scan if needed)
    // Actually, since we delegate to document in 'click', we don't need to re-bind listeners.
    // BUT we might want to auto-detect if the new page has a tracklist to highlight the current song.
    
    // Check if current playing song exists in the new page content and highlight it
    if (this.playlist.length > 0 && this.playlist[this.currentIndex]) {
        const currentSrc = this.playlist[this.currentIndex].src;
        const matchingEl = document.querySelector(`[data-audio-src="${currentSrc}"]`);
        
        // Reset all
        document.querySelectorAll('[data-audio-src]').forEach(el => el.classList.remove('bg-gray-50', 'pl-2'));
        
        // Highlight current
        if (matchingEl) {
            matchingEl.classList.add('bg-gray-50', 'pl-2');
        }
    }
  }

  play(index) {
    if (index < 0 || index >= this.playlist.length) return;
    
    // Stop previous
    if (this.sound) {
        this.sound.unload();
    }

    const track = this.playlist[index];
    this.currentIndex = index;
    
    // Update UI
    this.hidden = false;
    this.classList.remove('translate-y-full');
    this.title.textContent = track.title;
    this.image.src = track.image;
    
    // Update active state in list
    document.querySelectorAll('[data-audio-src]').forEach(el => el.classList.remove('bg-gray-50', 'pl-2'));
    if (track.element) {
        track.element.classList.add('bg-gray-50', 'pl-2');
    }

    this.sound = new Howl({
        src: [track.src],
        html5: true,
        volume: 0.8,
        onplay: () => {
            this.isPlaying = true;
            this.updatePlayBtn();
            this.requestRef = requestAnimationFrame(this.updateProgress.bind(this));
            this.saveState();
        },
        onpause: () => {
            this.isPlaying = false;
            this.updatePlayBtn();
            cancelAnimationFrame(this.requestRef);
        },
        onend: () => {
            this.next();
        },
        onload: () => {
            this.duration.textContent = this.formatTime(this.sound.duration());
        }
    });

    this.sound.play();
  }

  togglePlay() {
    if (!this.sound) return;
    if (this.isPlaying) {
        this.sound.pause();
    } else {
        this.sound.play();
    }
  }

  next() {
    if (this.currentIndex < this.playlist.length - 1) {
        this.play(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
        this.play(this.currentIndex - 1);
    }
  }

  stop() {
    if (this.sound) this.sound.unload();
    this.hidden = true;
    this.classList.add('translate-y-full');
    this.isPlaying = false;
    this.saveState(); // Clears active state effectively
  }

  seek(e) {
    if (!this.sound) return;
    const bounds = this.progressContainer.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * this.sound.duration();
    this.sound.seek(newTime);
  }

  updateProgress() {
    if (!this.sound || !this.isPlaying) return;
    
    const seek = this.sound.seek();
    const duration = this.sound.duration();
    const percent = (seek / duration) * 100;
    
    this.progressBar.style.width = `${percent}%`;
    this.progressHandle.style.left = `${percent}%`;
    this.time.textContent = this.formatTime(seek);
    
    this.requestRef = requestAnimationFrame(this.updateProgress.bind(this));
  }

  updatePlayBtn() {
    if (this.isPlaying) {
        this.iconPlay.classList.add('hidden');
        this.iconPause.classList.remove('hidden');
    } else {
        this.iconPlay.classList.remove('hidden');
        this.iconPause.classList.add('hidden');
    }
  }

  formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  saveState() {
    const state = {
        playlist: this.playlist.map(t => ({ title: t.title, src: t.src, image: t.image })), // Don't save element ref
        currentIndex: this.currentIndex,
        isPlaying: this.isPlaying
    };
    localStorage.setItem('audio-player-state', JSON.stringify(state));
  }
}

customElements.define('audio-player-bar', AudioPlayerBar);