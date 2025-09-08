/* ===== SPLITTING TEXT ANIMATION ===== */
Splitting();

/* ===== YEAR AUTO UPDATE ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== ENHANCED TYPING EFFECT ===== */
const texts = [
    "Welcome to my digital realm! 🚀",
    "Your trusted middleman 🛡️",
    "Tempat jual & beli aman dan terpercaya 💎",
    "Join the community, let's grow together! 🎮",
    "Safe trading, secure transactions, trusted service ✨"
];

let textIndex = 0;
let charIndex = 0;
const typedTextElement = document.getElementById('typed-text');

function typeText() {
    if (charIndex < texts[textIndex].length) {
        typedTextElement.textContent += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 60);
    } else {
        setTimeout(eraseText, 2500);
    }
}

function eraseText() {
    if (charIndex > 0) {
        typedTextElement.textContent = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 40);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeText, 800);
    }
}

/* ===== BGM CONTROL - FIXED AUDIO PLAYING ===== */
const bgm = document.getElementById('bgm');
const btn = document.getElementById('music-btn');

// Initialize with ACTUAL audio state check
function updateButtonState() {
    if (!bgm || !btn) return;
    
    if (bgm.paused) {
        btn.innerHTML = '<i class="bx bx-play"></i>';
        console.log('🔇 Button: Play state (audio paused)');
    } else {
        btn.innerHTML = '<i class="bx bx-pause"></i>';
        console.log('🎵 Button: Pause state (audio playing)');
    }
}

// Enhanced BGM setup
if (bgm) {
    // Set audio properties
    bgm.volume = 0.5;
    bgm.loop = true;
    bgm.preload = 'auto';
    
    // Event listeners for actual audio state
    bgm.addEventListener('play', () => {
        console.log('▶️ AUDIO ACTUALLY PLAYING');
        updateButtonState();
    });
    
    bgm.addEventListener('pause', () => {
        console.log('⏸️ AUDIO ACTUALLY PAUSED');
        updateButtonState();
    });
    
    bgm.addEventListener('loadeddata', () => {
        console.log('✅ BGM loaded, attempting autoplay...');
        tryAutoPlay();
    });
    
    bgm.addEventListener('error', (e) => {
        console.log('❌ BGM Error:', e);
        console.log('❌ Check if bgm.mp3 exists in same folder as HTML');
        if (btn) btn.style.display = 'none';
    });
}

// Auto-play function that actually works
async function tryAutoPlay() {
    if (!bgm) return;
    
    try {
        // Force unmute first
        bgm.muted = false;
        
        // Attempt to play
        const playPromise = bgm.play();
        
        if (playPromise !== undefined) {
            await playPromise;
            console.log('🎵 AUTO-PLAY SUCCESS - Audio is playing!');
            updateButtonState();
        }
    } catch (error) {
        console.log('🔇 Auto-play blocked:', error.message);
        console.log('👆 User must interact with page first');
        
        // Set up one-time interaction listeners
        const enableAudio = async () => {
            try {
                bgm.muted = false;
                await bgm.play();
                console.log('🎵 Audio enabled after user interaction!');
                updateButtonState();
            } catch (e) {
                console.log('❌ Still failed:', e.message);
            }
        };
        
        // Listen for ANY user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('scroll', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }
}

// Button click handler - SYNC WITH ACTUAL AUDIO STATE
if (btn && bgm) {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            if (bgm.paused) {
                // Audio is paused -> PLAY it
                console.log('🎵 User clicked play...');
                bgm.muted = false;
                await bgm.play();
                console.log('✅ Audio now playing');
            } else {
                // Audio is playing -> PAUSE it
                console.log('⏸️ User clicked pause...');
                bgm.pause();
                console.log('✅ Audio now paused');
            }
            
            // Button state will update automatically via event listeners
            
        } catch (error) {
            console.log('❌ Button click error:', error.message);
            
            // Show error feedback
            btn.innerHTML = '❌';
            setTimeout(updateButtonState, 2000);
        }
    });
    
    // Hover effects
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.15) rotate(10deg)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1) rotate(0deg)';
    });
}

/* ===== TETRIS BLOCKS RAIN ===== */
class TetrisBlocksRain {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.blockSize = 25;
        this.blocks = [];

        // Tetris colors dengan opacity
        this.colors = [
            'rgba(138, 43, 226, 0.7)', // Purple
            'rgba(255, 77, 109, 0.7)', // Pink
            'rgba(75, 0, 130, 0.7)', // Indigo
            'rgba(106, 13, 173, 0.7)', // Dark violet
            'rgba(147, 0, 211, 0.7)', // Dark magenta
            'rgba(255, 140, 68, 0.7)', // Orange
            'rgba(255, 221, 68, 0.7)' // Yellow
        ];

        // Tetris piece shapes  
        this.shapes = [
            [[1,1,1,1]], // I-piece
            [[1,1],[1,1]], // O-piece
            [[0,1,0],[1,1,1]], // T-piece
            [[1,0,0],[1,1,1]], // L-piece
            [[0,0,1],[1,1,1]], // J-piece
            [[0,1,1],[1,1,0]], // S-piece
            [[1,1,0],[0,1,1]] // Z-piece
        ];

        this.animate();
    }

    spawnBlock() {
        // Spawn tetris blocks randomly
        if (Math.random() > 0.985) {
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];

            this.blocks.push({
                x: Math.random() * (this.canvas.width - this.blockSize * 4),
                y: -this.blockSize * shape.length,
                shape: shape,
                color: color,
                speed: Math.random() * 2 + 1,
                rotation: Math.random() * 0.02 - 0.01,
                opacity: Math.random() * 0.3 + 0.7
            });
        }
    }

    drawBlock(x, y, color, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;

        // Main block
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.blockSize - 2, this.blockSize - 2);

        // 3D effect - highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillRect(x, y, this.blockSize - 2, 3);
        this.ctx.fillRect(x, y, 3, this.blockSize - 2);

        // 3D effect - shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(x + this.blockSize - 5, y + 3, 3, this.blockSize - 5);
        this.ctx.fillRect(x + 3, y + this.blockSize - 5, this.blockSize - 5, 3);

        this.ctx.restore();
    }

    draw() {
        // Clear canvas dengan fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw blocks
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];

            // Move block down
            block.y += block.speed;

            // Slight horizontal drift
            if (block.rotation !== 0) {
                block.x += Math.sin(block.y * 0.01) * 0.5;
            }

            // Fade out at bottom
            if (block.y > this.canvas.height - 200) {
                block.opacity -= 0.01;
            }

            // Remove if off screen or faded
            if (block.y > this.canvas.height + 50 || block.opacity <= 0) {
                this.blocks.splice(i, 1);
                continue;
            }

            // Draw tetris piece
            for (let row = 0; row < block.shape.length; row++) {
                for (let col = 0; col < block.shape[row].length; col++) {
                    if (block.shape[row][col]) {
                        const cellX = block.x + col * this.blockSize;
                        const cellY = block.y + row * this.blockSize;

                        // Only draw if within canvas bounds
                        if (cellX >= -this.blockSize && cellX < this.canvas.width &&
                            cellY >= -this.blockSize && cellY < this.canvas.height) {
                            this.drawBlock(cellX, cellY, block.color, block.opacity);
                        }
                    }
                }
            }
        }

        // Spawn new blocks
        this.spawnBlock();
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    // Handle window resize
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

/* ===== PHOTO ZOOM FUNCTIONS - ENHANCED ===== */
function openPhotoZoom(element) {
    const modal = document.getElementById('photoZoomModal');
    const modalImg = document.getElementById('zoomedImage');
    const img = element.querySelector('img');
    
    if (img && img.src) {
        // Get higher resolution version
        let imgSrc = img.src;
        if (imgSrc.includes('sz=w400')) {
            imgSrc = imgSrc.replace('sz=w400', 'sz=w1200');
        }
        
        modalImg.src = imgSrc;
        modalImg.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('🔍 Photo zoom opened:', imgSrc);
    }
}

function closePhotoZoom() {
    const modal = document.getElementById('photoZoomModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear image source after modal closes
    setTimeout(() => {
        const modalImg = document.getElementById('zoomedImage');
        if (modalImg) {
            modalImg.src = '';
        }
    }, 300);
    
    console.log('🔍 Photo zoom closed');
}

/* ===== SECURITY WARNINGS ===== */
function showSecurityWarning() {
    if (document.location.hostname !== 'localhost' && document.location.hostname !== '127.0.0.1') {
        console.log('%cCARDO GAMING SECURITY WARNING!', 'color: #ef4444; font-size: 20px; font-weight: bold;');
        console.log('%cJika kamu melihat website ini di domain selain yang resmi, kemungkinan ini adalah situs CLONE!', 'color: #ef4444; font-size: 14px;');
        console.log('%cSelalu verifikasi kontak di halaman contact.html yang resmi!', 'color: #22c55e; font-size: 14px;');
    }
}

/* ===== INITIALIZE EVERYTHING ===== */
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Website initializing...');
    
    // Start typing effect
    if (document.getElementById('typed-text')) {
        setTimeout(typeText, 1500);
    }

    // Initialize tetris blocks rain
    const tetrisRain = new TetrisBlocksRain();

    // Handle window resize
    window.addEventListener('resize', () => {
        if (tetrisRain) {
            tetrisRain.resize();
        }
    });

    // BGM Debug Info
    if (bgm) {
        console.log('🎵 BGM found:', bgm);
        console.log('🎵 BGM src:', bgm.src);
        console.log('🎵 Attempting auto-play in 2 seconds...');
        
        // Try auto-play after page is fully loaded
        setTimeout(() => {
            tryAutoPlay();
        }, 2000);
        
    } else {
        console.log('❌ BGM element not found - check HTML');
    }
    
    // INITIALIZE PHOTO ZOOM FUNCTIONALITY
    const modal = document.getElementById('photoZoomModal');
    
    if (modal) {
        console.log('🔍 Photo zoom modal found - initializing...');
        
        // Close when clicking outside image
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePhotoZoom();
            }
        });
        
        // Prevent modal content click from closing
        const zoomContent = modal.querySelector('.zoom-content');
        if (zoomContent) {
            zoomContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Close button event
        const closeBtn = modal.querySelector('.zoom-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePhotoZoom);
        }
        
        console.log('✅ Photo zoom initialized');
    } else {
        console.log('⚠️ Photo zoom modal not found');
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closePhotoZoom();
        }
    });
    
    console.log('✅ Website initialization complete');
});

// Run security check
showSecurityWarning();
