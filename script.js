const $ = (id) => document.getElementById(id);
const cells = [...document.querySelectorAll(".cell")];
const STORAGE_KEY = "diwakar-tic-tac-toe-v1";
const wins = { X: 0, O: 0, draw: 0 };
let board = Array(9).fill("");
let current = "X";
let finished = false;
let startedAt = Date.now();
let timerInterval;

function player(mark) {
  const value = mark === "X" ? $("playerX").value.trim() : $("playerO").value.trim();
  return value || (mark === "X" ? "Player 1" : "Player 2");
}
function stamp(date = new Date()) {
  return date.toLocaleString([], { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ wins, history, names: { X: $("playerX").value, O: $("playerO").value } }));
}
let history = [];
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (data.wins) Object.assign(wins, data.wins);
    history = Array.isArray(data.history) ? data.history : [];
    if (data.names) { $("playerX").value = data.names.X || "Player 1"; $("playerO").value = data.names.O || "Player 2"; }
  } catch { history = []; }
}
function renderScores() {
  $("scoreNameX").textContent = player("X");
  $("scoreNameO").textContent = player("O");
  $("winsX").textContent = wins.X;
  $("winsO").textContent = wins.O;
  $("draws").textContent = wins.draw;
}
function renderHistory() {
  $("history").innerHTML = "";
  if (!history.length) {
    const li = document.createElement("li"); li.className = "empty"; li.textContent = "No matches yet. Play your first game!"; $("history").append(li); return;
  }
  history.slice(0, 30).forEach(item => {
    const li = document.createElement("li");
    const names = document.createElement("strong"); names.textContent = `${item.x} vs ${item.o}`;
    const result = document.createElement("span"); result.className = "result"; result.textContent = item.result;
    const time = document.createElement("time"); time.textContent = item.time;
    li.append(names, result, time); $("history").append(li);
  });
}
function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.classList.toggle("o", board[i] === "O");
    cell.classList.toggle("winner", false);
    cell.disabled = finished || Boolean(board[i]);
  });
  $("status").textContent = finished ? "🏁 Match complete — start a new game!" : `🎮 ${player(current)}'s turn (${current})`;
  renderScores();
}
function winningLine() {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.find(line => line.every(i => board[i] === current));
}
function record(result) {
  const entry = { x: player("X"), o: player("O"), result, time: stamp() };
  history.unshift(entry);
  if (history.length > 100) history.length = 100;
  renderHistory(); save();
}
function play(index) {
  if (finished || board[index]) return;
  board[index] = current;
  const line = winningLine();
  if (line) {
    finished = true; wins[current]++;
    line.forEach(i => cells[i].classList.add("winner"));
    $("status").textContent = `🎉 ${player(current)} wins!`;
    record(`${player(current)} wins`);
  } else if (board.every(Boolean)) {
    finished = true; wins.draw++;
    $("status").textContent = "🤝 It's a draw!";
    record("Draw");
  } else current = current === "X" ? "O" : "X";
  render(); save();
}
function newGame() {
  board = Array(9).fill(""); current = "X"; finished = false; startedAt = Date.now();
  render();
}
function updateTimer() {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);
  $("timer").textContent = `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
}
cells.forEach(cell => cell.addEventListener("click", () => play(Number(cell.dataset.index))));
$("newGame").addEventListener("click", newGame);
$("resetScores").addEventListener("click", () => {
  if (!confirm("Reset all scores and match history?")) return;
  wins.X = wins.O = wins.draw = 0; history = []; newGame(); renderHistory(); save();
});
$("clearHistory").addEventListener("click", () => {
  if (!history.length) return;
  if (confirm("Delete all match history? Scores will be kept.")) { history = []; renderHistory(); save(); }
});
["playerX","playerO"].forEach(id => $(id).addEventListener("input", () => { renderScores(); save(); if (!finished) render(); }));
load();
$("lastRefresh").textContent = stamp();
renderScores(); renderHistory(); render(); updateTimer();
timerInterval = setInterval(updateTimer, 1000);
window.addEventListener("beforeunload", () => clearInterval(timerInterval));
