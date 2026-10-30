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

// outputs/nurbis-dungeons/src/counterflow-collection.js
var counterflow_collection_exports = {};
__export(counterflow_collection_exports, {
  rooms: () => rooms
});
module.exports = __toCommonJS(counterflow_collection_exports);

// outputs/nurbis-dungeons/src/switch-rescue-rules.js
function createSwitchRescueRules(level2, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level2.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level2.map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === "S") seals.push([x, y]);
  }));
  const ready = (s) => seals.every((p) => s.boxes.some((b) => eq(b, p)));
  const gateOpen = (s, c) => c === "G" ? s.off : c === "E" ? !s.off : c === "D" ? ready(s) : true;
  const blocked = (s, p) => ["#", " "].includes(tile(p)) || !gateOpen(s, tile(p));
  function path(s, from, to) {
    const q = [from], prev = /* @__PURE__ */ new Map([[String(from), null]]);
    for (let i = 0; i < q.length; i++) {
      const p = q[i];
      if (eq(p, to)) {
        const route = [];
        let at = p;
        while (at) {
          route.unshift(at);
          at = prev.get(String(at));
        }
        return route;
      }
      for (const d of dirs) {
        const n = [p[0] + d[0], p[1] + d[1]];
        if (blocked(s, n) || tile(n) === "A" || s.boxes.some((b) => eq(b, n)) || prev.has(String(n))) continue;
        prev.set(String(n), p);
        q.push(n);
      }
    }
    return null;
  }
  return { ready, path, initial: () => ({ ...structuredClone(start), off: false, toggles: 0, rescued: false, moves: 0, pushes: 0, won: false, flowers: [] }), act(s, d) {
    if (s.won) return { reason: "Ihr seid beide drau\xDFen." };
    if (Math.abs(d[0]) + Math.abs(d[1]) !== 1) return { reason: "Ein Feld pro Schritt." };
    const p = [s.p[0] + d[0], s.p[1] + d[1]], c = tile(p);
    if (tile(s.p) === "A" && (d[1] !== 0 || d[0] !== (s.off ? 1 : -1))) return { reason: "Gehe gerade \xFCber das jetzt abgesenkte Ende der Wippe weiter." };
    if (c === "A") {
      if (d[1] !== 0 || d[0] !== (s.off ? -1 : 1)) return { reason: "Die Wippe ist nur vom abgesenkten Ende betretbar. Die Seitenfassung bleibt geschlossen." };
      const n2 = structuredClone(s);
      n2.off = !n2.off;
      const exit = [p[0] + d[0], p[1] + d[1]];
      if (blocked(n2, exit) || tile(exit) === "A" || s.boxes.some((b) => eq(b, exit))) return { reason: "Das andere Ende der Wippe ist versperrt." };
      if (s.boxes.some((b) => !gateOpen(n2, tile(b)))) return { reason: "Ein Stein steht im schlie\xDFenden Durchgang. Die Wippe bleibt in ihrer Stellung." };
      n2.p = p;
      n2.moves++;
      n2.toggles++;
      return { state: n2, reason: "Die Wippe kippt. Ein Durchgang \xF6ffnet, der andere schlie\xDFt. Gehe gerade weiter." };
    }
    if (blocked(s, p)) return { reason: ["G", "E"].includes(c) ? "Dieser Durchgang wird von der Wippe bedient." : c === "D" ? "Alle vier Druckplatten m\xFCssen den Ausgang offenhalten." : "Hier ist eine Wand." };
    if (c === "O") {
      if (!s.rescued || !ready(s)) return { reason: "Hole den Freund dazu und belege alle Druckplatten." };
      const friendPath = path(s, level2.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Die Wippe kann auf dem Fluchtweg nicht einfach \xFCbergangen werden." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level2.outside];
      n2.nurbiRoute = [...nurbiPath, level2.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level2.outside;
      n2.moves++;
      n2.won = true;
      return { state: n2, reason: "Beide Wege sind frei. Nurbi und der Freund gehen gemeinsam hinaus." };
    }
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, p));
    if (bi >= 0) {
      const to = [p[0] + d[0], p[1] + d[1]];
      if (blocked(s, to) || ["A", "F", "O", "D"].includes(tile(to)) || s.boxes.some((b) => eq(b, to))) return { reason: "Der Stein kann hier nicht weitergeschoben werden." };
      n.boxes[bi] = to;
      n.pushes++;
    }
    n.p = p;
    n.moves++;
    if (c === "F") n.rescued = true;
    return { state: n, reason: c === "F" ? "Der Freund ist gefunden. Bereite den freien Weg zum Ausgang vor." : ready(n) ? "Das Ausgangsgitter ist offen. Pr\xFCfe auch die beiden Wechselgitter." : "Plane die Steinpl\xE4tze und die erreichbare Seite der Wippe." };
  } };
}

// outputs/nurbis-dungeons/src/counterflow-collection.js
var level = { "title": "Gegenl\xE4ufig", "desc": "Vier Steine halten den Ausgang offen. Die Bodenwippe \xF6ffnet abwechselnd zwei innere Durchg\xE4nge. Finde den Freund und bereite euren freien Weg nach drau\xDFen vor.", "tags": ["Vier Steine", "Richtungswippe", "Wechselgitter"], "hint": "Ein offener Durchgang allein hilft nicht. \xDCberlege vor jedem Umschalten, welche Steine bereits auf der anderen Seite stehen m\xFCssen \u2013 und wie du wieder zum tiefen Ende der Wippe kommst.", "wall": 2, "floor": 1, "seed": 284257, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "friend": [2, 2], "exit": [10, 4], "outside": [11, 4], "connections": [[[3, 4], [4, 4], [5, 4], [6, 4], [7, 4]], [[3, 4], [4, 4], [4, 5]]], "map": ["           ", " ######### ", " #F..#.SS# ", " #.......# ", " #.A..#G.DO", " #..E#S.S# ", " ###.....# ", " #....#### ", " ######### ", "           "] };
var rooms = [{ id: "gegenlaeufig", level, ...createSwitchRescueRules(level, { "p": [7, 3], "boxes": [[7, 6], [4, 4], [5, 6], [6, 3]] }) }];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rooms
});
