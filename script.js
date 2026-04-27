const dialogues = [
    "今天是个特别的日子...",
    "亲爱的翁苑婷 💕",
    "有人从很远很远的地方赶来...",
    "她说她有话想对你说...",
    "你准备好了吗？",
    "3...",
    "2...",
    "1...",
    "✨ 生日快乐！✨"
];

let currentDialogue = 0;
const scene = document.getElementById('scene');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const nextBtn = document.getElementById('next-btn');
const musicControl = document.getElementById('music-control');
const musicToggle = document.querySelector('.music-toggle');
let audioContext, analyser, audioElement, dataArray;

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 60 + 300}, 70%, 70%)`;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z -= this.vz;

        if (this.z <= 0 || this.x < 0 || this.x > this.canvas.width || 
            this.y < 0 || this.y > this.canvas.height) {
            this.reset();
            this.z = 1000;
        }
    }

    draw(ctx) {
        const scale = 1000 / (1000 + this.z);
        const x2d = (this.x - this.canvas.width / 2) * scale + this.canvas.width / 2;
        const y2d = (this.y - this.canvas.height / 2) * scale + this.canvas.height / 2;
        const size = this.size * scale;

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 200 }, () => new Particle(canvas));

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initAudioVisualizer() {
    const canvas = document.getElementById('visualizer-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 200;

    function drawVisualizer() {
        if (!analyser || !dataArray) {
            requestAnimationFrame(drawVisualizer);
            return;
        }

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / dataArray.length * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
            const hue = (i / dataArray.length) * 360;
            
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            ctx.fillStyle = `hsla(${hue}, 70%, 80%, 0.4)`;
            ctx.fillRect(x, canvas.height - barHeight - 5, barWidth, 5);

            x += barWidth + 1;
        }

        requestAnimationFrame(drawVisualizer);
    }

    drawVisualizer();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
    });
}

function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        scene.appendChild(star);
    }
}

function createGiftBox() {
    const giftBox = document.createElement('div');
    giftBox.className = 'gift-box';

    const bow = document.createElement('div');
    bow.className = 'gift-bow';
    giftBox.appendChild(bow);

    let clickCount = 0;
    giftBox.addEventListener('click', () => {
        clickCount++;
        giftBox.classList.add('shake');

        if (clickCount === 1) {
            playBackgroundMusic();
        }

        if (clickCount >= 3) {
            setTimeout(() => {
                giftBox.style.transform = 'scale(0) rotate(180deg)';
                giftBox.style.opacity = '0';
                setTimeout(() => {
                    giftBox.remove();
                    showDialogue();
                }, 500);
            }, 500);
        } else {
            setTimeout(() => giftBox.classList.remove('shake'), 500);
        }
    });

    scene.appendChild(giftBox);
}

function playBackgroundMusic() {
    audioElement = document.createElement('audio');
    audioElement.src = 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-music-box-518.mp3';
    audioElement.loop = true;
    audioElement.volume = 0.5;
    audioElement.crossOrigin = 'anonymous';
    
    audioElement.play().then(() => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        musicControl.classList.remove('hidden');
        musicToggle.classList.add('playing');
    }).catch(e => console.log('Audio play failed:', e));

    musicToggle.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play();
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        } else {
            audioElement.pause();
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🔇';
        }
    });
}

function showDialogue() {
    dialogueBox.classList.remove('hidden');
    typeWriter(dialogues[currentDialogue]);
}

function typeWriter(text, index = 0) {
    if (index === 0) {
        dialogueText.textContent = '';
    }

    if (index < text.length) {
        dialogueText.textContent += text.charAt(index);
        
        if (Math.random() > 0.7) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBQLSKDf8sFuIwUug8zx2Ik2CBhku+zooVARC0yl4fG5ZRwFNo3V7859LwUofsz');
            audio.volume = 0.1;
            audio.play().catch(() => {});
        }
        
        setTimeout(() => typeWriter(text, index + 1), 80);
    }
}

function createHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heart.style.width = (Math.random() * 15 + 15) + 'px';
        heart.style.height = (Math.random() * 15 + 15) + 'px';
        scene.appendChild(heart);

        setTimeout(() => heart.remove(), 6000);
    }, 200);
}

function createFireworks(x, y) {
    const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#ff1493', '#00ffff'];

    for (let i = 0; i < 50; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 80 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        firework.style.setProperty('--x', tx + 'px');
        firework.style.setProperty('--y', ty + 'px');

        scene.appendChild(firework);
        setTimeout(() => firework.remove(), 1500);
    }
}

function showLinabel() {
    scene.innerHTML = '';
    createStars();

    const doorContainer = document.createElement('div');
    doorContainer.className = 'door-container';

    const doorLeft = document.createElement('div');
    doorLeft.className = 'door door-left';
    const doorRight = document.createElement('div');
    doorRight.className = 'door door-right';

    const doorKnob = document.createElement('div');
    doorKnob.className = 'door-knob';

    const doorHint = document.createElement('div');
    doorHint.className = 'door-hint';
    doorHint.textContent = '🚪 点击开门迎接贝儿';

    doorContainer.appendChild(doorLeft);
    doorContainer.appendChild(doorRight);
    doorContainer.appendChild(doorKnob);
    doorContainer.appendChild(doorHint);

    let doorClicked = false;
    doorContainer.addEventListener('click', () => {
        if (doorClicked) return;
        doorClicked = true;
        
        doorLeft.classList.add('door-open-left');
        doorRight.classList.add('door-open-right');
        doorHint.style.opacity = '0';

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createFireworks(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 200
                );
            }, i * 100);
        }

        setTimeout(() => {
            doorContainer.remove();
            showLinabelCharacter();
        }, 1000);
    });

    scene.appendChild(doorContainer);
    dialogueBox.classList.add('hidden');
}

function showLinabelCharacter() {
    createHearts();

    const linabelImg = document.createElement('img');
    linabelImg.className = 'linabel';
    linabelImg.src = 'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/你的小可爱突然出现.jpeg';
    linabelImg.alt = 'LinaBell';

    let clickCount = 0;
    let longPressTimer;
    
    linabelImg.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
            showPhotoGallery();
        }, 1000);
    });
    
    linabelImg.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
    });
    
    linabelImg.addEventListener('mouseleave', () => {
        clearTimeout(longPressTimer);
    });

    linabelImg.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 1) {
            linabelImg.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                linabelImg.style.transform = 'scale(1)';
            }, 300);
        } else if (clickCount === 3) {
            linabelImg.style.transition = 'all 0.8s';
            linabelImg.style.transform = 'scale(0) rotate(360deg)';
            linabelImg.style.opacity = '0';
            
            setTimeout(() => {
                linabelImg.remove();
                showBirthdayPhoto();
            }, 800);
        }
    });

    scene.appendChild(linabelImg);

    const hintText = document.createElement('div');
    hintText.className = 'birthday-text';
    hintText.textContent = '💕 点击贝儿3次，她有惊喜给你！';
    hintText.style.fontSize = '32px';

    setTimeout(() => {
        scene.appendChild(hintText);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFireworks(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight / 2
                );
            }, i * 300);
        }
    }, 500);
}

function showBirthdayPhoto() {
    const photoImg = document.createElement('img');
    photoImg.className = 'linabel';
    photoImg.src = 'images/xuyuan.jpg';
    photoImg.alt = '生日快乐';
    photoImg.style.opacity = '0';

    let clickCount = 0;
    let longPressTimer;
    
    photoImg.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
            showPhotoGallery();
        }, 1000);
    });
    
    photoImg.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
    });
    
    photoImg.addEventListener('mouseleave', () => {
        clearTimeout(longPressTimer);
    });

    photoImg.addEventListener('click', () => {
        clickCount++;
        const messages = [
            '💖 翁苑婷，愿你永远开心快乐！',
            '🌟 愿所有美好都如期而至！',
            '🎈 今天的你最闪耀！',
            '🌸 愿你被世界温柔以待！',
            '✨ 愿你的笑容永远灿烂！',
            '🎀 愿你拥有想要的一切！'
        ];
        
        birthdayText.textContent = messages[clickCount % messages.length];

        createFireworks(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight / 2
        );
    });

    scene.appendChild(photoImg);

    const birthdayText = document.createElement('div');
    birthdayText.className = 'birthday-text';
    birthdayText.textContent = '🎂 翁苑婷，生日快乐呀！🎉';

    setTimeout(() => {
        photoImg.style.opacity = '1';
        scene.appendChild(birthdayText);

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFireworks(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight / 2
                );
            }, i * 250);
        }

        setTimeout(() => {
            const wishBtn = document.createElement('button');
            wishBtn.className = 'wish-btn';
            wishBtn.textContent = '💫 许个愿吧';
            wishBtn.addEventListener('click', () => {
                const wishes = [
                    '🌸 愿你的每一天都充满阳光',
                    '🎀 愿你的梦想都能实现',
                    '🌈 愿你被世界温柔以待',
                    '✨ 愿你永远保持少女心',
                    '🎁 愿你拥有想要的一切',
                    '💝 愿你被爱包围',
                    '🌺 愿你的生活如花般绚烂',
                    '🎪 愿你的人生充满惊喜'
                ];
                const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
                birthdayText.textContent = randomWish;

                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createFireworks(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight / 2
                        );
                    }, i * 150);
                }
            });
            scene.appendChild(wishBtn);
        }, 2000);
    }, 100);
}

function showPhotoGallery() {
    const gallery = document.getElementById('photo-gallery');
    gallery.classList.remove('hidden');
    
    const galleryGrid = gallery.querySelector('.gallery-grid');
    galleryGrid.innerHTML = '';
    
    const photos = [
        'images/xuyuan.jpg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/你的小可爱突然出现.jpeg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/贝儿害羞.jpeg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/贝儿开心.jpeg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/贝儿生气.jpeg'
    ];
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = (index * 0.1) + 's';
        
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `Memory ${index + 1}`;
        
        item.appendChild(img);
        galleryGrid.appendChild(item);
    });
    
    gallery.querySelector('.gallery-close').addEventListener('click', () => {
        gallery.classList.add('hidden');
    });
}

nextBtn.addEventListener('click', () => {
    currentDialogue++;

    if (currentDialogue < dialogues.length) {
        typeWriter(dialogues[currentDialogue]);
    } else {
        showLinabel();
    }
});

initParticles();
initAudioVisualizer();
createStars();
createGiftBox();
