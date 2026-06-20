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
  document.querySelectorAll('.car-option').forEach(e =