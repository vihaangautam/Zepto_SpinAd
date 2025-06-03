const sectors = [
  { color: "#FFBC03", text: "#333333", label: "₹50 Cashback!" },
  { color: "#FF5A10", text: "#333333", label: "Free Delivery on Next Order!" },
  { color: "#FFBC03", text: "#333333", label: "10% OFF on All Ice-Creams!" },
  { color: "#FF5A10", text: "#333333", label: "₹100 Free Cash!" },
  { color: "#FFBC03", text: "#333333", label: "₹25 Cashback" },
  { color: "#FF5A10", text: "#333333", label: "You Lost" },
  { color: "#FFBC03", text: "#333333", label: "₹150 Free Cash!" },
  { color: "#FF5A10", text: "#333333", label: "₹10% OFF on All Grocery Items!" },
];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (min, max) => Math.random() * (max - min) + min;

const canvas = document.querySelector("#wheel");
const ctx = canvas.getContext("2d");
const spinEl = document.querySelector("#spin");

const dia = canvas.width;
const rad = dia / 2;
const TAU = 2 * Math.PI;
const arc = TAU / sectors.length;

const friction = 0.991;
let angVel = 0;
let ang = 0;
let spinButtonClicked = false;

const getIndex = () => Math.floor(sectors.length - (ang / TAU) * sectors.length) % sectors.length;

function drawSector(sector, i) {
  const angle = arc * i;
  ctx.save();

  // Sector background
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, angle, angle + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Sector text
  ctx.translate(rad, rad);
  ctx.rotate(angle + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 14px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 5);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  canvas.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
  spinEl.textContent = angVel ? sector.label : "SPIN";
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate();
  engine();

  spinEl.addEventListener("click", () => {
    if (!angVel) {
      angVel = rand(0.25, 0.45);
      spinButtonClicked = true;
    }
  });
}

init();

events.addListener("spinEnd", (sector) => {
  console.log(`🎉 You won: ${sector.label}`);
  
});
