/* AI disclaimer: I don't know how to create or handle sprites,
 * and did not have enough free time to learn this yet during the semester.
 * I did not write the code on this page.
 */

// Generates the pixel-art keyboard, bike and "currently enjoying" sprites as SVG.
// Usage: node utils/sprites.js [outDir]   (default: res/images/sprites)
// Each sprite pixel is drawn SCALE screen pixels wide at its natural size.
import fs from "fs";
const out = process.argv[2] ?? "res/images/sprites";
fs.mkdirSync(out, { recursive: true });
const SCALE = 3;

class Canvas {
  constructor() {
    this.p = new Map();
  }
  set(x, y, c) {
    this.p.set(`${x},${y}`, { x, y, c });
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  // keycap w px wide, 3 px tall: highlight row, base row, shade row
  cap(x, y, w, t) {
    this.rect(x, y, w, 1, t[0]);
    this.rect(x, y + 1, w, 1, t[1]);
    this.rect(x, y + 2, w, 1, t[2]);
  }
  mirrorInto(target, width) {
    for (const { x, y, c } of this.p.values()) {
      target.set(x, y, c);
      target.set(width - 1 - x, y, c);
    }
  }
  line(x0, y0, x1, y1, c, thick = 1) {
    const dx = Math.abs(x1 - x0),
      dy = Math.abs(y1 - y0),
      sx = x0 < x1 ? 1 : -1,
      sy = y0 < y1 ? 1 : -1;
    let err = dx - dy,
      x = x0,
      y = y0;
    for (;;) {
      this.set(x, y, c);
      if (thick > 1) dx >= dy ? this.set(x, y + 1, c) : this.set(x + 1, y, c);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }
  svg(name, title) {
    const px = [...this.p.values()];
    const W = Math.max(...px.map((p) => p.x)) + 1,
      H = Math.max(...px.map((p) => p.y)) + 1;
    const paths = new Map();
    for (let y = 0; y < H; y++) {
      let x = 0;
      while (x < W) {
        const c = this.p.get(`${x},${y}`)?.c;
        if (!c) {
          x++;
          continue;
        }
        let n = 1;
        while (this.p.get(`${x + n},${y}`)?.c === c) n++;
        paths.set(c, (paths.get(c) ?? "") + `M${x} ${y}h${n}v1h-${n}z`);
        x += n;
      }
    }
    const rects = [...paths]
      .map(([c, d]) => `<path fill="${c}" d="${d}"/>`)
      .join("");
    fs.writeFileSync(
      `${out}/${name}.svg`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * SCALE}" height="${H * SCALE}" shape-rendering="crispEdges"><title>${title}</title>${rects}</svg>\n`,
    );
    console.log(
      name,
      `${W}x${H}`,
      fs.statSync(`${out}/${name}.svg`).size + " bytes",
    );
  }
}

/* ---- Keychron K6 (65%), black case, PBTfans 1984 ---- */
{
  const c = new Canvas();
  const CASE = "#26282e",
    CASE_HI = "#3a3d45",
    CASE_LO = "#15161a",
    PLATE = "#0e0f12";
  const ALPHA = ["#f3ead4", "#e2d7bb", "#b5a987"],
    MOD = ["#d8ccac", "#c4b794", "#978a68"],
    ACC = ["#e08a5c", "#c96a3d", "#964a26"];
  const W = 70,
    H = 27;
  c.rect(1, 0, W - 2, H, CASE);
  c.rect(0, 1, W, H - 2, CASE);
  c.rect(1, 0, W - 2, 1, CASE_HI);
  c.rect(1, H - 1, W - 2, 1, CASE_LO);
  c.rect(0, H - 2, W, 1, CASE_LO);
  c.rect(2, 2, 66, 21, PLATE);
  const row = (y, keys) => {
    let x = 3;
    for (const [w, t] of keys) {
      c.cap(x, y, w - 1, t);
      x += w;
    }
  };
  const n = (k, w, t) => Array.from({ length: k }, () => [w, t]);
  row(3, [[4, ACC], ...n(12, 4, ALPHA), [8, MOD], [4, MOD]]);
  row(7, [[6, MOD], ...n(12, 4, ALPHA), [6, ALPHA], [4, MOD]]);
  row(11, [[7, MOD], ...n(11, 4, ALPHA), [9, MOD], [4, MOD]]);
  row(15, [[9, MOD], ...n(10, 4, ALPHA), [7, MOD], [4, MOD], [4, MOD]]);
  row(19, [
    [5, MOD],
    [5, MOD],
    [5, MOD],
    [25, ALPHA],
    ...n(3, 4, MOD),
    ...n(3, 4, MOD),
  ]);
  c.svg("keychron-k6", "Keychron K6 with PBTfans 1984 keycaps");
}

/* ---- Keychron Q9 Plus, grey case, SA Retro ---- */
{
  const c = new Canvas();
  const CASE = "#8b8e96",
    CASE_HI = "#a4a7ae",
    CASE_LO = "#63666d",
    PLATE = "#4b4d54";
  const ALPHA = ["#f7f3e9", "#e6e1d3", "#b9b3a2"],
    MOD = ["#b9bbc1", "#9b9da3", "#74767c"],
    RED = ["#ab4855", "#8c2f3b", "#651d27"],
    LIME = ["#c6dc62", "#a9c23f", "#7d9226"];
  const W = 58,
    H = 23;
  c.rect(1, 0, W - 2, H, CASE);
  c.rect(0, 1, W, H - 2, CASE);
  c.rect(1, 0, W - 2, 1, CASE_HI);
  c.rect(1, H - 1, W - 2, 1, CASE_LO);
  c.rect(0, H - 2, W, 1, CASE_LO);
  c.rect(2, 2, 54, 17, PLATE);
  const row = (y, keys) => {
    let x = 3;
    for (const [w, t] of keys) {
      c.cap(x, y, w - 1, t);
      x += w;
    }
  };
  const n = (k, w, t) => Array.from({ length: k }, () => [w, t]);
  row(3, [[4, RED], ...n(10, 4, ALPHA), [4, MOD]]);
  row(7, [[5, MOD], ...n(10, 4, ALPHA), [7, RED]]);
  row(11, [[7, MOD], ...n(9, 4, ALPHA), [5, MOD], [4, MOD]]);
  row(15, [
    [5, MOD],
    [5, MOD],
    [5, MOD],
    [9, ALPHA],
    [4, LIME],
    [12, ALPHA],
    ...n(3, 4, MOD),
  ]);
  // knob, top right
  c.rect(51, 3, 3, 3, "#2c2e34");
  c.set(52, 4, "#6b6e76");
  c.set(51, 3, PLATE);
  c.set(53, 3, PLATE);
  c.set(51, 5, PLATE);
  c.set(53, 5, PLATE);
  c.rect(52, 3, 1, 1, "#3d4047");
  c.svg("keychron-q9-plus", "Keychron Q9 Plus with SA Retro keycaps");
}

/* ---- GEIST TOTEM, bare PCB, KLP Lame ---- */
{
  const half = new Canvas(),
    keys = [];
  const PCB = "#34373f",
    PCB_EDGE = "#4a4e59",
    CAP = ["#f1f2f6", "#d9dce3", "#a7abb6"];
  const cols = [
    [5, 7],
    [9, 4],
    [13, 2],
    [17, 4],
    [21, 6],
  ]; // x, y offset per column (pinky -> inner)
  for (const [x, o] of cols)
    for (let r = 0; r < 3; r++) keys.push([x, o + r * 4]);
  keys.push([1, 13]); // extra outer pinky key
  keys.push([17, 20], [21, 21], [25, 23]); // thumb arc
  for (const [x, y] of keys) half.rect(x - 2, y - 2, 7, 7, PCB_EDGE);
  half.rect(19, 0, 9, 8, PCB_EDGE);
  for (const [x, y] of keys) half.rect(x - 1, y - 1, 5, 5, PCB);
  half.rect(20, 1, 7, 6, PCB);
  half.rect(22, 0, 4, 5, "#b9bcc4");
  half.rect(23, 0, 2, 1, "#5a5d66");
  half.set(23, 3, "#e0af68"); // XIAO + usb + led
  for (const [x, y] of keys) half.cap(x, y, 3, CAP);
  const c = new Canvas();
  half.mirrorInto(c, 62);
  c.svg("geist-totem", "GEIST TOTEM, bare PCB with KLP Lame keycaps");
}

/* ---- Corne (crkbd), KAM Superuser ---- */
{
  const half = new Canvas(),
    keys = [];
  const PLATE = "#3d414d",
    EDGE = "#565b69",
    CAP = "#16171c",
    CAP_HI = "#2a2c34";
  const GREEN = "#9ece6a",
    BLUE = "#7aa2f7";
  const cols = [
    [2, 5],
    [6, 5],
    [10, 3],
    [14, 1],
    [18, 3],
    [22, 4],
  ];
  for (const [x, o] of cols)
    for (let r = 0; r < 3; r++) keys.push([x, o + r * 4, 3]);
  const thumbs = [
    [15, 18, 3],
    [19, 19, 3],
    [23, 20, 5],
  ];
  for (const [x, y, w] of [...keys, ...thumbs])
    half.rect(x - 2, y - 2, w + 4, 7, EDGE);
  half.rect(25, 1, 7, 15, EDGE);
  for (const [x, y, w] of [...keys, ...thumbs])
    half.rect(x - 1, y - 1, w + 2, 5, PLATE);
  half.rect(26, 2, 5, 13, PLATE);
  // OLED + controller
  half.rect(27, 3, 3, 7, "#0b0c10");
  half.set(28, 4, BLUE);
  half.set(28, 6, BLUE);
  half.set(27, 8, BLUE);
  half.set(29, 8, BLUE);
  half.rect(27, 11, 3, 3, "#b9bcc4");
  // every cap is the dark variant: dark cap, green legend
  const dark = (cv, x, y, w = 3) => {
    cv.rect(x, y, w, 3, CAP);
    cv.rect(x, y, w, 1, CAP_HI);
    cv.set(x + (w >> 1), y + 1, GREEN);
  };
  const light = (cv, x, y, w = 3) => {
    cv.rect(x, y, w, 3, GREEN);
    cv.rect(x, y, w, 1, "#b9e08a");
    cv.rect(x, y + 2, w, 1, "#6f9a41");
  };
  for (const [x, y, w] of [...keys, ...thumbs]) dark(half, x, y, w);
  const W = 68,
    c = new Canvas();
  half.mirrorInto(c, W);
  // exceptions: the two innermost thumb keys on the left half...
  light(c, 19, 19);
  light(c, 23, 20, 5);
  // ...and h j k l (home row, four inner columns) on the right half
  for (const [x, o] of cols.slice(2)) light(c, W - x - 3, o + 4);
  c.svg("corne", "Corne split keyboard with KAM Superuser keycaps");
}

/* ==== Bikes ==== */
const RUBBER = "#454853",
  TAN = "#c9a36b",
  CARBON = "#2b2d36",
  SILVER = "#b9bcc4",
  STEEL = "#7d818c",
  SPOKE = "#30333d",
  CHAIN = "#5d616d";

// rings: colours from the outside in (index 0 = tread). Everything inside is spokes.
function wheel(c, cx, cy, rings, disc) {
  const R = 10;
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      const i = Math.round(R - Math.hypot(x, y));
      if (i >= 0 && i < rings.length) c.set(cx + x, cy + y, rings[i]);
    }
  const inner = R - rings.length;
  for (const [ax, ay] of [
    [1, 0],
    [0, 1],
    [0.7, 0.7],
    [0.7, -0.7],
  ]) {
    c.line(
      cx,
      cy,
      Math.round(cx + ax * inner),
      Math.round(cy + ay * inner),
      SPOKE,
    );
    c.line(
      cx,
      cy,
      Math.round(cx - ax * inner),
      Math.round(cy - ay * inner),
      SPOKE,
    );
  }
  if (disc)
    for (const [x, y] of [
      [-2, -1],
      [-2, 0],
      [-2, 1],
      [2, -1],
      [2, 0],
      [2, 1],
      [-1, -2],
      [0, -2],
      [1, -2],
      [-1, 2],
      [0, 2],
      [1, 2],
    ])
      c.set(cx + x, cy + y, STEEL);
  c.set(cx, cy, SILVER);
}

function bike(name, title, o) {
  const c = new Canvas();
  const wy = 22,
    rx = 11,
    fx = o.fx ?? 41;
  const bb = [23, 24];
  const st = [18, o.slope ? 10 : 8]; // top of seat tube
  const htTop = [fx - 5, o.tall ? 6 : 7],
    htBot = [fx - 4, 11];
  const saddleY = o.tall ? 2 : 3;

  wheel(c, rx, wy, o.rings, o.disc);
  wheel(c, fx, wy, o.rings, o.disc);

  // drivetrain behind the frame
  c.line(bb[0], bb[1] + 2, rx + 1, wy + 2, CHAIN);
  c.set(rx, wy + 3, o.parts);
  c.set(rx + 1, wy + 4, o.parts);

  // rear triangle
  c.line(st[0] + 1, st[1] + 1, rx, wy, o.stays ?? o.frame);
  if (o.dropped) {
    c.line(bb[0], bb[1], 17, 25, o.stays ?? o.frame);
    c.line(17, 25, rx, wy, o.stays ?? o.frame);
  } else c.line(bb[0], bb[1], rx, wy, o.stays ?? o.frame);
  // fork
  c.line(htBot[0], htBot[1], fx, wy, o.fork ?? o.frame);
  // seatpost + saddle
  c.line(st[0], st[1], 17, saddleY + 1, o.post);
  c.line(13, saddleY, 19, saddleY, o.saddle);
  c.set(13, saddleY - 1, o.saddle);
  // main triangle
  const t = o.thin ? 1 : 2; // main tube thickness
  c.line(bb[0], bb[1], st[0], st[1], o.frame, t);
  c.line(st[0] + 1, st[1], htTop[0], htTop[1] + 1, o.frame, o.fat ? 2 : 1);
  c.line(htBot[0], htBot[1] - 1, bb[0] + 1, bb[1] - 1, o.accent ?? o.frame, t);
  c.line(htTop[0], htTop[1], htBot[0], htBot[1], o.frame, t);
  // stem + drop bars
  const sy = htTop[1] - 1,
    sx = htTop[0],
    ex = sx + (o.stem ?? 3);
  c.line(sx, sy, ex, sy, o.cockpit);
  c.set(ex + 1, sy, o.tape);
  c.set(ex + 2, sy - 1, o.tape);
  c.set(ex + 2, sy, o.tape);
  c.set(ex + 3, sy + 1, o.tape);
  c.set(ex + 3, sy + 2, o.tape);
  c.set(ex + 2, sy + 3, o.tape);
  c.set(ex + 1, sy + 3, o.tape);
  // crank + chainring
  for (const [x, y] of [
    [-1, -2],
    [0, -2],
    [1, -2],
    [-2, -1],
    [2, -1],
    [-2, 0],
    [2, 0],
    [-2, 1],
    [2, 1],
    [-1, 2],
    [0, 2],
    [1, 2],
  ])
    c.set(bb[0] + x, bb[1] + y, o.parts);
  c.line(bb[0], bb[1], bb[0] + 3, bb[1] + 4, o.crank ?? o.parts);
  c.line(bb[0] + 2, bb[1] + 5, bb[0] + 4, bb[1] + 5, o.parts);
  c.set(bb[0], bb[1], SILVER);
  c.svg(name, title);
}

bike(
  "cervelo-r3",
  "2018 Cervelo R3, fluo yellow, carbon wheels and tanwall tires",
  {
    frame: "#f1ee35",
    thin: true,
    rings: [RUBBER, TAN, CARBON, CARBON, CARBON],
    post: CARBON,
    saddle: RUBBER,
    cockpit: RUBBER,
    tape: RUBBER,
    parts: STEEL,
    slope: true,
  },
);
bike(
  "cannondale-caad6",
  "Cannondale CAAD6 R1000, black and silver, HED Jet 6 wheels and tanwall tires",
  {
    frame: "#3a3d47",
    accent: SILVER,
    fork: SILVER,
    stays: "#3a3d47",
    fat: true,
    rings: [RUBBER, TAN, SILVER, CARBON, CARBON, CARBON],
    post: SILVER,
    saddle: RUBBER,
    cockpit: SILVER,
    tape: "#e8e8ec",
    parts: SILVER,
  },
);
bike("salsa-journeyer", "Salsa Journeyer, hi-vis yellow gravel bike", {
  frame: "#c8f31d",
  fx: 42,
  tall: true,
  slope: true,
  fat: true,
  disc: true,
  rings: [RUBBER, RUBBER, STEEL],
  post: RUBBER,
  saddle: RUBBER,
  cockpit: RUBBER,
  tape: RUBBER,
  parts: RUBBER,
});
bike(
  "open-wide",
  "OPEN WI.DE, ready-to-paint, shallow carbon wheels and tanwall tires",
  {
    frame: "#6a6f7c",
    thin: true,
    slope: true,
    disc: true,
    dropped: true,
    stem: 4,
    rings: [RUBBER, TAN, CARBON, CARBON],
    post: CARBON,
    saddle: RUBBER,
    cockpit: CARBON,
    tape: RUBBER,
    parts: RUBBER,
  },
);

/* ==== Currently enjoying ==== */

/* ---- Narval Patio Libre, pink 340 g tin with green print ---- */
{
  const c = new Canvas();
  const PINK = "#f2d0da",
    PINK_MID = "#e6c0cc",
    PINK_LO = "#d3aaba";
  const GREEN = "#1fae4e",
    GREEN_SOFT = "#7fcf9a",
    MINT = "#a8dcc4";
  const TIN_HI = "#e4e6ea",
    TIN = "#b9bcc4",
    TIN_LO = "#8f939c";
  const W = 20;
  // lid
  c.rect(3, 0, W - 6, 1, TIN_HI);
  c.rect(1, 1, W - 2, 1, TIN);
  c.rect(0, 2, W, 1, TIN_LO);
  // body, shaded towards the right
  c.rect(0, 3, 14, 25, PINK);
  c.rect(14, 3, 4, 25, PINK_MID);
  c.rect(18, 3, 2, 25, PINK_LO);
  // bottom rim
  c.rect(0, 28, W, 1, TIN);
  c.rect(2, 29, W - 4, 1, TIN_LO);
  // NARVAL / cafe lab + wave
  c.rect(3, 5, 8, 2, GREEN);
  c.rect(3, 8, 5, 1, GREEN_SOFT);
  c.set(9, 8, GREEN);
  c.set(10, 9, GREEN);
  c.set(11, 8, GREEN);
  c.set(12, 9, GREEN);
  c.set(13, 8, GREEN);
  // two overlapping hatched discs: mint (upper left), green (lower right), solid where they overlap
  const inDisc = (x, y, cx, cy, r) => Math.hypot(x - cx, y - cy) <= r;
  for (let y = 9; y <= 21; y++)
    for (let x = 1; x <= 18; x++) {
      const mint = inDisc(x, y, 7, 14, 4.2),
        green = inDisc(x, y, 11.5, 15.5, 5.2);
      const hatch = (x + y) % 2 === 0;
      if (mint && green) c.set(x, y, GREEN);
      else if (green && hatch) c.set(x, y, GREEN);
      else if (mint && hatch) c.set(x, y, MINT);
    }
  // divider, name, small print
  c.rect(1, 22, 18, 1, GREEN_SOFT);
  c.rect(2, 24, 4, 2, GREEN);
  c.rect(7, 24, 4, 2, GREEN);
  c.rect(14, 24, 4, 1, GREEN_SOFT);
  c.rect(15, 26, 3, 1, GREEN_SOFT);
  c.svg("patio-libre", "Narval Patio Libre coffee tin, pink with green print");
}

/* ---- Pour-over setup: Hario V60 glass dripper brewing into a glass server, Kinto amber mug in front ---- */
{
  const c = new Canvas();
  const at = (ox, oy) => ({
    set: (x, y, col) => c.set(x + ox, y + oy, col),
    rect: (x, y, w, h, col) => c.rect(x + ox, y + oy, w, h, col),
  });
  const GLASS = "#8fb0c8",
    GLASS_HI = "#e4f1fa",
    PANE = "#d3dbe2",
    RIB = "#aebccb",
    HOLLOW = "#2a3147";
  const PAPER = "#f3efe4",
    PAPER_LO = "#cfc9b8";
  const BASE = "#e6e8ee",
    BASE_LO = "#aab0bd";
  const COFFEE = "#4a2a12",
    CREMA = "#6b3f1c",
    STEAM = "#9aa3c4";
  const AMBER = "#c8792a",
    AMBER_HI = "#eaa650",
    AMBER_LO = "#8f4f17";
  const cx = 12;

  // steam rising off the brew
  for (const [x, h] of [
    [6, 2],
    [11, 4],
    [16, 3],
  ])
    for (let i = 0; i < h; i++) c.set(x + (i % 2), 3 - i, STEAM);

  // glass server: rim, body widening towards the base, handle on the left
  c.rect(cx - 7, 23, 14, 1, GLASS_HI);
  for (let y = 24; y <= 38; y++) {
    const hw = Math.min(10, Math.floor(7 + (y - 23) * 0.5));
    for (let x = cx - hw; x < cx + hw; x++) {
      const edge = x === cx - hw || x === cx + hw - 1;
      c.set(x, y, edge ? GLASS : y >= 32 ? COFFEE : HOLLOW);
    }
  }
  c.rect(cx - 9, 32, 18, 1, CREMA); // surface of the brewed coffee
  c.rect(cx, 24, 1, 8, CREMA); // the stream dripping in
  c.rect(cx - 10, 39, 20, 1, GLASS);
  c.rect(cx - 6, 26, 1, 4, GLASS_HI);
  c.rect(1, 25, 4, 1, GLASS);
  c.rect(0, 26, 1, 4, GLASS);
  c.set(1, 30, GLASS);

  // V60 dripper sitting on the server
  {
    const d = at(0, 5);
    d.rect(3, 0, 18, 1, PAPER);
    d.rect(2, 1, 20, 1, PAPER);
    d.rect(4, 1, 16, 1, PAPER_LO);
    for (let y = 2; y <= 13; y++) {
      const hw = Math.round(11 - (y - 2) * 0.62);
      for (let x = cx - hw; x < cx + hw; x++) {
        const edge = x === cx - hw || x === cx + hw - 1;
        const rib = (x + y) % 4 === 0; // the spiral ribs
        d.set(x, y, edge ? GLASS : y === 2 ? GLASS_HI : rib ? RIB : PANE);
      }
    }
    d.set(cx - 9, 4, GLASS_HI);
    d.set(cx - 8, 5, GLASS_HI);
    d.set(cx - 8, 6, GLASS_HI);
    // collar, base flange, handle
    d.rect(7, 14, 10, 2, BASE);
    d.rect(7, 15, 10, 1, BASE_LO);
    d.rect(2, 16, 20, 1, BASE);
    d.rect(3, 17, 18, 1, BASE_LO);
    d.rect(21, 5, 4, 1, BASE);
    d.rect(24, 6, 2, 7, BASE);
    d.rect(25, 7, 1, 5, BASE_LO);
    d.rect(19, 13, 6, 1, BASE);
    d.rect(17, 14, 3, 1, BASE);
  }

  // Kinto amber glass mug, in front of the server
  {
    const m = at(16, 26);
    m.rect(0, 0, 14, 1, AMBER_HI);
    m.rect(0, 1, 14, 12, AMBER);
    m.rect(1, 13, 12, 1, AMBER_LO);
    m.rect(1, 2, 12, 10, COFFEE);
    m.rect(1, 2, 12, 1, CREMA);
    m.rect(2, 3, 1, 7, AMBER_HI);
    m.rect(4, 3, 1, 3, AMBER);
    m.rect(12, 2, 1, 10, AMBER_LO);
    m.rect(0, 12, 14, 1, AMBER_LO);
    m.rect(0, 1, 1, 11, AMBER_HI);
    m.rect(14, 3, 4, 1, AMBER);
    m.rect(17, 4, 2, 5, AMBER);
    m.rect(14, 9, 4, 1, AMBER_LO);
    m.set(18, 4, AMBER_LO);
    m.set(18, 8, AMBER_LO);
  }
  c.svg(
    "pourover-setup",
    "Hario V60 glass dripper brewing into a glass server, with a Kinto amber mug in front",
  );
}

/* ---- Malum Caedo (Warhammer 40,000: Boltgun), chainsword and boltgun ---- */
{
  const half = new Canvas();
  const BLUE = "#2f4fb0",
    BLUE_HI = "#5578dc",
    BLUE_LO = "#1f3480";
  const GOLD = "#d9a93a",
    GOLD_LO = "#a37a1f";
  const WHITE = "#e6e8ee",
    WHITE_LO = "#aab0bd",
    LENS = "#e0383a";
  const JOINT = "#3a3d47",
    STEEL = "#7d818c",
    TEETH = "#d5d8de";
  const CLOTH = "#d9cdb0",
    CLOTH_LO = "#a89c80";
  // left half only (x 0..10); mirrored around the centre line of a 22 px wide body
  // backpack + exhaust
  half.rect(5, 2, 3, 5, BLUE_LO);
  half.rect(5, 0, 2, 2, STEEL);
  half.set(5, 0, JOINT);
  // legs: thigh, kneepad, greave, boot
  half.rect(5, 17, 5, 5, BLUE);
  half.rect(5, 22, 4, 1, BLUE_HI);
  half.rect(5, 23, 4, 6, BLUE);
  half.rect(5, 23, 1, 6, BLUE_LO);
  half.rect(4, 29, 5, 2, BLUE_LO);
  half.rect(4, 29, 5, 1, BLUE);
  // arm: upper arm, elbow joint, gauntlet
  half.rect(2, 12, 4, 3, BLUE);
  half.rect(2, 15, 4, 1, JOINT);
  half.rect(2, 16, 4, 4, BLUE_LO);
  // torso + belt
  half.rect(7, 9, 4, 7, BLUE);
  half.rect(8, 8, 3, 1, BLUE_LO);
  half.rect(7, 14, 4, 2, BLUE_LO);
  half.rect(7, 16, 4, 1, GOLD_LO);
  half.set(10, 16, WHITE);
  // aquila across the chest
  half.rect(7, 10, 4, 1, GOLD);
  half.rect(9, 11, 2, 1, GOLD);
  half.set(10, 12, GOLD_LO);
  // tabard
  half.rect(8, 17, 3, 8, CLOTH);
  half.rect(8, 17, 1, 8, CLOTH_LO);
  half.rect(9, 25, 2, 1, CLOTH);
  half.set(10, 26, CLOTH_LO);
  // pauldron with gold trim and the Ultramarines mark
  half.rect(3, 6, 4, 1, BLUE_HI);
  half.rect(2, 7, 6, 1, BLUE_HI);
  half.rect(1, 8, 7, 4, BLUE);
  half.rect(2, 12, 6, 1, GOLD);
  half.rect(1, 8, 1, 4, GOLD_LO);
  half.set(3, 8, WHITE);
  half.set(5, 8, WHITE);
  half.set(3, 9, WHITE);
  half.set(5, 9, WHITE);
  half.set(4, 10, WHITE);
  // helmet: white (veteran), red lenses, grille
  half.rect(9, 2, 2, 1, WHITE);
  half.rect(8, 3, 3, 5, WHITE);
  half.rect(9, 8, 2, 1, WHITE_LO);
  half.set(8, 3, WHITE_LO);
  half.set(9, 5, LENS);
  half.set(10, 6, WHITE_LO);
  half.set(10, 7, WHITE_LO);

  const body = new Canvas();
  half.mirrorInto(body, 22);
  const c = new Canvas(),
    OX = 5;
  for (const { x, y, c: col } of body.p.values()) c.set(x + OX, y, col);
  // chainsword, raised in the right hand (viewer's left)
  c.rect(1, 2, 3, 13, STEEL);
  c.rect(2, 1, 1, 1, STEEL);
  c.rect(2, 3, 1, 11, JOINT);
  for (let y = 2; y <= 14; y += 2) {
    c.set(0, y, TEETH);
    c.set(4, y + 1, TEETH);
  }
  c.rect(0, 15, 5, 1, GOLD);
  c.rect(1, 16, 4, 3, BLUE_LO);
  c.rect(5, 16, 2, 3, BLUE);
  // boltgun, levelled in the left hand (viewer's right)
  c.rect(24, 16, 8, 4, JOINT);
  c.rect(24, 16, 8, 1, STEEL);
  c.rect(32, 17, 2, 2, STEEL);
  c.rect(26, 20, 2, 3, "#2b2d36");
  c.set(29, 18, GOLD);
  c.set(30, 18, GOLD);
  c.rect(22, 17, 3, 3, BLUE_LO);
  c.svg(
    "malum-caedo",
    "Malum Caedo, Ultramarines Sternguard veteran from Warhammer 40,000: Boltgun",
  );
}

/* ==== School logos, clickable, shown beside the school names on the education page ==== */
const fromRows = (rows, colour) => { const c = new Canvas(); rows.forEach((r, y) => [...r].forEach((ch, x) => ch !== "." && c.set(x, y, colour))); return c; };

/* ---- Collège de Bois-de-Boulogne: the yellow outlined B with its inner bracket ---- */
fromRows([
  "YYYYYYYYYYY.....",
  "YYYYYYYYYYYYY...",
  "YY.........YYY..",
  "YY..........YY..",
  "YY...YYYYY..YY..",
  "YY...YYYYY..YY..",
  "YY...YY....YYY..",
  "YY...YY...YYY...",
  "YY...YY....YYY..",
  "YY...YY.....YYY.",
  "YY...YYYYY...YY.",
  "YY...YYYYY...YY.",
  "YY..........YYY.",
  "YY.........YYY..",
  "YYYYYYYYYYYYY...",
  "YYYYYYYYYYY.....",
], "#ffc82e").svg("bdeb-logo", "Collège de Bois-de-Boulogne logo");

/* ---- Collège Jean-de-Brébeuf: the burgundy B that ends in a shield point ---- */
fromRows([
  "RRRRRRRRR.....",
  "RRRRRRRRRRR...",
  "RRR.....RRRR..",
  "RRR......RRR..",
  "RRR......RRR..",
  "RRR.....RRR...",
  "RRRRRRRRRR....",
  "RRRRRRRRRRRR..",
  "RRR......RRRR.",
  "RRR.......RRR.",
  "RRR.......RRR.",
  "RRR.......RRR.",
  "RRRR.....RRRR.",
  ".RRRR...RRRR..",
  "..RRRRRRRRR...",
  "...RRRRRRR....",
  "....RRRRR.....",
  ".....RRR......",
], "#a3364a").svg("brebeuf-logo", "Collège Jean-de-Brébeuf logo");
