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

// outputs/nurbis-dungeons/src/rescue-collection.js
var rescue_collection_exports = {};
__export(rescue_collection_exports, {
  rooms: () => rooms
});
module.exports = __toCommonJS(rescue_collection_exports);

// outputs/nurbis-dungeons/src/rescue-rules.js
function createRescueRules(level, start) {
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level.map[p[1]]?.[p[0]] ?? "#";
  const seals = [];
  level.map.forEach((r, y) => [...r].forEach((c, x) => {
    if (c === "S") seals.push([x, y]);
  }));
  const ready = (s) => seals.every((p) => s.boxes.some((b) => eq(b, p)));
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
        const n = [p[0] + d[0], p[1] + d[1]], c = tile(n);
        if (!c || c === "#" || c === " " || c === "G" && !ready(s) || s.boxes.some((b) => eq(b, n)) || prev.has(String(n))) continue;
        prev.set(String(n), p);
        q.push(n);
      }
    }
    return null;
  }
  return { ready, path, initial: () => ({ ...structuredClone(start), rescued: false, moves: 0, pushes: 0, won: false, flowers: [] }), act(s, d) {
    if (s.won) return { reason: "Ihr seid beide drau\xDFen." };
    if (Math.abs(d[0]) + Math.abs(d[1]) !== 1) return { reason: "Ein Schritt pro Richtung." };
    const p = [s.p[0] + d[0], s.p[1] + d[1]], c = tile(p);
    if (c === "#" || c === " " || !c) return { reason: "Hier ist der Raum begrenzt." };
    if (c === "G" && !ready(s)) return { reason: "Beide Ruhepl\xE4tze m\xFCssen belegt sein, damit das Ausgangsgitter offen bleibt." };
    if (c === "O") {
      if (!s.rescued) return { reason: "Hole den Freund dazu, bevor du hinausgehst." };
      if (!ready(s)) return { reason: "Das Ausgangsgitter ist noch geschlossen." };
      const friendPath = path(s, level.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der Weg ist noch nicht f\xFCr euch beide frei." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level.outside];
      n2.nurbiRoute = [...nurbiPath, level.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level.outside;
      n2.moves++;
      n2.won = true;
      return { state: n2, reason: "Der Weg ist frei. Nurbi und der Freund gehen durch den Ausgang." };
    }
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, p));
    if (bi >= 0) {
      const to = [p[0] + d[0], p[1] + d[1]], t = tile(to);
      if (["#", " ", "F", "G", "O"].includes(t) || !t || n.boxes.some((b) => eq(b, to))) return { reason: "Der Stein kann hier nicht weiter." };
      n.boxes[bi] = to;
      n.pushes++;
    }
    n.p = p;
    n.moves++;
    if (c === "F") n.rescued = true;
    return { state: n, reason: c === "F" ? "Du hast den Freund gefunden. Er wartet hier, bis sein Weg nach drau\xDFen frei ist." : ready(n) ? "Der Durchgang ist offen. Besuche den Freund und gehe zum Ausgang; er folgt auf dem freien Weg." : "Plane die Steinpl\xE4tze so, dass auch der Weg nach drau\xDFen frei bleibt." };
  } };
}

// outputs/nurbis-dungeons/src/rescue-collection.js
var rooms = [];
var level0 = { "title": "Der freizuhaltende Weg", "desc": "Befreie den Gartenfreund und geht gemeinsam hinaus. Beide Steine m\xFCssen den Ausgang offenhalten, ohne seinen Fluchtweg zu versperren.", "tags": ["Rettung", "Zwei Steine", "Freier Ausgang"], "hint": "Ein passender Steinplatz gen\xFCgt noch nicht. Nurbi und der Freund brauchen am Ende einen durchgehenden Weg zum Gitter.", "wall": 2, "floor": 1, "seed": 5271, "collection": true, "sunken": true, "rescue": true, "friend": [3, 4], "exit": [9, 5], "outside": [10, 5], "map": ["###########", "###########", "##.#....###", "##......###", "##.F..#.###", "##....#.GO ", "###.#.#.###", "##SS....###", "###########", "###########", "###########"] };
rooms.push({ id: "rettung1", level: level0, ...createRescueRules(level0, { "p": [4, 2], "boxes": [[4, 3], [6, 3]] }) });
var level1 = { "title": "Ein Platz zu fr\xFCh", "desc": "Befreie den Gartenfreund und geht gemeinsam hinaus. Beide Steine m\xFCssen den Ausgang offenhalten, ohne seinen Fluchtweg zu versperren.", "tags": ["Rettung", "Zwei Steine", "Freier Ausgang"], "hint": "Ein passender Steinplatz gen\xFCgt noch nicht. Nurbi und der Freund brauchen am Ende einen durchgehenden Weg zum Gitter.", "wall": 2, "floor": 1, "seed": 5302, "collection": true, "sunken": true, "rescue": true, "friend": [6, 4], "exit": [9, 5], "outside": [10, 5], "map": ["###########", "###########", "####....###", "##..#.#.###", "##....F.###", "##...##.GO ", "##....S.###", "##...S..###", "###########", "###########", "###########"] };
rooms.push({ id: "rettung2", level: level1, ...createRescueRules(level1, { "p": [3, 3], "boxes": [[5, 3], [3, 4]] }) });
var level2 = { "title": "Zwischen den Steinen", "desc": "Befreie den Gartenfreund und geht gemeinsam hinaus. Beide Steine m\xFCssen den Ausgang offenhalten, ohne seinen Fluchtweg zu versperren.", "tags": ["Rettung", "Zwei Steine", "Freier Ausgang"], "hint": "Ein passender Steinplatz gen\xFCgt noch nicht. Nurbi und der Freund brauchen am Ende einen durchgehenden Weg zum Gitter.", "wall": 2, "floor": 1, "seed": 5333, "collection": true, "sunken": true, "rescue": true, "friend": [6, 4], "exit": [9, 5], "outside": [10, 5], "map": ["###########", "###########", "##......###", "##....#.###", "##...#FS###", "##.#....GO ", "##....S.###", "##.....####", "###########", "###########", "###########"] };
rooms.push({ id: "rettung3", level: level2, ...createRescueRules(level2, { "p": [5, 3], "boxes": [[3, 4], [4, 3]] }) });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rooms
});
