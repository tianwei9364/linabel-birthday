const dialogues = [
    "今天是个特别的日子...",
    "有人想要见你 💕",
    "她从很远很远的地方赶来...",
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

function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        scene.appendChild(star);
    }
}

function createGiftBox() {
    const giftBox = document.createElement('div');
    giftBox.className = 'gift-box';

    const bow = document.createElement('div');
    bow.className = 'gift-bow';
    giftBox.appendChild(bow);

    giftBox.addEventListener('click', () => {
        giftBox.classList.add('shake');
        setTimeout(() => {
            giftBox.remove();
            showDialogue();
        }, 500);
    });

    scene.appendChild(giftBox);
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
        setTimeout(() => typeWriter(text, index + 1), 50);
    }
}

function createHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        scene.appendChild(heart);

        setTimeout(() => heart.remove(), 5000);
    }, 300);
}

function createFireworks(x, y) {
    const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98'];

    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        firework.style.setProperty('--x', tx + 'px');
        firework.style.setProperty('--y', ty + 'px');

        scene.appendChild(firework);
        setTimeout(() => firework.remove(), 1000);
    }
}

function showLinabel() {
    scene.innerHTML = '';
    createStars();
    createHearts();

    const linabelImg = document.createElement('img');
    linabelImg.className = 'linabel';
    linabelImg.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&h=400&fit=crop';
    linabelImg.alt = 'LinaBell';
    scene.appendChild(linabelImg);

    setTimeout(() => {
        const birthdayText = document.createElement('div');
        birthdayText.className = 'birthday-text';
        birthdayText.textContent = '🎂 生日快乐呀！🎉';
        scene.appendChild(birthdayText);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFireworks(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight / 2
                );
            }, i * 200);
        }
    }, 1000);

    dialogueBox.classList.add('hidden');
}

nextBtn.addEventListener('click', () => {
    currentDialogue++;

    if (currentDialogue < dialogues.length) {
        typeWriter(dialogues[currentDialogue]);
    } else {
        showLinabel();
    }
});

createStars();
createGiftBox();