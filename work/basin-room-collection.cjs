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

// outputs/nurbis-dungeons/src/basin-room-collection.js
var basin_room_collection_exports = {};
__export(basin_room_collection_exports, {
  rooms: () => rooms
});
module.exports = __toCommonJS(basin_room_collection_exports);

// outputs/nurbis-dungeons/src/water-rescue-rules.js
function createWaterRescueRules(level2, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level2.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level2.map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === "S") seals.push([x, y]);
  }));
  const ready = (s) => seals.every((p) => s.boxes.some((b) => eq(b, p)));
  const wet = (s, p) => tile(p) === "U" ? !s.off : tile(p) === "W" ? s.off : false;
  const water = (p) => ["U", "W"].includes(tile(p));
  const edge = (a, b) => !(water(a) || water(b)) || a[1] === b[1];
  const gateOpen = (s, c) => c === "G" ? ready(s) : true;
  const blocked = (s, p) => ["#", " "].includes(tile(p)) || wet(s, p) || !gateOpen(s, tile(p));
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
        if (!edge(p, n) || blocked(s, n) || tile(n) === "A" || s.boxes.some((b) => eq(b, n)) || prev.has(String(n))) continue;
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
      n2.p = p;
      n2.moves++;
      n2.toggles++;
      return { state: n2, reason: n2.off ? "Das obere Becken l\xE4uft leer, das untere f\xFCllt sich. Gehe gerade weiter." : "Das untere Becken l\xE4uft leer, das obere f\xFCllt sich. Gehe gerade weiter." };
    }
    if (!edge(s.p, p)) return { reason: "Der Beckenrand ist geschlossen. Benutze die Treppen an den beiden Enden." };
    if (blocked(s, p)) return { reason: wet(s, p) ? "Das Becken ist geflutet. Lege es mit der Wippe trocken." : c === "G" ? "Alle vier Druckplatten m\xFCssen den Ausgang offenhalten." : "Hier ist eine Wand." };
    if (c === "O") {
      if (!s.rescued || !ready(s)) return { reason: "Hole den Freund dazu und belege alle Druckplatten." };
      const friendPath = path(s, level2.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Beide brauchen ein trockenes Becken oder einen Weg \xFCber festen Boden." };
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
      if (!edge(p, to) || blocked(s, to) || ["A", "F", "O", "G"].includes(tile(to)) || s.boxes.some((b) => eq(b, to))) return { reason: "Der Stein kann hier nicht weitergeschoben werden." };
      n.boxes[bi] = to;
      n.pushes++;
    }
    n.p = p;
    n.moves++;
    if (c === "F") n.rescued = true;
    return { state: n, reason: c === "F" ? "Der Freund ist gefunden. Bereite den freien Weg zum Ausgang vor." : ready(n) ? "Das Ausgangsgitter ist offen. Pr\xFCfe auch den trockenen Weg durch die Becken." : "Plane die Steinpl\xE4tze, das trockene Becken und die erreichbare Seite der Wippe." };
  } };
}

// outputs/nurbis-dungeons/src/basin-room-collection.js
var level = { "title": "Wechselnde Ufer", "desc": "Vier Steine \xF6ffnen den Ausgang. Die Wippe verlagert das Wasser zwischen zwei Becken. Nutze das trockene Becken zum Rangieren und bereite f\xFCr den Freund einen begehbaren Fluchtweg vor.", "tags": ["Vier Steine", "Wasserwechsel", "Zwei Becken"], "hint": "Ein Stein kann im Becken auf seinen n\xE4chsten Einsatz warten. Nach dem Fluten erreichst du ihn erst wieder, wenn dieses Becken trocken liegt.", "wall": 2, "floor": 1, "seed": 282889, "collection": true, "sunken": true, "rescue": true, "water": true, "waterRescue": true, "lever": true, "basinMount": "flush", "liquidType": "water", "friend": [1, 8], "exit": [11, 7], "outside": [12, 7], "connections": [[[2, 5], [4, 5], [4, 3]], [[2, 5], [4, 5], [4, 6]]], "map": ["            ", "########### ", "#S.####.#S# ", "#...UUU.S.# ", "#..####...# ", "#.A.#####.# ", "#...WWW...# ", "#..S###...GO", "#F..###...# ", "########### ", "            "] };
var rooms = [{ id: "wechselnde-ufer", level, ...createWaterRescueRules(level, { "p": [1, 5], "boxes": [[4, 6], [8, 7], [8, 6], [2, 3]] }) }];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rooms
});
