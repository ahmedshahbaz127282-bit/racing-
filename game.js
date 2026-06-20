window.addEventListener('load', function() {

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let carColor = '#ffffff', carWindow = '#aaddff', carWheel = '#ff0000';
let particles = [];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.getElementById('startBtn').addEventListener('click', function() { showScreen('gameScreen'); restartGame(); });
document.getElementById('garageBtn').addEventListener('click', function() { showScreen('garageScreen'); });
document.getElementById('garageStartBtn').addEventListener('click', function() { showScreen('gameScreen'); restartGame(); });
document.getElementById('backBtn').addEventListener('click', function() { showScreen('menuScreen'); });
document.getElementById('restartBtn').addEventListener('click', function() { restartGame(); });
document.getElementById('homeBtn').addEventListener('click', function() { showScreen('menuScreen'); });

document.getElementById('car-white').addEventListener('click', function() {
  carColor = '#ffffff'; carWindow = '#aaddff'; carWheel = '#ff0000';
  document.querySelectorAll('.car-option').forEach(e => e.classList.remove('selected'));
  this.classList.add('selected');
});
document.getElementById('car-blue').addEventListener('click', function() {
  carColor = '#0044ff'; carWindow = '#aaddff'; carWheel = '#ffffff';
  document.querySelectorAll('.car-option').forEach(e => e.classList.remove('selected'));
  this.classList.add('selected');
});

function playCrashSound() {
  audioCtx.resume();
  const bufferSize = audioCtx.sampleRate * 0.6;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1.5, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
  source.connect(gain); gain.connect(audioCtx.destination);
  source.start();
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: x + 25, y: y + 40,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color: ['#ff0000','#ff6600','#ffff00','#ffffff'][Math.floor(Math.random()*4)],
      size: Math.random() * 7 + 2
    });
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.03; p.size *= 0.95;
  });
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0);
}

function drawBackground(offset) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#0a0a2a');
  grad.addColorStop(1, '#1a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff88';
  [[20,30],[80,20],[150,10],[250,25],[300,15],[50,60],[200,50]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
  });

  ctx.fillStyle = '#1a1a3a'; ctx.fillRect(0, 80, 25, 120);
  ctx.fillStyle = '#2a2a4a'; ctx.fillRect(0, 50, 20, 150);
  ctx.fillStyle = '#ffff0066';
  for(let r=0; r<3; r++) for(let c=0; c<2; c++) {
    ctx.fillRect(3 + c*8, 60 + r*15, 5, 7);
  }
  ctx.fillStyle = '#1a1a3a'; ctx.fillRect(295, 60, 25, 140);
  ctx.fillStyle = '#2a2a4a'; ctx.fillRect(300, 40, 20, 160);
  ctx.fillStyle = '#ffff0066';
  for(let r=0; r<3; r++) for(let c=0; c<2; c++) {
    ctx.fillRect(302 + c*8, 55 + r*15, 5, 7);
  }

  ctx.fillStyle = '#2a2a2a'; ctx.fillRect(30, 0, 260, canvas.height);
  ctx.fillStyle = '#ffffff44';
  ctx.fillRect(30, 0, 5, canvas.height);
  ctx.fillRect(285, 0, 5, canvas.height);

  for(let i=0; i<6; i++) {
    [{x:10},{x:295}].forEach(t => {
      const ty = ((i * 100 + offset) % (canvas.height + 60)) - 30;
      ctx.fillStyle = '#4a2800'; ctx.fillRect(t.x + 5, ty + 20, 6, 15);
      ctx.fillStyle = '#1a5c1a';
      ctx.beginPath(); ctx.arc(t.x + 8, ty + 15, 12, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2a7a2a';
      ctx.beginPath(); ctx.arc(t.x + 8, ty + 8, 9, 0, Math.PI*2); ctx.fill();
    });
  }

  ctx.fillStyle = '#ffffff66';
  for (let i = -1; i < 13; i++) {
    ctx.fillRect(canvas.width/2 - 4, i * 40 + (offset % 40), 8, 25);
  }
}

function drawCar(x, y, body, win, wheel) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x + 25, y + 82, 22, 6, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.roundRect(x, y + 20, 50, 55, 6); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 8, y, 34, 30, 8); ctx.fill();
  ctx.fillStyle = win;
  ctx.beginPath(); ctx.roundRect(x + 10, y + 4, 30, 18, 4); ctx.fill();
  ctx.fillStyle = '#ffffaa';
  ctx.beginPath(); ctx.arc(x + 10, y + 22, 5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 40, y + 22, 5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff2200';
  ctx.beginPath(); ctx.arc(x + 10, y + 68, 4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 40, y + 68, 4, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111';
  [30, 62].forEach(wy => {
    ctx.beginPath(); ctx.arc(x + 8, y + wy, 9, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 42, y + wy, 9, 0, Math.PI*2); ctx.fill();
  });
  ctx.fillStyle = wheel;
  [30, 62].forEach(wy => {
    ctx.beginPath(); ctx.arc(x + 8, y + wy, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 42, y + wy, 5, 0, Math.PI*2); ctx.fill();
  });
}

let playerX = 130, score = 0, best = 0, gameOver = true;
let enemyX = 100, enemyY = -100, enemySpeed = 5;
let roadOffset = 0, leftHeld = false, rightHeld = false;
const playerW = 50, playerH = 80, enemyW = 50, enemyH = 80;
const playerY = canvas.height - 130;

function handleHold() {
  if (leftHeld) playerX = Math.max(35, playerX - 8);
  if (rightHeld) playerX = Math.min(canvas.width - playerW - 35, playerX + 8);
}

function update() {
  if (gameOver) { drawParticles(); return; }
  handleHold();
  enemyY += enemySpeed;
  roadOffset = (roadOffset + enemySpeed) % (canvas.height + 60);

  if (enemyY > canvas.height) {
    enemyY = -120;
    enemyX = Math.random() * (canvas.width - enemyW - 80) + 40;
    score++;
    document.getElementById('score').textContent = score;
    if (score > best) { best = score; document.getElementById('best').textContent = best; }
    enemySpeed += 0.3;
  }

  const margin = 15;
  if (playerX + margin < enemyX + enemyW - margin &&
      playerX + playerW - margin > enemyX + margin &&
      playerY + margin < enemyY + enemyH - margin &&
      playerY + playerH - margin > enemyY + margin) {
    gameOver = true;
    playCrashSound();
    spawnExplosion(playerX, playerY);
    document.getElementById('restartBtn').style.display = 'block';
    document.getElementById('homeBtn').style.display = 'block';
    setTimeout(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 38px Arial';
      ctx.fillText('GAME OVER', 35, canvas.height/2 - 20);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText('Score: ' + score, 110, canvas.height/2 + 30);
    }, 800);
    return;
  }

  drawBackground(roadOffset);
  drawParticles();
  drawCar(enemyX, enemyY, '#ff0000', '#ff8888', '#333333');
  drawCar(playerX, playerY, carColor, carWindow, carWheel);
  requestAnimationFrame(update);
}

function restartGame() {
  playerX = 130; score = 0; enemyY = -120;
  enemyX = 100; enemySpeed = 5; gameOver = false;
  leftHeld = false; rightHeld = false; particles = [];
  document.getElementById('score').textContent = 0;
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('homeBtn').style.display = 'none';
  update();
}

document.getElementById('leftBtn').addEventListener('touchstart', e => { e.preventDefault(); leftHeld = true; audioCtx.resume(); });
document.getElementById('leftBtn').addEventListener('touchend', e => { e.preventDefault(); leftHeld = false; });
document.getElementById('rightBtn').addEventListener('touchstart', e => { e.preventDefault(); rightHeld = true; audioCtx.resume(); });
document.getElementById('rightBtn').addEventListener('touchend', e => { e.preventDefault(); rightHeld = false; });
document.getElementById('leftBtn').addEventListener('mousedown', () => { leftHeld = true; audioCtx.resume(); });
document.getElementById('leftBtn').addEventListener('mouseup', () => leftHeld = false);
document.getElementById('rightBtn').addEventListener('mousedown', () => { rightHeld = true; audioCtx.resume(); });
document.getElementById('rightBtn').addEventListener('mouseup', () => rightHeld = false);

}); // end window.load