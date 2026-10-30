var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var combined_core_exports = {};
__export(combined_core_exports, {
  act: () => act,
  eq: () => eq,
  gateOpen: () => gateOpen,
  initial: () => initial,
  level: () => level,
  plate: () => plate,
  tile: () => tile
});
module.exports = __toCommonJS(combined_core_exports);
const level = { title: "Der Umweg zum Freund", desc: "Bringe den Stein durch das versenkbare Gitter auf das Siegel. Die Wippe \uFFFDffnet den Transportweg \uFFFD aber der Stein muss auf der anderen Seite erst um die Mauer herum.", hint: "Plane die Stellen ein, an denen Nurbi hinter den Stein gelangen muss. Ein Stein an einer Wand l\uFFFDsst sich nicht von dort wegziehen.", theme: "TESTR\uFFFDTSEL \uFFFD WIPPE, STEIN & GITTER", wall: 2, floor: 1, seed: 719, combined: true, map: [
  "###########",
  "#....#....#",
  "#....#....#",
  "#..A.#....#",
  "#....G..#.#",
  "#....##...#",
  "#....#....#",
  "#....#..S.#",
  "#....####D#",
  "#....#...F#",
  "###########"
] };
const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
const tile = (p) => level.map[p[1]]?.[p[0]] ?? "#";
const plate = (s) => s.boxes.some((b) => tile(b) === "S");
function initial() {
  return { p: [2, 8], boxes: [[3, 7]], off: false, moves: 0, pushes: 0, won: false, flowers: [] };
}
function gateOpen(s, c) {
  return c === "G" ? s.off : plate(s);
}
function act(s, [dx, dy]) {
  if (s.won) return { reason: "Der Freund ist in Sicherheit." };
  if (Math.abs(dx) + Math.abs(dy) !== 1) return { reason: "Ein Schritt pro Richtung." };
  const dest = [s.p[0] + dx, s.p[1] + dy], c = tile(dest), blocked = (p, state = s) => tile(p) === "#" || ["G", "D"].includes(tile(p)) && !gateOpen(state, tile(p));
  if (tile(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { reason: "\uFFFDberquere die Wippe gerade bis zum anderen Ende." };
  if (c === "A") {
    if (dy !== 0 || dx !== (s.off ? -1 : 1)) return { reason: "Betritt die Wippe am tiefen Ende. Die Seiten und das hohe Ende sind gesperrt." };
    const n2 = structuredClone(s);
    n2.off = !s.off;
    const exit = [dest[0] + dx, dest[1]], occupied = s.boxes.some((b) => tile(b) === "G");
    if (occupied && !n2.off) return { reason: "Der Stein steht im Gitter. Es bleibt versenkt; die Wippe l\uFFFDsst sich so nicht umschalten." };
    if (blocked(exit, n2) || s.boxes.some((b) => eq(b, exit))) return { reason: "Das andere Ende der Wippe ist versperrt." };
    n2.p = dest;
    n2.moves++;
    return { state: n2, reason: n2.off ? "Die Wippe kippt. Das Transportgitter versinkt. Gehe gerade weiter." : "Die Wippe kippt zur\uFFFDck. Das Transportgitter schlie\uFFFDt. Gehe gerade weiter." };
  }
  if (blocked(dest)) return { reason: c === "G" ? "Das Transportgitter ist geschlossen. Suche das tiefe Ende der Wippe." : c === "D" ? "Das zweite Gitter \uFFFDffnet sich, solange der Stein auf dem Siegel steht." : "Hier ist eine Wand." };
  const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, dest));
  if (bi >= 0) {
    const next = [dest[0] + dx, dest[1] + dy];
    if (blocked(next) || ["A", "F"].includes(tile(next)) || n.boxes.some((b) => eq(b, next))) return { reason: "Der Stein kann hier nicht weiter. Er l\uFFFDsst sich nur schieben." };
    n.boxes[bi] = next;
    n.pushes++;
  }
  n.p = dest;
  n.moves++;
  n.won = c === "F";
  return { state: n, reason: n.won ? "Der kleine K\uFFFDfer ist frei!" : plate(n) ? "Das Siegel ist belegt. Der letzte Durchgang ist offen." : bi >= 0 ? "Stein verschoben. Achte auf Platz zum Umrunden." : "Finde den Schiebeweg zum Siegel." };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  act,
  eq,
  gateOpen,
  initial,
  level,
  plate,
  tile
});
