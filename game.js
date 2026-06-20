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
    ct