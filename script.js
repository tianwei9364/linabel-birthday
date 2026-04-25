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

        // Play background music
        const audio = document.createElement('audio');
        audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        audio.loop = true;
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));

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

    // Create door
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

    doorContainer.addEventListener('click', () => {
        doorLeft.classList.add('door-open-left');
        doorRight.classList.add('door-open-right');
        doorHint.style.opacity = '0';

        setTimeout(() => {
            doorContainer.remove();
            showLinabelCharacter();
        }, 800);
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

    // Add click interaction
    let clickCount = 0;
    linabelImg.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            birthdayText.textContent = '💖 翁苑婷，愿你永远开心快乐！';
        } else if (clickCount === 2) {
            birthdayText.textContent = '🌟 愿所有美好都如期而至！';
        } else if (clickCount === 3) {
            birthdayText.textContent = '🎈 今天的你最闪耀！';
            clickCount = 0;
        }

        // Create fireworks on click
        createFireworks(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight / 2
        );
    });

    scene.appendChild(linabelImg);

    const birthdayText = document.createElement('div');
    birthdayText.className = 'birthday-text';
    birthdayText.textContent = '🎂 翁苑婷，生日快乐呀！🎉';

    setTimeout(() => {
        scene.appendChild(birthdayText);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFireworks(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight / 2
                );
            }, i * 200);
        }

        // Add wish button
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
                    '🎁 愿你拥有想要的一切'
                ];
                const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
                birthdayText.textContent = randomWish;

                // More fireworks
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        createFireworks(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight / 2
                        );
                    }, i * 100);
                }
            });
            scene.appendChild(wishBtn);
        }, 1500);
    }, 1000);
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
