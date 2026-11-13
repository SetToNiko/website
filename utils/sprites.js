// Generates the pixel-art keyboard sprites as SVG.
// Usage: node utils/sprites.js [outDir]   (default: res/images/sprites)
// Each sprite pixel is drawn SCALE screen pixels wide at its natural size.
import fs from "fs";
const out = process.argv[2] ?? "res/images/sprites";
fs.mkdirSync(out, { recursive: true });
const SCALE = 3;

class Canvas {
  constructor() { this.p = new Map(); }
  set(x, y, c) { this.p.set(`${x},${y}`, { x, y, c }); }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
  // keycap w px wide, 3 px tall: highlight row, base row, shade row
  cap(x, y, w, t) { this.rect(x, y, w, 1, t[0]); this.rect(x, y + 1, w, 1, t[1]); this.rect(x, y + 2, w, 1, t[2]); }
  mirrorInto(target, width) { for (const { x, y, c } of this.p.values()) { target.set(x, y, c); target.set(width - 1 - x, y, c); } }
  svg(name, title) {
    const px = [...this.p.values()];
    const W = Math.max(...px.map(p => p.x)) + 1, H = Math.max(...px.map(p => p.y)) + 1;
    const paths = new Map();
    for (let y = 0; y < H; y++) {
      let x = 0;
      while (x < W) {
        const c = this.p.get(`${x},${y}`)?.c;
        if (!c) { x++; continue; }
        let n = 1;
        while (this.p.get(`${x + n},${y}`)?.c === c) n++;
        paths.set(c, (paths.get(c) ?? "") + `M${x} ${y}h${n}v1h-${n}z`);
        x += n;
      }
    }
    const rects = [...paths].map(([c, d]) => `<path fill="${c}" d="${d}"/>`).join("");
    fs.writeFileSync(`${out}/${name}.svg`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * SCALE}" height="${H * SCALE}" shape-rendering="crispEdges"><title>${title}</title>${rects}</svg>\n`);
    console.log(name, `${W}x${H}`, fs.statSync(`${out}/${name}.svg`).size + " bytes");
  }
}

/* ---- Keychron K6 (65%), black case, PBTfans 1984 ---- */
{
  const c = new Canvas();
  const CASE = "#26282e", CASE_HI = "#3a3d45", CASE_LO = "#15161a", PLATE = "#0e0f12";
  const ALPHA = ["#f3ead4", "#e2d7bb", "#b5a987"], MOD = ["#d8ccac", "#c4b794", "#978a68"],
        ACC = ["#e08a5c", "#c96a3d", "#964a26"];
  const W = 70, H = 27;
  c.rect(1, 0, W - 2, H, CASE); c.rect(0, 1, W, H - 2, CASE);
  c.rect(1, 0, W - 2, 1, CASE_HI); c.rect(1, H - 1, W - 2, 1, CASE_LO); c.rect(0, H - 2, W, 1, CASE_LO);
  c.rect(2, 2, 66, 21, PLATE);
  const row = (y, keys) => { let x = 3; for (const [w, t] of keys) { c.cap(x, y, w - 1, t); x += w; } };
  const n = (k, w, t) => Array.from({ length: k }, () => [w, t]);
  row(3,  [[4, ACC], ...n(12, 4, ALPHA), [8, MOD], [4, MOD]]);
  row(7,  [[6, MOD], ...n(12, 4, ALPHA), [6, ALPHA], [4, MOD]]);
  row(11, [[7, MOD], ...n(11, 4, ALPHA), [9, MOD], [4, MOD]]);
  row(15, [[9, MOD], ...n(10, 4, ALPHA), [7, MOD], [4, MOD], [4, MOD]]);
  row(19, [[5, MOD], [5, MOD], [5, MOD], [25, ALPHA], ...n(3, 4, MOD), ...n(3, 4, MOD)]);
  c.svg("keychron-k6", "Keychron K6 with PBTfans 1984 keycaps");
}

/* ---- Keychron Q9 Plus, grey case, SA Retro ---- */
{
  const c = new Canvas();
  const CASE = "#8b8e96", CASE_HI = "#a4a7ae", CASE_LO = "#63666d", PLATE = "#4b4d54";
  const ALPHA = ["#f7f3e9", "#e6e1d3", "#b9b3a2"], MOD = ["#b9bbc1", "#9b9da3", "#74767c"],
        RED = ["#ab4855", "#8c2f3b", "#651d27"], LIME = ["#c6dc62", "#a9c23f", "#7d9226"];
  const W = 58, H = 23;
  c.rect(1, 0, W - 2, H, CASE); c.rect(0, 1, W, H - 2, CASE);
  c.rect(1, 0, W - 2, 1, CASE_HI); c.rect(1, H - 1, W - 2, 1, CASE_LO); c.rect(0, H - 2, W, 1, CASE_LO);
  c.rect(2, 2, 54, 17, PLATE);
  const row = (y, keys) => { let x = 3; for (const [w, t] of keys) { c.cap(x, y, w - 1, t); x += w; } };
  const n = (k, w, t) => Array.from({ length: k }, () => [w, t]);
  row(3,  [[4, RED], ...n(10, 4, ALPHA), [4, MOD]]);
  row(7,  [[5, MOD], ...n(10, 4, ALPHA), [7, RED]]);
  row(11, [[7, MOD], ...n(9, 4, ALPHA), [5, MOD], [4, MOD]]);
  row(15, [[5, MOD], [5, MOD], [5, MOD], [9, ALPHA], [4, LIME], [12, ALPHA], ...n(3, 4, MOD)]);
  // knob, top right
  c.rect(51, 3, 3, 3, "#2c2e34"); c.set(52, 4, "#6b6e76"); c.set(51, 3, PLATE); c.set(53, 3, PLATE); c.set(51, 5, PLATE); c.set(53, 5, PLATE);
  c.rect(52, 3, 1, 1, "#3d4047");
  c.svg("keychron-q9-plus", "Keychron Q9 Plus with SA Retro keycaps");
}

/* ---- GEIST TOTEM, bare PCB, KLP Lame ---- */
{
  const half = new Canvas(), keys = [];
  const PCB = "#34373f", PCB_EDGE = "#4a4e59", CAP = ["#f1f2f6", "#d9dce3", "#a7abb6"];
  const cols = [[5, 7], [9, 4], [13, 2], [17, 4], [21, 6]]; // x, y offset per column (pinky -> inner)
  for (const [x, o] of cols) for (let r = 0; r < 3; r++) keys.push([x, o + r * 4]);
  keys.push([1, 13]);                               // extra outer pinky key
  keys.push([17, 20], [21, 21], [25, 23]);          // thumb arc
  for (const [x, y] of keys) half.rect(x - 2, y - 2, 7, 7, PCB_EDGE);
  half.rect(19, 0, 9, 8, PCB_EDGE);
  for (const [x, y] of keys) half.rect(x - 1, y - 1, 5, 5, PCB);
  half.rect(20, 1, 7, 6, PCB);
  half.rect(22, 0, 4, 5, "#b9bcc4"); half.rect(23, 0, 2, 1, "#5a5d66"); half.set(23, 3, "#e0af68"); // XIAO + usb + led
  for (const [x, y] of keys) half.cap(x, y, 3, CAP);
  const c = new Canvas(); half.mirrorInto(c, 62);
  c.svg("geist-totem", "GEIST TOTEM, bare PCB with KLP Lame keycaps");
}

/* ---- Corne (crkbd), KAM Superuser ---- */
{
  const half = new Canvas(), keys = [];
  const PLATE = "#3d414d", EDGE = "#565b69", CAP = "#16171c", CAP_HI = "#2a2c34";
  const GREEN = "#9ece6a", BLUE = "#7aa2f7";
  const cols = [[2, 5], [6, 5], [10, 3], [14, 1], [18, 3], [22, 4]];
  for (const [x, o] of cols) for (let r = 0; r < 3; r++) keys.push([x, o + r * 4, 3]);
  const thumbs = [[15, 18, 3], [19, 19, 3], [23, 20, 5]];
  for (const [x, y, w] of [...keys, ...thumbs]) half.rect(x - 2, y - 2, w + 4, 7, EDGE);
  half.rect(25, 1, 7, 15, EDGE);
  for (const [x, y, w] of [...keys, ...thumbs]) half.rect(x - 1, y - 1, w + 2, 5, PLATE);
  half.rect(26, 2, 5, 13, PLATE);
  // OLED + controller
  half.rect(27, 3, 3, 7, "#0b0c10"); half.set(28, 4, BLUE); half.set(28, 6, BLUE); half.set(27, 8, BLUE); half.set(29, 8, BLUE);
  half.rect(27, 11, 3, 3, "#b9bcc4");
  // every cap is the dark variant: dark cap, green legend
  const dark = (cv, x, y, w = 3) => { cv.rect(x, y, w, 3, CAP); cv.rect(x, y, w, 1, CAP_HI); cv.set(x + (w >> 1), y + 1, GREEN); };
  const light = (cv, x, y, w = 3) => { cv.rect(x, y, w, 3, GREEN); cv.rect(x, y, w, 1, "#b9e08a"); cv.rect(x, y + 2, w, 1, "#6f9a41"); };
  for (const [x, y, w] of [...keys, ...thumbs]) dark(half, x, y, w);
  const W = 68, c = new Canvas(); half.mirrorInto(c, W);
  // exceptions: the two innermost thumb keys on the left half...
  light(c, 19, 19); light(c, 23, 20, 5);
  // ...and h j k l (home row, four inner columns) on the right half
  for (const [x, o] of cols.slice(2)) light(c, W - x - 3, o + 4);
  c.svg("corne", "Corne split keyboard with KAM Superuser keycaps");
}
