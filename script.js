// 页面元素
const pages = {
    start: document.getElementById('page-start'),
    dialogue: document.getElementById('page-dialogue'),
    linabel: document.getElementById('page-linabel'),
    birthday: document.getElementById('page-birthday'),
    gallery: document.getElementById('page-gallery')
};

// 音乐
const bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-happy-birthday-music-box-518.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const musicBtn = document.getElementById('music-btn');
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
    } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
    }
    musicPlaying = !musicPlaying;
});

// 对话内容
const dialogues = [
    '今天是个特别的日子',
    '在这个美好的时刻',
    '有人想对你说',
    '愿你的每一天都充满欢笑',
    '愿你的梦想都能实现',
    '现在，准备好接受惊喜了吗？'
];

let currentDialogue = 0;
let currentPage = 'start';

// 切换页面
function switchPage(from, to) {
    pages[from].classList.remove('active');
    pages[from].classList.add('prev');
    pages[to].classList.add('active');
    pages[to].classList.remove('prev');
    currentPage = to;
}

// 开场页 - 点击礼物
pages.start.querySelector('.gift-icon').addEventListener('click', () => {
    switchPage('start', 'dialogue');
    showDialogue();
    if (!musicPlaying) {
        bgMusic.play();
        musicBtn.classList.add('playing');
        musicPlaying = true;
    }
});

// 显示对话
function showDialogue() {
    const dialogueText = document.getElementById('dialogue-text');
    dialogueText.textContent = '';
    
    let text = dialogues[currentDialogue];
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            dialogueText.textContent += text[index];
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// 对话页 - 继续按钮
document.getElementById('btn-next').addEventListener('click', () => {
    currentDialogue++;
    if (currentDialogue < dialogues.length) {
        showDialogue();
    } else {
        switchPage('dialogue', 'linabel');
    }
});

// 贝儿页 - 点击计数
let linabelClicks = 0;
const linabelImg = document.getElementById('linabel-img');
const clickCounter = document.getElementById('click-counter');

linabelImg.addEventListener('click', () => {
    linabelClicks++;
    clickCounter.textContent = `${linabelClicks}/3`;
    
    linabelImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
        linabelImg.style.transform = 'scale(1)';
    }, 200);
    
    if (linabelClicks >= 3) {
        setTimeout(() => {
            switchPage('linabel', 'birthday');
            launchFireworks();
        }, 500);
    }
});

// 生日页 - 许愿按钮
document.getElementById('btn-wish').addEventListener('click', () => {
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
    document.querySelector('.birthday-title').textContent = randomWish;
    launchFireworks();
});

// 生日页 - 相册按钮
document.getElementById('btn-gallery').addEventListener('click', () => {
    switchPage('birthday', 'gallery');
    loadGallery();
});

// 相册页 - 关闭按钮
document.getElementById('btn-close-gallery').addEventListener('click', () => {
    switchPage('gallery', 'birthday');
});

// 加载相册
function loadGallery() {
    const galleryScroll = document.getElementById('gallery-scroll');
    
    if (galleryScroll.children.length > 0) return;
    
    const photos = [
        'images/xuyuan.jpg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/你的小可爱突然出现.jpeg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/贝儿害羞.jpeg',
        'https://raw.githubusercontent.com/alsotang/linabell_stickers/main/images/贝儿开心.jpeg'
    ];
    
    photos.forEach(src => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${src}" alt="回忆">`;
        galleryScroll.appendChild(item);
    });
}

// 烟花效果
function launchFireworks() {
    const container = document.getElementById('fireworks');
    const colors = ['#ff6b9d', '#ffd700', '#00d4ff', '#ff00ff', '#00ff88'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(container, colors);
        }, i * 300);
    }
}

function createFirework(container, colors) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--x', tx + 'px');
        particle.style.setProperty('--y', ty + 'px');
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}