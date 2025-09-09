// Floating Music Player System
class MusicPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = null;
        this.autoplayEnabled = true; // Default autoplay enabled
        this.hasUserInteracted = false; // Track if user has manually interacted
        this.playlist = [
            {
                name: "Die With A Smile",
                file: "./assets/sound/lagu1-die.mp3"
            },
            {
                name: "My Love Mine All Mine",
                file: "./assets/sound/lagu2-moon.mp3"
            },
            {
                name: "Until I Found You",
                file: "./assets/sound/lagu3-until.mp3"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadTrack();
        this.checkAutoplay();
    }
    
    setupElements() {
        this.musicPlayer = document.getElementById('musicPlayer');
        this.musicDisc = document.getElementById('musicDisc');
        this.discImage = document.getElementById('discImage');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.currentSongElement = document.getElementById('currentSong');
        this.progressBar = document.getElementById('progressBar');
        this.songProgress = document.getElementById('songProgress');
        this.songSelect = document.getElementById('songSelect');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
    }
    
    setupEventListeners() {
        // Click on disc to play/pause
        this.musicPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hasUserInteracted = true;
            this.togglePlayPause();
        });
        
        // Click on play/pause button
        this.playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hasUserInteracted = true;
            this.togglePlayPause();
        });
        
        // Click on progress bar to seek
        this.songProgress.addEventListener('click', (e) => {
            e.stopPropagation();
            this.seekTo(e);
        });
        
        // Song selector change
        this.songSelect.addEventListener('change', (e) => {
            e.stopPropagation();
            this.hasUserInteracted = true;
            this.selectTrack(parseInt(e.target.value));
        });
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hasUserInteracted = true;
            this.previousTrack();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hasUserInteracted = true;
            this.nextTrack();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space bar to play/pause
            if (e.code === 'Space' && !e.target.matches('input, textarea, select')) {
                e.preventDefault();
                this.hasUserInteracted = true;
                this.togglePlayPause();
            }
            // Arrow keys for next/previous
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.hasUserInteracted = true;
                this.nextTrack();
            }
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.hasUserInteracted = true;
                this.previousTrack();
            }
        });
    }
    
    loadTrack() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        this.audio = new Audio(this.playlist[this.currentTrack].file);
        this.updateUI();
        
        // Audio event listeners
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Failed to load audio');
        });
    }
    
    togglePlayPause() {
        if (!this.audio) {
            this.loadTrack();
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.audio) {
            return;
        }
        
        // Mark as user interacted if this is a manual play
        if (this.hasUserInteracted) {
            localStorage.setItem('musicPlayer_interacted', 'true');
        }
        
        return this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            this.startDiscRotation();
        }).catch((error) => {
            console.error('Playback failed:', error);
            this.showError('Playback failed');
        });
    }
    
    pause() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        this.stopDiscRotation();
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack();
        this.updateSongSelector();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack();
        this.updateSongSelector();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    selectTrack(trackIndex) {
        if (trackIndex >= 0 && trackIndex < this.playlist.length) {
            this.currentTrack = trackIndex;
            this.loadTrack();
            if (this.isPlaying) {
                this.play();
            }
        }
    }
    
    seekTo(event) {
        if (!this.audio) return;
        
        const rect = this.songProgress.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        this.audio.currentTime = newTime;
    }
    
    updateUI() {
        // Update play/pause button
        this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
        
        // Update current song
        this.currentSongElement.textContent = this.playlist[this.currentTrack].name;
        
        // Update song selector
        this.updateSongSelector();
        
        // Update player state
        if (this.isPlaying) {
            this.musicPlayer.classList.add('playing');
            this.musicDisc.classList.add('playing');
        } else {
            this.musicPlayer.classList.remove('playing');
            this.musicDisc.classList.remove('playing');
        }
    }
    
    updateSongSelector() {
        this.songSelect.value = this.currentTrack.toString();
    }
    
    updateProgress() {
        if (!this.audio || !this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    startDiscRotation() {
        this.musicDisc.classList.add('playing');
    }
    
    stopDiscRotation() {
        this.musicDisc.classList.remove('playing');
    }
    
    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 100000000;
            font-size: 14px;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
    }
    
    // Public methods for external control
    getCurrentTrack() {
        return this.playlist[this.currentTrack];
    }
    
    getIsPlaying() {
        return this.isPlaying;
    }
    
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    getVolume() {
        return this.audio ? this.audio.volume : 1;
    }
    
    // Check if autoplay should be enabled
    checkAutoplay() {
        // Check if user has previously interacted with music player
        const hasInteracted = localStorage.getItem('musicPlayer_interacted');
        
        if (hasInteracted === 'true') {
            this.hasUserInteracted = true;
            return; // Don't autoplay if user has interacted before
        }
        
        // Check if autoplay is enabled and user hasn't interacted
        if (this.autoplayEnabled && !this.hasUserInteracted) {
            // Longer delay to ensure page is fully loaded
            setTimeout(() => {
                this.attemptAutoplay();
            }, 3000);
        }
        
        // Add fallback - try autoplay on any user interaction
        this.addFallbackAutoplay();
    }
    
    // Add fallback autoplay on user interaction
    addFallbackAutoplay() {
        const fallbackHandler = () => {
            if (!this.hasUserInteracted && this.autoplayEnabled) {
                this.hasUserInteracted = true;
                this.attemptAutoplay();
            }
            // Remove the event listener after first use
            document.removeEventListener('click', fallbackHandler);
            document.removeEventListener('keydown', fallbackHandler);
        };
        
        // Listen for any user interaction
        document.addEventListener('click', fallbackHandler);
        document.addEventListener('keydown', fallbackHandler);
    }
    
    // Attempt to start autoplay
    async attemptAutoplay() {
        // Ensure audio is loaded
        if (!this.audio) {
            this.loadTrack();
            // Wait a bit for audio to load
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        try {
            // Set volume to a reasonable level for autoplay
            this.setVolume(0.3);
            
            // Try to play
            await this.audio.play();
            
            // Show a subtle notification
            this.showAutoplayNotification();
            
        } catch (error) {
            // Autoplay failed (browser blocked it)
            // Try alternative approach - show a message to user
            this.showAutoplayBlockedMessage();
        }
    }
    
    // Show autoplay notification
    showAutoplayNotification() {
        const notification = document.createElement('div');
        notification.textContent = '🎵 Music started automatically';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 100000000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    // Show autoplay blocked message
    showAutoplayBlockedMessage() {
        const notification = document.createElement('div');
        notification.textContent = '🎵 Click the music player to start music';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(255, 193, 7, 0.9);
            color: #000;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 100000000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
            cursor: pointer;
        `;
        
        // Add click to start music
        notification.addEventListener('click', () => {
            this.hasUserInteracted = true;
            this.play();
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        });
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});

// Export for use in other files
window.MusicPlayer = MusicPlayer;
