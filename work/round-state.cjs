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

// outputs/nurbis-dungeons/src/round-state.js
var round_state_exports = {};
__export(round_state_exports, {
  createRound: () => createRound,
  directions: () => directions,
  solutionStates: () => solutionStates
});
module.exports = __toCommonJS(round_state_exports);

// outputs/nurbis-dungeons/src/rescue-rules.js
function createRescueRules(level5, start) {
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level5.map[p[1]]?.[p[0]] ?? "#";
  const seals = [];
  level5.map.forEach((r, y) => [...r].forEach((c, x) => {
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
    if (c === "G" && !ready(s)) return { reason: "Alle Druckplatten m\xFCssen belegt sein, damit das Ausgangsgitter offen bleibt." };
    if (c === "O") {
      if (!s.rescued) return { reason: "Hole den Freund dazu, bevor du hinausgehst." };
      if (!ready(s)) return { reason: "Das Ausgangsgitter ist noch geschlossen." };
      const friendPath = path(s, level5.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der Weg ist noch nicht f\xFCr euch beide frei." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level5.outside];
      n2.nurbiRoute = [...nurbiPath, level5.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level5.outside;
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

// outputs/nurbis-dungeons/src/interlock-collection.js
var level = { "title": "Verzahnte Wege", "desc": "Vier Druckplatten halten den Ausgang offen. Erreiche den verirrten Gartenfreund und finde f\xFCr euch beide einen freien Weg hinaus.", "tags": ["Vier Steine", "Engstellen", "Rettungsweg"], "hint": "Die Schalter sind sichtbar. Entscheidend ist, welche Seite jedes Steins du sp\xE4ter noch erreichen kannst.", "wall": 2, "floor": 1, "seed": 28264, "collection": true, "sunken": true, "rescue": true, "friend": [1, 2], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " F.......# ", " #....S### ", " #..#....# ", " ##...#..# ", " #.#...S.# ", " #S..S#..GO", " ######### ", "           "] };
var rooms = [{ id: "verzahnte-wege", level, ...createRescueRules(level, { "p": [5, 7], "boxes": [[4, 3], [6, 4], [4, 5], [5, 6]] }) }];

// outputs/nurbis-dungeons/src/switch-rescue-rules.js
function createSwitchRescueRules(level5, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level5.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level5.map.forEach((row, y) => [...row].forEach((c, x) => {
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
      const friendPath = path(s, level5.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Die Wippe kann auf dem Fluchtweg nicht einfach \xFCbergangen werden." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level5.outside];
      n2.nurbiRoute = [...nurbiPath, level5.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level5.outside;
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
var level2 = { "title": "Gegenl\xE4ufig", "desc": "Vier Steine halten den Ausgang offen. Die Bodenwippe \xF6ffnet abwechselnd zwei innere Durchg\xE4nge. Finde den Freund und bereite euren freien Weg nach drau\xDFen vor.", "tags": ["Vier Steine", "Richtungswippe", "Wechselgitter"], "hint": "Ein offener Durchgang allein hilft nicht. \xDCberlege vor jedem Umschalten, welche Steine bereits auf der anderen Seite stehen m\xFCssen \u2013 und wie du wieder zum tiefen Ende der Wippe kommst.", "wall": 2, "floor": 1, "seed": 284257, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "friend": [2, 2], "exit": [10, 4], "outside": [11, 4], "connections": [[[3, 4], [4, 4], [5, 4], [6, 4], [7, 4]], [[3, 4], [4, 4], [4, 5]]], "map": ["           ", " ######### ", " #F..#.SS# ", " #.......# ", " #.A..#G.DO", " #..E#S.S# ", " ###.....# ", " #....#### ", " ######### ", "           "] };
var rooms2 = [{ id: "gegenlaeufig", level: level2, ...createSwitchRescueRules(level2, { "p": [7, 3], "boxes": [[7, 6], [4, 4], [5, 6], [6, 3]] }) }];

// outputs/nurbis-dungeons/src/fracture-rescue-rules.js
function createFractureRescueRules(level5, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level5.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level5.map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === "S") seals.push([x, y]);
  }));
  const ready = (s) => seals.every((p) => s.boxes.some((b) => eq(b, p)));
  const blocked = (s, p) => ["#", " "].includes(tile(p)) || tile(p) === "T" && s.opened || tile(p) === "G" && !ready(s);
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
        if (blocked(s, n) || tile(n) === "T" || s.boxes.some((b) => eq(b, n)) || prev.has(String(n))) continue;
        prev.set(String(n), p);
        q.push(n);
      }
    }
    return null;
  }
  return { ready, path, initial: () => ({ ...structuredClone(start), opened: false, collapseStone: false, rescued: false, moves: 0, pushes: 0, won: false, flowers: [] }), act(s, d) {
    if (s.won) return { reason: "Ihr seid beide drau\xDFen." };
    if (Math.abs(d[0]) + Math.abs(d[1]) !== 1) return { reason: "Ein Feld pro Schritt." };
    const p = [s.p[0] + d[0], s.p[1] + d[1]], c = tile(p);
    if (blocked(s, p)) return { reason: c === "T" ? "Die Bretter sind eingebrochen. Hier f\xFChrt kein Weg mehr hin\xFCber." : c === "G" ? "Alle vier Druckplatten m\xFCssen den Ausgang offenhalten." : "Hier ist eine Wand." };
    if (c === "O") {
      if (!s.rescued || !ready(s)) return { reason: "Hole den Freund dazu und belege alle Druckplatten." };
      const friendPath = path(s, level5.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der Weg ist noch nicht f\xFCr euch beide frei. Der offene Schacht bleibt unpassierbar." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level5.outside];
      n2.nurbiRoute = [...nurbiPath, level5.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level5.outside;
      n2.moves++;
      n2.won = true;
      return { state: n2, reason: "Der sichere Weg ist frei. Nurbi und der Freund gehen gemeinsam hinaus." };
    }
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, p));
    let stoneFell = false;
    if (bi >= 0) {
      const to = [p[0] + d[0], p[1] + d[1]];
      if (blocked(s, to) || ["F", "G", "O"].includes(tile(to)) || s.boxes.some((b) => eq(b, to))) return { reason: "Der Stein kann hier nicht weitergeschoben werden." };
      if (tile(to) === "T") {
        n.boxes.splice(bi, 1);
        n.opened = true;
        n.collapseStone = true;
        stoneFell = true;
      } else n.boxes[bi] = to;
      n.pushes++;
    }
    const walkedOff = tile(s.p) === "T" && !s.opened;
    if (walkedOff) {
      n.opened = true;
      n.collapseStone = false;
    }
    n.p = p;
    n.moves++;
    if (c === "F") n.rescued = true;
    return { state: n, reason: stoneFell ? "Unter dem schweren Stein brechen die Bretter sofort. Der Stein ist verloren. R\xFCckg\xE4ngig stellt ihn wieder her." : walkedOff ? "Die Bretter brechen hinter Nurbi ein. Diese Standfl\xE4che ist jetzt verloren." : c === "T" ? "Die morschen Bretter tragen Nurbi noch. Beim Verlassen brechen sie ein." : c === "F" ? "Der Freund ist gefunden. Bereite den sicheren gemeinsamen Weg zum Ausgang vor." : ready(n) ? "Der Ausgang ist offen. Erreicht ihn beide \xFCber festen Boden." : "Plane auch, welche Standfl\xE4chen du sp\xE4ter noch zum Schieben brauchst." };
  } };
}

// outputs/nurbis-dungeons/src/fracture-collection.js
var level3 = { "title": "Nur einmal hin\xFCber", "desc": "Vier Steine \xF6ffnen den Ausgang. Die morschen Bretter tragen Nurbi noch einmal und brechen beim Verlassen ein. Bereite die Steinpl\xE4tze vor und rette den Gartenfreund \xFCber festen Boden.", "tags": ["Vier Steine", "Morsche Bretter", "Verlorene Standfl\xE4che"], "hint": "Nicht nur der Transportweg z\xE4hlt. Nach dem Einsturz kannst du auf diesem Feld auch nicht mehr stehen, um einen benachbarten Stein zu schieben.", "wall": 2, "floor": 1, "seed": 785643, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [2, 4], "exit": [10, 5], "outside": [11, 5], "map": ["           ", " ######### ", " #...#TS.# ", " ##..#..## ", " #F....S.# ", " #..S#...GO", " #S#.##..# ", " #.#.#...# ", " ######### ", "           "] };
var rooms3 = [{ id: "nur-einmal-hinueber", level: level3, ...createFractureRescueRules(level3, { "p": [7, 2], "boxes": [[4, 4], [7, 3], [3, 3], [6, 4]] }) }];

// outputs/nurbis-dungeons/src/water-rescue-rules.js
function createWaterRescueRules(level5, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level5.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level5.map.forEach((row, y) => [...row].forEach((c, x) => {
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
      const friendPath = path(s, level5.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Beide brauchen ein trockenes Becken oder einen Weg \xFCber festen Boden." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level5.outside];
      n2.nurbiRoute = [...nurbiPath, level5.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level5.outside;
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
var level4 = { "title": "Wechselnde Ufer", "desc": "Vier Steine \xF6ffnen den Ausgang. Die Wippe verlagert das Wasser zwischen zwei Becken. Nutze das trockene Becken zum Rangieren und bereite f\xFCr den Freund einen begehbaren Fluchtweg vor.", "tags": ["Vier Steine", "Wasserwechsel", "Zwei Becken"], "hint": "Ein Stein kann im Becken auf seinen n\xE4chsten Einsatz warten. Nach dem Fluten erreichst du ihn erst wieder, wenn dieses Becken trocken liegt.", "wall": 2, "floor": 1, "seed": 282889, "collection": true, "sunken": true, "rescue": true, "water": true, "waterRescue": true, "lever": true, "basinMount": "flush", "liquidType": "water", "friend": [1, 8], "exit": [11, 7], "outside": [12, 7], "connections": [[[2, 5], [4, 5], [4, 3]], [[2, 5], [4, 5], [4, 6]]], "map": ["            ", "########### ", "#S.####.#S# ", "#...UUU.S.# ", "#..####...# ", "#.A.#####.# ", "#...WWW...# ", "#..S###...GO", "#F..###...# ", "########### ", "            "] };
var rooms4 = [{ id: "wechselnde-ufer", level: level4, ...createWaterRescueRules(level4, { "p": [1, 5], "boxes": [[4, 6], [8, 7], [8, 6], [2, 3]] }) }];

// outputs/nurbis-dungeons/src/interlock-solution.js
var solution = "UUURUULLLDDDRLUUURRRDDLDURUULDLULLDDRDRRURUULLLDURRRDLLRDDLDDRURRURULDDLLUUDDRRUULUULLDRDDURRDDLLULDRDLLRUURUUULLLDRRURDDRRDDLLLULULURRLDDRDRRRUULLDLLUUURRDDULLDDRDRLULUURRDDDRLUUUULLLLRRRRDDRRRDDDRR";

// outputs/nurbis-dungeons/src/counterflow-solution.js
var solution2 = "RDDLLDLRURRUULLLLULLDRRRLLLDDRRURULRRURRDDDLLDLDLUUDRRURRDLLLRURRUUULLDLLULLDDDRRUDLLURRRURURDDRDLUULLDLLLUURRDULLDRRRRLLLLDDRRURURURRDDDDLLLDLUUDRRRURUUULLDRURDDULLLLULLDRRRLLLDDRRURULRRLDLDLLURRURRURRDDLULLLULLDRRRRRDRULLLLULLRRDRRRRDRR";

// outputs/nurbis-dungeons/src/fracture-solution.js
var solution3 = "DDDLULLDLLURRRRLLUULDDRRRDRRULLLLRRRRDDDLURUULLLLDLULDURRRRRUULDRDRDDLUUUDLLLDLLURRUULDRDDLLURURDRRLLLLRRRRDRRRR";

// outputs/nurbis-dungeons/src/basin-room-solution.js
var solution4 = "DRRRRLLLLUUURDLDRRDLLUUURRRRRRDRRDDDDLLUURLDDRRUUUUUDLLULLLLLDLDDRRULLDRRRRRRDDRRUULLLLLLLDLUUUUDDDRRRRRRDDRURULLLLLLDLLURLURRDLDDLUUUUURRRRRRDRRDDDRR";

// outputs/nurbis-dungeons/src/round-data.js
var rooms5 = [rooms[0], rooms2[0], rooms3[0], rooms4[0]];
var solutions = [solution, solution2, solution3, solution4];

// outputs/nurbis-dungeons/src/round-state.js
var directions = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };
var signature = (s) => JSON.stringify([s.p, s.boxes, s.off ?? false, s.opened ?? false, s.rescued, s.won]);
var solutionStates = rooms5.map((room, i) => {
  const states = [room.initial()];
  for (const letter of solutions[i]) {
    const next = room.act(states.at(-1), directions[letter]).state;
    if (!next) throw Error("Ung\xFCltige Testl\xF6sung in " + room.id);
    states.push(next);
  }
  if (!states.at(-1).won) throw Error("Unvollst\xE4ndige Testl\xF6sung in " + room.id);
  return states;
});
function createRound(saved) {
  let index = 0, slots = rooms5.map((r) => ({ state: r.initial(), history: [], solved: false }));
  if (saved?.version === 1 && Array.isArray(saved.ids) && saved.ids.every((id, i) => id === rooms5[i]?.id) && saved.ids.length === rooms5.length && saved.slots?.length === rooms5.length) {
    const valid = saved.slots.every((slot) => slot && Array.isArray(slot.history) && Number.isInteger(slot.state?.moves) && Array.isArray(slot.state?.p) && Array.isArray(slot.state?.boxes));
    if (valid) {
      slots = structuredClone(saved.slots);
      index = Math.max(0, Math.min(rooms5.length - 1, Number.isInteger(saved.index) ? saved.index : 0));
    }
  }
  return {
    get index() {
      return index;
    },
    get slots() {
      return slots;
    },
    get slot() {
      return slots[index];
    },
    get room() {
      return rooms5[index];
    },
    get completed() {
      return slots.filter((s) => s.solved).length;
    },
    select(i) {
      if (Number.isInteger(i) && i >= 0 && i < rooms5.length) index = i;
    },
    act(d) {
      const slot = slots[index], result = rooms5[index].act(slot.state, d);
      if (result.state) {
        slot.history.push(slot.state);
        slot.state = result.state;
        slot.solved ||= slot.state.won;
      }
      return result;
    },
    undo() {
      const slot = slots[index];
      if (!slot.history.length) return false;
      slot.state = slot.history.pop();
      return true;
    },
    reset() {
      slots[index] = { state: rooms5[index].initial(), history: [], solved: slots[index].solved };
    },
    next() {
      if (!slots[index].state.won || index === rooms5.length - 1) return false;
      index++;
      return true;
    },
    guidePosition() {
      const state = slots[index].state, at = state.moves;
      return solutionStates[index][at] && signature(solutionStates[index][at]) === signature(state) ? at : -1;
    },
    export() {
      return { version: 1, ids: rooms5.map((r) => r.id), index, slots: structuredClone(slots) };
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRound,
  directions,
  solutionStates
});
