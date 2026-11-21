// ✏️ EDIT: things that rotate in the "I'm a ..." line
const roles = ["maker 🛠️", "doodler ✏️", "learner 📚", "problem solver 🧩", "coffee drinker ☕"];
// ✏️ EDIT: random facts about you
const facts = [
  "I started this website as a little test — and got a bit carried away.",
  "My favourite colour changes depending on the day. Today it's pastel pink.",
  "I've definitely googled “how to center a div” more than once.",
  "I think every good idea starts as a doodle on a napkin.",
  "I'd rather build something small that works than plan something huge forever.",
  "I'm a professional procrastinator… but I'm working on it. Tomorrow.",
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pastels = ["#ffb8d1", "#fff1a8", "#c1f0d9", "#b8e2ff", "#e2c8ff", "#ffd3b6", "#c8f7a6"];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// toast
const toast = document.createElement("div");
toast.className = "toast";
document.body.appendChild(toast);
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// typewriter
(function typer() {
  const el = $("#typer");
  let r = 0, i = 0, del = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    if (!del && i < word.length) i++;
    else if (del && i > 0) i--;
    else if (!del) { del = true; return setTimeout(tick, 1400); }
    else { del = false; r = (r + 1) % roles.length; }
    setTimeout(tick, del ? 45 : 90);
  })();
})();

// confetti
function confetti(n = 60) {
  const bits = ["✦", "●", "▲", "♥", "✿", "★", "■"];
  for (let k = 0; k < n; k++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = rand(bits);
    c.style.left = Math.random() * 100 + "vw";
    c.style.color = rand(["#ff6fa5", "#ffc93c", "#7ed6a7", "#6fb8ff", "#b48cff", "#ff9f6b"]);
    c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}
$("#confetti-btn").addEventListener("click", () => { confetti(); say("yay! you pressed it 🎉"); });

// avatar poke
const pokes = ["hey! 😄", "that tickles!", "ok ok, hi!!", "boop 👉", "stop it 🙈", "fine, have some confetti"];
let pokeCount = 0;
$("#avatar").addEventListener("click", (e) => {
  const a = e.currentTarget;
  a.classList.remove("boop"); void a.getBBox(); a.classList.add("boop");
  const mouth = $("#mouth");
  mouth.setAttribute("d", "M96 132 Q110 156 124 132 Z");
  mouth.setAttribute("fill", "#ff6fa5");
  setTimeout(() => { mouth.setAttribute("d", "M96 134 Q110 148 124 134"); mouth.setAttribute("fill", "none"); }, 600);
  say(pokes[pokeCount % pokes.length]);
  if (pokeCount % pokes.length === pokes.length - 1) confetti(40);
  pokeCount++;
});

// sticky notes flip
$$(".note").forEach((n) => {
  const flip = () => n.classList.toggle("flipped");
  n.addEventListener("click", flip);
  n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
});

// random facts
let lastFact = -1;
$("#fact-btn").addEventListener("click", () => {
  let i;
  do { i = Math.floor(Math.random() * facts.length); } while (i === lastFact && facts.length > 1);
  lastFact = i;
  const t = $("#fact-text");
  t.style.opacity = 0;
  setTimeout(() => { t.textContent = facts[i]; t.style.opacity = 1; }, 180);
});

// cards expand
$$(".card").forEach((c) => c.addEventListener("click", () => c.classList.toggle("open")));

// skill chips
$$(".skills li").forEach((li) => {
  li.addEventListener("mouseenter", () => {
    li.style.background = rand(pastels);
    li.style.transform = `rotate(${Math.random() * 16 - 8}deg) scale(1.1)`;
  });
  li.addEventListener("mouseleave", () => { li.style.transform = ""; });
});

// checklist
const boxes = $$(".checklist input");
boxes.forEach((b) => b.addEventListener("change", () => {
  const done = boxes.filter((x) => x.checked).length;
  const msg = $("#check-msg");
  if (done === boxes.length) { msg.textContent = "all of the above! 🎉"; confetti(50); }
  else msg.textContent = `${done}/${boxes.length} ticked ✔`;
}));

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
$$(".section-title, .notes, .fact-box, .cards, .skills, .why-wrap, .contacts, .guestbook").forEach((el) => {
  el.classList.add("reveal"); io.observe(el);
});

// guestbook (localStorage, per-browser)
const GB_KEY = "kaushal-guestbook";
const load = () => { try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; } catch { return []; } };
const save = (v) => { try { localStorage.setItem(GB_KEY, JSON.stringify(v)); } catch {} };
function renderWall() {
  const wall = $("#gb-wall");
  wall.innerHTML = "";
  load().forEach((n, idx) => {
    const d = document.createElement("div");
    d.className = "gb-note";
    d.style.background = n.color;
    d.style.transform = `rotate(${n.rot}deg)`;
    d.textContent = n.text;
    const x = document.createElement("button");
    x.textContent = "×"; x.title = "remove";
    x.onclick = () => { const all = load(); all.splice(idx, 1); save(all); renderWall(); };
    d.appendChild(x);
    wall.appendChild(d);
  });
}
$("#gb-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const inp = $("#gb-input");
  const text = inp.value.trim();
  if (!text) return say("write something first ✍️");
  const all = load();
  all.push({ text, color: rand(pastels), rot: Math.round(Math.random() * 10 - 5) });
  save(all); renderWall(); inp.value = "";
  say("stuck it on the wall! 📌");
});
renderWall();

// doodle mode
const canvas = $("#doodle-layer");
const ctx = canvas.getContext("2d");
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const img = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (img) ctx.putImageData(img, 0, 0);
}
resize(); addEventListener("resize", resize);
let drawing = false, penColor = "#ff6fa5";
const penBtn = $("#pen-toggle");
penBtn.addEventListener("click", () => {
  const on = document.body.classList.toggle("doodling");
  penBtn.setAttribute("aria-pressed", on);
  penBtn.textContent = on ? "✋ stop" : "✏️ doodle";
  if (on) say("draw anywhere! double-click to clear");
});
canvas.addEventListener("pointerdown", (e) => {
  drawing = true; penColor = rand(["#ff6fa5", "#ffb000", "#3fbf7f", "#4a9eff", "#9a6bff"]);
  ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY);
});
canvas.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  ctx.strokeStyle = penColor; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.lineTo(e.clientX, e.clientY); ctx.stroke();
});
addEventListener("pointerup", () => (drawing = false));
canvas.addEventListener("dblclick", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// secret: type "hello"
let buffer = "";
addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  buffer = (buffer + e.key.toLowerCase()).slice(-5);
  if (buffer === "hello") { say("hello to you too! 👋💖"); confetti(80); }
});

$("#year").textContent = new Date().getFullYear();
