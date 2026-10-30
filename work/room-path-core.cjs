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

// outputs/nurbis-dungeons/src/room-path-core.js
var room_path_core_exports = {};
__export(room_path_core_exports, {
  act: () => act2,
  initial: () => initial2,
  level: () => level2,
  plate: () => plate2
});
module.exports = __toCommonJS(room_path_core_exports);

// outputs/nurbis-dungeons/src/combined-core.js
var level = { title: "Der Umweg zum Freund", desc: "Bringe den Stein durch das versenkbare Gitter auf das Siegel. Die Wippe \xF6ffnet den Transportweg \u2013 aber der Stein muss auf der anderen Seite erst um die Mauer herum.", hint: "Plane die Stellen ein, an denen Nurbi hinter den Stein gelangen muss. Ein Stein an einer Wand l\xE4sst sich nicht von dort wegziehen.", theme: "TESTR\xC4TSEL \xB7 WIPPE, STEIN & GITTER", wall: 2, floor: 1, seed: 719, combined: true, map: [
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
var eq = (a, b) => a[0] === b[0] && a[1] === b[1];
var tile = (p) => level.map[p[1]]?.[p[0]] ?? "#";
var plate = (s) => s.boxes.some((b) => tile(b) === "S");
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
  if (tile(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { reason: "\xDCberquere die Wippe gerade bis zum anderen Ende." };
  if (c === "A") {
    if (dy !== 0 || dx !== (s.off ? -1 : 1)) return { reason: "Betritt die Wippe am tiefen Ende. Die Seiten und das hohe Ende sind gesperrt." };
    const n2 = structuredClone(s);
    n2.off = !s.off;
    const exit = [dest[0] + dx, dest[1]], occupied = s.boxes.some((b) => tile(b) === "G");
    if (occupied && !n2.off) return { reason: "Der Stein steht im Gitter. Es bleibt versenkt; die Wippe l\xE4sst sich so nicht umschalten." };
    if (blocked(exit, n2) || s.boxes.some((b) => eq(b, exit))) return { reason: "Das andere Ende der Wippe ist versperrt." };
    n2.p = dest;
    n2.moves++;
    return { state: n2, reason: n2.off ? "Die Wippe kippt. Das Transportgitter versinkt. Gehe gerade weiter." : "Die Wippe kippt zur\xFCck. Das Transportgitter schlie\xDFt. Gehe gerade weiter." };
  }
  if (blocked(dest)) return { reason: c === "G" ? "Das Transportgitter ist geschlossen. Suche das tiefe Ende der Wippe." : c === "D" ? "Das zweite Gitter \xF6ffnet sich, solange der Stein auf dem Siegel steht." : "Hier ist eine Wand." };
  const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, dest));
  if (bi >= 0) {
    const next = [dest[0] + dx, dest[1] + dy];
    if (blocked(next) || ["A", "F"].includes(tile(next)) || n.boxes.some((b) => eq(b, next))) return { reason: "Der Stein kann hier nicht weiter. Er l\xE4sst sich nur schieben." };
    n.boxes[bi] = next;
    n.pushes++;
  }
  n.p = dest;
  n.moves++;
  n.won = c === "F";
  return { state: n, reason: n.won ? "Der kleine K\xE4fer ist frei!" : plate(n) ? "Das Siegel ist belegt. Der letzte Durchgang ist offen." : bi >= 0 ? "Stein verschoben. Achte auf Platz zum Umrunden." : "Finde den Schiebeweg zum Siegel." };
}

// outputs/nurbis-dungeons/src/room-path-core.js
var level2 = { ...level, title: "Ein Weg hinein. Ein Weg hinaus.", desc: "Nurbi kommt durch den linken Eingang. Befreie den K\xE4fer und verlasse mit ihm den Raum durch den rechten Ausgang.", hint: level.hint, access: { entry: [0, 7], entryRotation: Math.PI / 2, exit: [10, 9], exitRotation: -Math.PI / 2, type: "passage" }, map: level.map.map((r, y) => y === 7 ? "I" + r.slice(1) : y === 9 ? r.slice(0, 10) + "O" : r) };
var plate2 = plate;
var initial2 = () => ({ ...initial(), rescued: false });
function act2(s, d) {
  if (s.won) return { reason: "Nurbi und sein Freund sind drau\xDFen." };
  const next = [s.p[0] + d[0], s.p[1] + d[1]], c = level2.map[next[1]]?.[next[0]];
  if (c === "O") {
    if (!s.rescued) return { reason: "Der K\xE4fer wartet noch im Raum." };
    if (!plate2(s)) return { reason: "Der Weg zum Ausgang muss frei bleiben." };
    const n = structuredClone(s);
    n.p = [11, 9];
    n.moves++;
    n.won = true;
    return { state: n, reason: "Nurbi und der K\xE4fer verlassen gemeinsam den Raum." };
  }
  if (c === "I") {
    const n = structuredClone(s);
    n.p = next;
    n.moves++;
    return { state: n, reason: "Durch diesen Eingang ist Nurbi hereingekommen. Der Freund wartet noch im Raum." };
  }
  const result = act(s, d);
  if (result.state && result.state.won) {
    result.state.won = false;
    result.state.rescued = true;
    result.reason = "Der K\xE4fer ist bei dir. Gehe mit ihm durch den Ausgang rechts.";
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  act,
  initial,
  level,
  plate
});
