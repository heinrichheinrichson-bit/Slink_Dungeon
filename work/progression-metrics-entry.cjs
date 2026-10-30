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

// work/progression-metrics-entry.js
var progression_metrics_entry_exports = {};
__export(progression_metrics_entry_exports, {
  added: () => rooms10,
  addedSolutions: () => solutions6,
  introductions: () => introductions5,
  rooms: () => rooms9,
  solutions: () => solutions5
});
module.exports = __toCommonJS(progression_metrics_entry_exports);

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
    let crossed = false;
    if (tile(s.p) === "A") {
      const entry = s.rockerEntry ?? (s.off ? -1 : 1);
      if (d[1] !== 0) return { reason: "Die Seitenfassung der Wippe ist geschlossen. Gehe vor oder zur\xFCck." };
      if (d[0] === entry) {
        const n2 = structuredClone(s);
        n2.off = !n2.off;
        if (blocked(n2, p) || tile(p) === "A" || s.boxes.some((b) => eq(b, p))) return { reason: "Das andere Ende ist versperrt. Du kannst auf der Wippe zur\xFCckgehen, ohne umzuschalten." };
        if (s.boxes.some((b) => !gateOpen(n2, tile(b)))) return { reason: "Ein Stein steht im schlie\xDFenden Durchgang. Die Wippe kann nicht kippen; gehe zur\xFCck." };
        n2.toggles++;
        delete n2.rockerEntry;
        s = n2;
        crossed = true;
      } else if (d[0] === -entry) {
        if (blocked(s, p) || s.boxes.some((b) => eq(b, p))) return { reason: "Der R\xFCckweg ist versperrt." };
        const n2 = structuredClone(s);
        delete n2.rockerEntry;
        n2.p = p;
        n2.moves++;
        return { state: n2, reason: "Zur\xFCck vom tiefen Ende. Die Wippe bleibt unver\xE4ndert." };
      }
    }
    if (c === "A") {
      if (d[1] !== 0 || d[0] !== (s.off ? -1 : 1)) return { reason: "Die Wippe ist nur vom abgesenkten Ende betretbar. Die Seitenfassung bleibt geschlossen." };
      const n2 = structuredClone(s);
      n2.rockerEntry = d[0];
      n2.p = p;
      n2.moves++;
      return { state: n2, reason: "Nurbi steht auf dem tiefen Ende. Weitergehen kippt die Wippe; zur\xFCckgehen schaltet nichts." };
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
    return { state: n, reason: crossed ? "Vollst\xE4ndig \xFCberquert: Die Wippe kippt und schaltet um." : c === "F" ? "Der Freund ist gefunden. Bereite den freien Weg zum Ausgang vor." : ready(n) ? "Das Ausgangsgitter ist offen. Pr\xFCfe auch die beiden Wechselgitter." : "Plane die Steinpl\xE4tze und die erreichbare Seite der Wippe." };
  } };
}

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

// outputs/nurbis-dungeons/src/katalog2-collection.js
var rooms = [];
var solutions = [];
var introductions = [];
{
  const level5 = { "difficulty": "mittel", "title": "Ein Ziel muss warten", "desc": "Drei Steine teilen sich die Zug\xE4nge zu ihren Zielpl\xE4tzen. Nicht jeder fr\xFCh erreichbare Platz sollte schon belegt bleiben.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Ein fertiger Zielplatz kann sp\xE4ter noch als Arbeitsfl\xE4che gebraucht werden.", "wall": 2, "floor": 1, "seed": 310010, "collection": true, "sunken": true, "rescue": true, "friend": [3, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #..#..### ", " #S.....## ", " #.#.#.S## ", " #.F.#.S## ", " #.#....## ", " #......GO ", " ######### ", "           "] };
  rooms.push({ id: "katalog2-mediumA", level: level5, ...createRescueRules(level5, { "p": [2, 3], "boxes": [[2, 4], [4, 4], [4, 6]] }) });
  solutions.push("DDRRUDLLUURRRURDDDRDDLLURDRUUDDLLLUUUDLLUURRDDDDLLUUUDRRUURURDDDRDDLLURDRULLLULRDRRRDRR");
  introductions.push("Mittel: Drei Steine teilen sich die Zug\xE4nge zu ihren Zielpl\xE4tzen. Nicht jeder fr\xFCh erreichbare Platz sollte schon belegt bleiben.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Die andere Seite", "desc": "Drei Steine stehen zwischen Nurbi und den n\xF6tigen Standfl\xE4chen. Plane den n\xE4chsten Seitenwechsel, bevor du den Durchgang zustellst.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "\xDCberlege bei jedem Schieben, wie du danach hinter den n\xE4chsten Stein gelangst.", "wall": 2, "floor": 1, "seed": 310207, "collection": true, "sunken": true, "rescue": true, "friend": [5, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ##..#..## ", " #...#..## ", " #.....S## ", " #.##F..## ", " ##.....## ", " ##.S.S.GO ", " ######### ", "           "] };
  rooms.push({ id: "katalog2-mediumB", level: level5, ...createRescueRules(level5, { "p": [3, 4], "boxes": [[4, 4], [6, 6], [7, 3]] }) });
  solutions.push("RRDRRULLLRRDDRDLLUUURUURDDLLLULLDRRRDRURUULDDDDRULLRRDDRR");
  introductions.push("Mittel: Drei Steine stehen zwischen Nurbi und den n\xF6tigen Standfl\xE4chen. Plane den n\xE4chsten Seitenwechsel, bevor du den Durchgang zustellst.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Vier Wege, wenig Platz", "desc": "Vier Steine teilen sich einen engen Arbeitsraum. Finde Zwischenpl\xE4tze, die den weiteren Transport nicht behindern.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Plane zun\xE4chst die Standfl\xE4chen, nicht nur die Zielpl\xE4tze.", "wall": 2, "floor": 1, "seed": 310404, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [10, 5], "outside": [11, 5], "map": ["           ", " ######### ", " #S..#...# ", " #.......# ", " #..F##### ", " #S.##...GO", " #......## ", " #..#S.S.# ", " ######### ", "           "] };
  rooms.push({ id: "katalog2-hard1", level: level5, ...createRescueRules(level5, { "p": [6, 6], "boxes": [[3, 5], [2, 4], [5, 6], [3, 3]] }) });
  solutions.push("LLLULUURRLLDDRUDDDLUURURUULDDDLDRRRDRRUULDRDLULLLUUURRRURRDLLLLULDDDLDRUUULDRDDRRRURDLLLLUURLDDRRRURRRR");
  introductions.push("Anspruchsvoll: Vier Steine teilen sich einen engen Arbeitsraum. Finde Zwischenpl\xE4tze, die den weiteren Transport nicht behindern.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Noch nicht am Ziel", "desc": "Vier Steine m\xFCssen aneinander vorbei. Ein belegtes Ziel ist nicht automatisch ein endg\xFCltiger Parkplatz.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Pr\xFCfe, welche Wege durch einen fr\xFCh abgestellten Stein verschwinden.", "wall": 2, "floor": 1, "seed": 310601, "collection": true, "sunken": true, "rescue": true, "friend": [4, 5], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " ##..S.S.# ", " #..##...# ", " #...S..## ", " #S#F....# ", " #..###..GO", " #......## ", " ######### ", "           "] };
  rooms.push({ id: "katalog2-hard2", level: level5, ...createRescueRules(level5, { "p": [7, 3], "boxes": [[6, 5], [6, 4], [4, 2], [7, 4]] }) });
  solutions.push("DDLULLLUURRRDRDLUULLLDDLDDRDRRRRUULUURRULLDDDRDDLLLLULUURRDRLULLDDRDRRRRUUUDDDLLLLULUURRDRRUUURRDLDLDLLULLDDRDRRRRUULULLRRDRDDLLLLULUUURURRRDRDLUULLLDLDDDRDRRRRUULLLULULDURURRRDRRULLDDDRUUDDLLLRRRRDRR");
  introductions.push("Anspruchsvoll: Vier Steine m\xFCssen aneinander vorbei. Ein belegtes Ziel ist nicht automatisch ein endg\xFCltiger Parkplatz.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Erst hin, dann zur\xFCck", "desc": "Die Wippe wechselt zwei Durchg\xE4nge. Steintransport und die erreichbare Eintrittsseite m\xFCssen zusammenpassen.", "tags": ["Anspruchsvoll", "Wechselgitter"], "hint": "Nach dem Umschalten brauchst du auch wieder Zugang zum tiefen Ende.", "wall": 2, "floor": 1, "seed": 310798, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[7, 2], [2, 2], [2, 6]], [[7, 2], [6, 2], [6, 4]]], "friend": [4, 5], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #..#..A.# ", " #S.....S# ", " #.#..E#.# ", " #.#FS.### ", " #G......# ", " #S.##...DO", " ######### ", "           "] };
  rooms.push({ id: "katalog2-switch", level: level5, ...createSwitchRescueRules(level5, { "p": [8, 6], "boxes": [[3, 6], [3, 3], [5, 6], [7, 6]] }) });
  solutions.push("DLLUUUULLLULDDURRRRDDDDRRULDLUULLDRRUUDDDRRULDLULUUUURRRDLLULDLLLDDDRRRRLULUURDURRRULLDDLLDDRRUUDDDRRULDLULLUUURURRRDLLLLLRRRRRULLDDLLDDRRUULURRLDLLDDRRRRDRR");
  introductions.push("Anspruchsvoll: Die Wippe wechselt zwei Durchg\xE4nge. Steintransport und die erreichbare Eintrittsseite m\xFCssen zusammenpassen.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Bevor der Boden fehlt", "desc": "Eine Standfl\xE4che tr\xE4gt Nurbi nur einmal. Bereite die Steinwege vor, die nach dem Einsturz nicht mehr erreichbar w\xE4ren.", "tags": ["Anspruchsvoll", "Bruchboden"], "hint": "Welche Arbeit muss auf der anderen Seite erledigt sein, bevor die Bretter brechen?", "wall": 2, "floor": 1, "seed": 310995, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [4, 5], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #.S#...S# ", " #.......# ", " #S.#T...# ", " #..F##.## ", " #....S..# ", " #.#..#..GO", " ######### ", "           "] };
  rooms.push({ id: "katalog2-boards", level: level5, ...createFractureRescueRules(level5, { "p": [3, 3], "boxes": [[7, 3], [7, 5], [4, 3], [6, 2]] }) });
  solutions.push("RRURRDRDLUULLDLLDDRDRRRUDLLLULUURRURRDLLLLDDRDRRRUURULLLRRDDDLLLULUUULDDRDRDRRRUUULLLRRRDDDLLLULULUURDDURRRRDDDLLLLLUDRRRRRUUULLLLDDUURRDRULLLDDRDRRRUURULLLLRRRDDDLLLULUUDDLDRRRLULUURRRRDDDRDRR");
  introductions.push("Anspruchsvoll: Eine Standfl\xE4che tr\xE4gt Nurbi nur einmal. Bereite die Steinwege vor, die nach dem Einsturz nicht mehr erreichbar w\xE4ren.");
}

// outputs/nurbis-dungeons/src/sammlung-collection.js
var rooms2 = [];
var solutions2 = [];
var introductions2 = [];
{
  const level5 = { "difficulty": "leicht", "title": "Eine Handbreit Platz", "desc": "Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 298800, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [8, 3], "outside": [9, 3], "map": ["           ", " ######### ", " ##....### ", " #.....GO  ", " #.S.##### ", " #F.S..### ", " #..#..### ", " ######### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-1", level: level5, ...createRescueRules(level5, { "p": [6, 5], "boxes": [[4, 4], [5, 5]] }) });
  solutions2.push("LLULUURDDLLDDRULUURRRRRR");
  introductions2.push("Leicht: Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.");
}
{
  const level5 = { "difficulty": "leicht", "title": "Zwei kleine Umwege", "desc": "Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 298973, "collection": true, "sunken": true, "rescue": true, "friend": [5, 5], "exit": [8, 5], "outside": [9, 5], "map": ["           ", " ######### ", " ##S..#### ", " #.....### ", " #.....### ", " ###.F.GO  ", " ##...S### ", " ######### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-2", level: level5, ...createRescueRules(level5, { "p": [2, 4], "boxes": [[4, 5], [3, 4]] }) });
  solutions2.push("URRRDDDLUUURULDLLDRRRURDDLRRR");
  introductions2.push("Leicht: Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.");
}
{
  const level5 = { "difficulty": "leicht", "title": "Der freie Stellplatz", "desc": "Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 299146, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #..###### ", " #.#...### ", " #.....### ", " #F#.#.### ", " #SS...GO  ", " ######### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-3", level: level5, ...createRescueRules(level5, { "p": [4, 3], "boxes": [[4, 4], [3, 4]] }) });
  solutions2.push("DRRDDLLLLUURRDUURRDDDLLLRRRUULULDDURRDDLLUULLDURRRRDDRR");
  introductions2.push("Leicht: Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.");
}
{
  const level5 = { "difficulty": "leicht", "title": "Kurze Wege", "desc": "Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 299319, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [8, 3], "outside": [9, 3], "map": ["           ", " ######### ", " #.....### ", " #.S.S.GO  ", " ###F.#### ", " #....#### ", " #....#### ", " ######### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-4", level: level5, ...createRescueRules(level5, { "p": [5, 5], "boxes": [[3, 5], [5, 4]] }) });
  solutions2.push("DLLLURDRRUUDDLLURDRULUUURRDLLDDRULUURRDRR");
  introductions2.push("Leicht: Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.");
}
{
  const level5 = { "difficulty": "leicht", "title": "Die kleine Kammer", "desc": "Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 299492, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #....S### ", " #...#.### ", " #..F.#### ", " #..#..### ", " #S..#.GO  ", " ######### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-5", level: level5, ...createRescueRules(level5, { "p": [6, 2], "boxes": [[5, 2], [3, 5]] }) });
  solutions2.push("LLDLLURRRLDDLLDDRULUURRDLULDDURRRDRDRR");
  introductions2.push("Leicht: Zwei Steine brauchen freie Standfl\xE4chen. \xD6ffne den gemeinsamen Weg f\xFCr Nurbi und seinen Freund.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Drei Steine, ein Plan", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 299665, "collection": true, "sunken": true, "rescue": true, "friend": [2, 4], "exit": [9, 6], "outside": [10, 6], "map": ["           ", " ######### ", " #...S#.## ", " #S..#..## ", " #F..#..## ", " ##.....## ", " #...#..GO ", " #..S.#### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-6", level: level5, ...createRescueRules(level5, { "p": [7, 5], "boxes": [[6, 5], [6, 4], [3, 3]] }) });
  solutions2.push("LLLDLURUUULLDDRDRUUDLLUURRDDDRRRUULDRDLLLULDRDDLLURURDUUULDLRRDRRRDRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Verteilte Pl\xE4tze", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 299838, "collection": true, "sunken": true, "rescue": true, "friend": [4, 3], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #.#.S#S## ", " #..F...## ", " ##.#...## ", " ##.....## ", " #...#..## ", " #....S.GO ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-7", level: level5, ...createRescueRules(level5, { "p": [5, 7], "boxes": [[3, 5], [4, 7], [4, 5]] }) });
  solutions2.push("LULUDLDRRRLULURRUULLDDRDDLLURDRULURLUURRRRDDDLURUULLLLDDRRRDRUUUDDLURULDLULRRRDDDDRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Platz zum Ausweichen", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300011, "collection": true, "sunken": true, "rescue": true, "friend": [4, 3], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ##.SS..## ", " #..F...## ", " ##.#.#.## ", " #..#..S## ", " #....#.## ", " #......GO ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-8", level: level5, ...createRescueRules(level5, { "p": [3, 4], "boxes": [[3, 5], [3, 3], [5, 6]] }) });
  solutions2.push("DLDRDRRRRUUUUULLLLDDURRRRDDDDLLUUDDLLURDRRRUUUULLLLDDLDRDRRRRUULLUDRRDDLLUUDDLLURLUUURRURRDDDLLUUDDRRUUULLRRDDDDDLLUUUURURDDULLLRDDDDRRRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Der gemeinsame Gang", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300184, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [9, 5], "outside": [10, 5], "map": ["           ", " ######### ", " #...#..## ", " #.##...## ", " #S.F#..## ", " #.S....GO ", " #...#.### ", " #....S.## ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-9", level: level5, ...createRescueRules(level5, { "p": [6, 7], "boxes": [[6, 6], [6, 3], [5, 7]] }) });
  solutions2.push("LLUURRURUULDDRDLLLDDRRUURUULDRDLLRDDLLULUDRDRRUULLULRDDLLDRRRLUUUDRRRRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Eine Frage der Reihenfolge", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300357, "collection": true, "sunken": true, "rescue": true, "friend": [3, 4], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ##SS...## ", " #..#...## ", " ##F..#.## ", " #.#....## ", " #...#..## ", " #..S...GO ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-10", level: level5, ...createRescueRules(level5, { "p": [2, 7], "boxes": [[4, 6], [3, 7], [5, 3]] }) });
  solutions2.push("RRUURRDDLLUURRRUUULLDDUULLDDRDDDRRUULUUDLLUURRDDDRDDLLULLDRURURUUULLDDRDRRRUUULLLRRRDDDLLUURULDDLLRRDRRDDRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Noch ein Umweg", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300530, "collection": true, "sunken": true, "rescue": true, "friend": [6, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #..#...## ", " #S.....## ", " #.S.##S## ", " ###..F### ", " ##.....## ", " ##.....GO ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-11", level: level5, ...createRescueRules(level5, { "p": [4, 3], "boxes": [[6, 6], [3, 3], [4, 4]] }) });
  solutions2.push("DLLURRRRURDLLLDDRDDRRULDLUDLUUULURRURRDLLLDDDRRULDLUULLUURDRRURRDLLLLRDDRRDRDRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Die freie Seite", "desc": "Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300703, "collection": true, "sunken": true, "rescue": true, "friend": [4, 7], "exit": [9, 3], "outside": [10, 3], "map": ["           ", " ######### ", " #......## ", " ##.#...GO ", " #....SS## ", " ##..#..## ", " #..S...## ", " #..F#.### ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-12", level: level5, ...createRescueRules(level5, { "p": [7, 6], "boxes": [[3, 6], [3, 4], [6, 6]] }) });
  solutions2.push("UULLLDDDLLURDRUULURRRUULLLDDDRDDLLURDRUULURLUURRRDDDRDLLRUUUULLLDDRRLDLDDRLUUURRURRRR");
  introductions2.push("Mittel: Drei Steine teilen sich den Raum. Plane Zwischenpl\xE4tze und die Reihenfolge bis zum freien Ausgang.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Druck auf beiden Seiten", "desc": "Vier Steine und wechselnde Durchg\xE4nge. Behalte beide Seiten der Wippe im Blick.", "tags": ["Anspruchsvoll", "Wippe"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 300876, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[4, 2], [2, 2], [2, 5]], [[4, 2], [5, 2], [5, 6]]], "friend": [5, 3], "exit": [0, 7], "outside": [-1, 7], "map": ["           ", " ######### ", " #..A.#..# ", " #S..F#.S# ", " ##..#.#.# ", " #G..S...# ", " #S..E#..# ", "OD..#.#..# ", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-13", level: level5, ...createSwitchRescueRules(level5, { "p": [7, 5], "boxes": [[7, 6], [4, 6], [6, 5], [4, 4]] }) });
  solutions2.push("LLLULDUUURRDLDDLLDDRUURUULRDDLURDRRRRDDLURULLLLULDLDDRULURRRRRDRUUDLLLLUURULLDRDDRDLUUULURRDLDDLLDDRULURRUULDDRDLUUURRLDDDLDLLL");
  introductions2.push("Anspruchsvoll: Vier Steine und wechselnde Durchg\xE4nge. Behalte beide Seiten der Wippe im Blick.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Die letzte feste Stelle", "desc": "Vier Steine und eine verg\xE4ngliche Standfl\xE4che. Bereite die Wege vor, bevor die Bretter nachgeben.", "tags": ["Anspruchsvoll", "Bruchboden"], "hint": "Halte die n\xF6tigen Standfl\xE4chen frei. Ein fr\xFCh belegtes Ziel kann sp\xE4ter noch im Weg sein.", "wall": 2, "floor": 1, "seed": 301049, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [4, 5], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #.S.....# ", " #....S.## ", " ##.#.T.## ", " ##.F.#..# ", " #..#....# ", " #SS..#..GO", " ######### ", "           "] };
  rooms2.push({ id: "sammlung-14", level: level5, ...createFractureRescueRules(level5, { "p": [5, 7], "boxes": [[6, 6], [4, 2], [7, 4], [5, 6]] }) });
  solutions2.push("LLUUUURRULRRRDDDUULLDDLLDDRRUUUDLLUURURRDLDDLLUULURRLDDDRRUULULDDDDURRDDLLUUUURRRRDDRDDLULRUULULDDLLDDRRUULLUURRRURDDDRDLLRUUULLLLDDRRUDLLDDRRURRUUULLLULDDDDUUURRRULLRRRDDDDLLUUDLLUURRDDLRDRRRDRR");
  introductions2.push("Anspruchsvoll: Vier Steine und eine verg\xE4ngliche Standfl\xE4che. Bereite die Wege vor, bevor die Bretter nachgeben.");
}

// outputs/nurbis-dungeons/src/interlock-collection.js
var level = { "title": "Verzahnte Wege", "desc": "Vier Druckplatten halten den Ausgang offen. Erreiche den verirrten Gartenfreund und finde f\xFCr euch beide einen freien Weg hinaus.", "tags": ["Vier Steine", "Engstellen", "Rettungsweg"], "hint": "Die Schalter sind sichtbar. Entscheidend ist, welche Seite jedes Steins du sp\xE4ter noch erreichen kannst.", "wall": 2, "floor": 1, "seed": 28264, "collection": true, "sunken": true, "rescue": true, "friend": [1, 2], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " F.......# ", " #....S### ", " #..#....# ", " ##...#..# ", " #.#...S.# ", " #S..S#..GO", " ######### ", "           "] };
var rooms3 = [{ id: "verzahnte-wege", level, ...createRescueRules(level, { "p": [5, 7], "boxes": [[4, 3], [6, 4], [4, 5], [5, 6]] }) }];

// outputs/nurbis-dungeons/src/counterflow-collection.js
var level2 = { "title": "Gegenl\xE4ufig", "desc": "Vier Steine halten den Ausgang offen. Die Bodenwippe \xF6ffnet abwechselnd zwei innere Durchg\xE4nge. Finde den Freund und bereite euren freien Weg nach drau\xDFen vor.", "tags": ["Vier Steine", "Richtungswippe", "Wechselgitter"], "hint": "Ein offener Durchgang allein hilft nicht. \xDCberlege vor jedem Umschalten, welche Steine bereits auf der anderen Seite stehen m\xFCssen \u2013 und wie du wieder zum tiefen Ende der Wippe kommst.", "wall": 2, "floor": 1, "seed": 284257, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "friend": [2, 2], "exit": [10, 4], "outside": [11, 4], "connections": [[[3, 4], [4, 4], [5, 4], [6, 4], [7, 4]], [[3, 4], [4, 4], [4, 5]]], "map": ["           ", " ######### ", " #F..#.SS# ", " #.......# ", " #.A..#G.DO", " #..E#S.S# ", " ###.....# ", " #....#### ", " ######### ", "           "] };
var rooms4 = [{ id: "gegenlaeufig", level: level2, ...createSwitchRescueRules(level2, { "p": [7, 3], "boxes": [[7, 6], [4, 4], [5, 6], [6, 3]] }) }];

// outputs/nurbis-dungeons/src/fracture-collection.js
var level3 = { "title": "Nur einmal hin\xFCber", "desc": "Vier Steine \xF6ffnen den Ausgang. Die morschen Bretter tragen Nurbi noch einmal und brechen beim Verlassen ein. Bereite die Steinpl\xE4tze vor und rette den Gartenfreund \xFCber festen Boden.", "tags": ["Vier Steine", "Morsche Bretter", "Verlorene Standfl\xE4che"], "hint": "Nicht nur der Transportweg z\xE4hlt. Nach dem Einsturz kannst du auf diesem Feld auch nicht mehr stehen, um einen benachbarten Stein zu schieben.", "wall": 2, "floor": 1, "seed": 785643, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [2, 4], "exit": [10, 5], "outside": [11, 5], "map": ["           ", " ######### ", " #...#TS.# ", " ##..#..## ", " #F....S.# ", " #..S#...GO", " #S#.##..# ", " #.#.#...# ", " ######### ", "           "] };
var rooms5 = [{ id: "nur-einmal-hinueber", level: level3, ...createFractureRescueRules(level3, { "p": [7, 2], "boxes": [[4, 4], [7, 3], [3, 3], [6, 4]] }) }];

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
    let crossed = false;
    if (tile(s.p) === "A") {
      const entry = s.rockerEntry ?? (s.off ? -1 : 1);
      if (d[1] !== 0) return { reason: "Die Seitenfassung der Wippe ist geschlossen. Gehe vor oder zur\xFCck." };
      if (d[0] === entry) {
        const n2 = structuredClone(s);
        n2.off = !n2.off;
        if (blocked(n2, p) || tile(p) === "A" || s.boxes.some((b) => eq(b, p))) return { reason: "Das andere Ende ist versperrt. Du kannst auf der Wippe zur\xFCckgehen, ohne umzuschalten." };
        n2.toggles++;
        delete n2.rockerEntry;
        s = n2;
        crossed = true;
      } else if (d[0] === -entry) {
        if (blocked(s, p) || s.boxes.some((b) => eq(b, p))) return { reason: "Der R\xFCckweg ist versperrt." };
        const n2 = structuredClone(s);
        delete n2.rockerEntry;
        n2.p = p;
        n2.moves++;
        return { state: n2, reason: "Zur\xFCck vom tiefen Ende. Die Wippe bleibt unver\xE4ndert." };
      }
    }
    if (c === "A") {
      if (d[1] !== 0 || d[0] !== (s.off ? -1 : 1)) return { reason: "Die Wippe ist nur vom abgesenkten Ende betretbar. Die Seitenfassung bleibt geschlossen." };
      const n2 = structuredClone(s);
      n2.rockerEntry = d[0];
      n2.p = p;
      n2.moves++;
      return { state: n2, reason: "Nurbi steht auf dem tiefen Ende. Weitergehen kippt die Wippe; zur\xFCckgehen schaltet nichts." };
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
    return { state: n, reason: crossed ? "Vollst\xE4ndig \xFCberquert: Die Wippe kippt und schaltet um." : c === "F" ? "Der Freund ist gefunden. Bereite den freien Weg zum Ausgang vor." : ready(n) ? "Das Ausgangsgitter ist offen. Pr\xFCfe auch den trockenen Weg durch die Becken." : "Plane die Steinpl\xE4tze, das trockene Becken und die erreichbare Seite der Wippe." };
  } };
}

// outputs/nurbis-dungeons/src/basin-room-collection.js
var level4 = { "title": "Wechselnde Ufer", "desc": "Vier Steine \xF6ffnen den Ausgang. Die Wippe verlagert das Wasser zwischen zwei Becken. Nutze das trockene Becken zum Rangieren und bereite f\xFCr den Freund einen begehbaren Fluchtweg vor.", "tags": ["Vier Steine", "Wasserwechsel", "Zwei Becken"], "hint": "Ein Stein kann im Becken auf seinen n\xE4chsten Einsatz warten. Nach dem Fluten erreichst du ihn erst wieder, wenn dieses Becken trocken liegt.", "wall": 2, "floor": 1, "seed": 282889, "collection": true, "sunken": true, "rescue": true, "water": true, "waterRescue": true, "lever": true, "basinMount": "flush", "liquidType": "water", "friend": [1, 8], "exit": [11, 7], "outside": [12, 7], "connections": [[[2, 5], [4, 5], [4, 3]], [[2, 5], [4, 5], [4, 6]]], "map": ["            ", "########### ", "#S.####.#S# ", "#...UUU.S.# ", "#..####...# ", "#.A.#####.# ", "#...WWW...# ", "#..S###...GO", "#F..###...# ", "########### ", "            "] };
var rooms6 = [{ id: "wechselnde-ufer", level: level4, ...createWaterRescueRules(level4, { "p": [1, 5], "boxes": [[4, 6], [8, 7], [8, 6], [2, 3]] }) }];

// outputs/nurbis-dungeons/src/interlock-solution.js
var solution = "UUURUULLLDDDRLUUURRRDDLDURUULDLULLDDRDRRURUULLLDURRRDLLRDDLDDRURRURULDDLLUUDDRRUULUULLDRDDURRDDLLULDRDLLRUURUUULLLDRRURDDRRDDLLLULULURRLDDRDRRRUULLDLLUUURRDDULLDDRDRLULUURRDDDRLUUUULLLLRRRRDDRRRDDDRR";

// outputs/nurbis-dungeons/src/counterflow-solution.js
var solution2 = "RDDLLDLRURRUULLLLULLDRRRLLLDDRRURULRRURRDDDLLDLDLUUDRRURRDLLLRURRUUULLDLLULLDDDRRUDLLURRRURURDDRDLUULLDLLLUURRDULLDRRRRLLLLDDRRURURURRDDDDLLLDLUUDRRRURUUULLDRURDDULLLLULLDRRRLLLDDRRURULRRLDLDLLURRURRURRDDLULLLULLDRRRRRDRULLLLULLRRDRRRRDRR";

// outputs/nurbis-dungeons/src/fracture-solution.js
var solution3 = "DDDLULLDLLURRRRLLUULDDRRRDRRULLLLRRRRDDDLURUULLLLDLULDURRRRRUULDRDRDDLUUUDLLLDLLURRUULDRDDLLURURDRRLLLLRRRRDRRRR";

// outputs/nurbis-dungeons/src/basin-room-solution.js
var solution4 = "DRRRRLLLLUUURDLDRRDLLUUURRRRRRDRRDDDDLLUURLDDRRUUUUUDLLULLLLLDLDDRRULLDRRRRRRDDRRUULLLLLLLDLUUUUDDDRRRRRRDDRURULLLLLLDLLURLURRDLDDLUUUUURRRRRRDRRDDDRR";

// outputs/nurbis-dungeons/src/expansion-collection.js
var rooms7 = [];
var solutions3 = [];
var introductions3 = [];
{
  const level5 = { "title": "Der geliehene Stellplatz", "desc": "Vier Steine brauchen dieselben schmalen Arbeitswege. Belege die Druckplatten so, dass auch der Gartenfreund zum Ausgang gelangt.", "tags": ["Rangierfl\xE4che", "Vier Steine"], "hint": "Auch ein bereits belegtes Ziel kann vor\xFCbergehend als Arbeitsfl\xE4che gebraucht werden.", "wall": 2, "floor": 1, "seed": 298800, "collection": true, "sunken": true, "rescue": true, "friend": [3, 5], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " #...#...# ", " #.......# ", " ###.##.## ", " #.F.#S.S# ", " ##..S...GO", " #S.....## ", " ######### ", "           "] };
  rooms7.push({ id: "geliehener-stellplatz", level: level5, ...createRescueRules(level5, { "p": [6, 5], "boxes": [[7, 6], [7, 4], [5, 3], [7, 5]] }) });
  solutions3.push("DLLUUURRURRDLLLLULLDRURDDDLDRDRRUURUDLDDRUUDDLLLUUUURRURRDLLLLDDDDRRUURUDDDLLLUUUURRURRDLLRDDDDLLLUUUUULLDRURDDDLDDRRRUURUULLLULLDRURDRRRDDDDLLLLUURDRDRRUUUULLLDDLDRUUURRRDDDDLLLLRRRUDLLUULRDDRRURRRR");
  introductions3.push("Vier Steine brauchen dieselben schmalen Arbeitswege. Belege die Druckplatten so, dass auch der Gartenfreund zum Ausgang gelangt.");
}
{
  const level5 = { "title": "Die letzte Schalterseite", "desc": "Die Wippe wechselt zwei Durchg\xE4nge. Behalte Zugang zu ihrem tiefen Ende, w\xE4hrend du die Steine an ihre Pl\xE4tze bringst.", "tags": ["Schalterseiten", "Wechselgitter"], "hint": "\xDCberlege vor dem endg\xFCltigen Abstellen jedes Steins, von wo du die Wippe noch erreichen und \xFCberqueren kannst.", "wall": 2, "floor": 1, "seed": 298973, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[7, 7], [2, 7], [2, 3]], [[7, 7], [7, 4]]], "friend": [3, 5], "exit": [10, 5], "outside": [11, 5], "map": ["           ", " ######### ", " #.S...### ", " #G......# ", " ###..#E## ", " #.F.....DO", " ##..#.SS# ", " #..#..AS# ", " ######### ", "           "] };
  rooms7.push({ id: "letzte-schalterseite", level: level5, ...createSwitchRescueRules(level5, { "p": [4, 6], "boxes": [[4, 2], [5, 4], [6, 5], [4, 5]] }) });
  solutions3.push("URUDRDRRULUULULLDRDDRDDRRULLULUULLLURRDRDDRDRRULRDDLLURUUULLLRDDRLUURRDDLDDRRUULLLUULULLDRRRDDRRRDDLLUURUULULDLLURDRRRDDLLLUDRRRUULLLDDRRDDRRUULLLLUUULLDRRRLDDRRRRDDLLURURDULLLLUURDLDRRDRRULUULULLDDRDRLULUURRDRDDLDRUUULULDDLDRRLUURRDDLLLLRRRRRRR");
  introductions3.push("Die Wippe wechselt zwei Durchg\xE4nge. Behalte Zugang zu ihrem tiefen Ende, w\xE4hrend du die Steine an ihre Pl\xE4tze bringst.");
}
{
  const level5 = { "title": "Vor dem letzten Schritt", "desc": "Ein morsches Feld tr\xE4gt Nurbi nur einmal. Bereite die oberen Steinpl\xE4tze vor und finde danach den sicheren gemeinsamen Weg hinaus.", "tags": ["Vorbereiten", "Morsche Bretter"], "hint": "Was du nach dem Einbrechen noch verschieben musst, braucht erreichbare Standfl\xE4chen auf festem Boden.", "wall": 2, "floor": 1, "seed": 299146, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [2, 5], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #..#TSSS# ", " #....#..# ", " #...#..S# ", " #F#.#...# ", " #.......# ", " ##..#...GO", " ######### ", "           "] };
  rooms7.push({ id: "vor-dem-letzten-schritt", level: level5, ...createFractureRescueRules(level5, { "p": [7, 6], "boxes": [[4, 3], [6, 6], [3, 3], [6, 5]] }) });
  solutions3.push("LLLUULLDDRRRRDRUUUDDLLLUULLUURDLDRLDDRRRRRUULDURRUULLLDLDLLUURDLDDDRRRRUURURULRDDDDDLULLLLLUUURRDDUULLDRURDLLDDRRRRRLLLLLUURRDULLDDRRRRDRRUUDDLLURURUDLDDRULUURUDLDDRULUUDDDLLLLLUDRRRRRRDRR");
  introductions3.push("Ein morsches Feld tr\xE4gt Nurbi nur einmal. Bereite die oberen Steinpl\xE4tze vor und finde danach den sicheren gemeinsamen Weg hinaus.");
}

// outputs/nurbis-dungeons/src/comparison-collection.js
var rooms8 = [];
var solutions4 = [];
var introductions4 = [];
{
  const level5 = { "difficulty": "leicht", "title": "Ein Platz auf Zeit", "desc": "Zwei Steine teilen sich einen kleinen Raum. Finde den Freund und halte beide Druckplatten f\xFCr den Ausgang belegt.", "tags": ["Leicht \xB7 Vergleichsreihe", "Zwei Steine"], "hint": "Ein Stein am Ziel kann noch im Weg sein. Behalte die Standfl\xE4che f\xFCr den anderen im Blick.", "wall": 2, "floor": 1, "seed": 298800, "collection": true, "sunken": true, "rescue": true, "friend": [4, 6], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " ##...#### ", " ##..#.### ", " #.S...### ", " ##...S### ", " #..F..GO  ", " ######### ", " ######### ", "           "] };
  rooms8.push({ id: "vergleich-ein-platz-auf-zeit", level: level5, ...createRescueRules(level5, { "p": [3, 2], "boxes": [[3, 3], [5, 4]] }) });
  solutions4.push("DDRDRRULDLULUURDDRDDLLURRDLRRRR");
  introductions4.push("Leicht \xB7 Vergleichsreihe: Zwei Steine teilen sich einen kleinen Raum. Finde den Freund und halte beide Druckplatten f\xFCr den Ausgang belegt.");
}
{
  const level5 = { "difficulty": "mittel", "title": "Die schmale Runde", "desc": "Drei Steine m\xFCssen durch schmale Verbindungen. Bereite ihre Reihenfolge vor und \xF6ffne den gemeinsamen Ausgang.", "tags": ["Mittel \xB7 Vergleichsreihe", "Drei Steine"], "hint": "Plane, von welcher Seite du jeden Stein als N\xE4chstes schieben musst.", "wall": 2, "floor": 1, "seed": 298973, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ##..##.## ", " #....SS## ", " ##.F#..## ", " #..#...## ", " #.....S## ", " #...#..GO ", " ######### ", "           "] };
  rooms8.push({ id: "vergleich-die-schmale-runde", level: level5, ...createRescueRules(level5, { "p": [5, 3], "boxes": [[3, 5], [4, 6], [4, 3]] }) });
  solutions4.push("RDDDLLDLLURRRURRDDLUURUULLLDLDLDRRRURRDDLULURDRUUDLUDDLLLUURUULDDDLDRRRRLLLUURLDDRRRDRRR");
  introductions4.push("Mittel \xB7 Vergleichsreihe: Drei Steine m\xFCssen durch schmale Verbindungen. Bereite ihre Reihenfolge vor und \xF6ffne den gemeinsamen Ausgang.");
}
{
  const level5 = { "difficulty": "anspruchsvoll", "title": "Erst Platz schaffen", "desc": "Vier Steine teilen sich wenige Arbeitsfl\xE4chen. Plane Zwischenpl\xE4tze und Seitenwechsel, bevor du die Ziele endg\xFCltig belegst.", "tags": ["Anspruchsvoll \xB7 Vergleichsreihe", "Vier Steine"], "hint": "Der k\xFCrzeste Weg zum Ziel l\xE4sst nicht unbedingt genug Platz f\xFCr die anderen Steine.", "wall": 2, "floor": 1, "seed": 299146, "collection": true, "sunken": true, "rescue": true, "friend": [4, 6], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #.#.SS.## ", " #...#...# ", " #.......# ", " #..###.## ", " ##.F..S.# ", " #S......GO", " ######### ", "           "] };
  rooms8.push({ id: "vergleich-erst-platz-schaffen", level: level5, ...createRescueRules(level5, { "p": [5, 4], "boxes": [[7, 7], [3, 5], [6, 4], [3, 4]] }) });
  solutions4.push("LUURRRDDDDRDLLLLLURRRRUUUULLLDDRRLLULLDRDUURURRDDLLRRURRDLUULLLDLLDDRURUURRRDDDDDLLLLUULUURLDDRURRRLLLDDRRRRUURULULLLDURRRDDDDLLLLUURRRLLUURRRDDLLLLLURDRRRRUULLLDLDRRLUURRRDDDUUULLLDDRRURULDDLLLDDRRRDRRULUURULDLURDDDDLLURLLRRDRRRR");
  introductions4.push("Anspruchsvoll \xB7 Vergleichsreihe: Vier Steine teilen sich wenige Arbeitsfl\xE4chen. Plane Zwischenpl\xE4tze und Seitenwechsel, bevor du die Ziele endg\xFCltig belegst.");
}

// outputs/nurbis-dungeons/src/round-data.js
var rooms9 = [rooms3[0], rooms4[0], rooms5[0], rooms6[0], ...rooms7, ...rooms8, ...rooms2, ...rooms];
var solutions5 = [solution, solution2, solution3, solution4, ...solutions3, ...solutions4, ...solutions2, ...solutions];
var introductions5 = [
  "Vier Steine teilen sich enge Wege. Erreiche den Gartenfreund und \xF6ffne euren Ausgang.",
  "Die Wippe \xF6ffnet zwei Durchg\xE4nge abwechselnd. Plane Steintransport und Schalterseite zusammen.",
  "Die Bretter tragen Nurbi einmal. Beim Verlassen bricht die ben\xF6tigte Standfl\xE4che weg.",
  "Leere Becken sind nutzbare Wege. Die Wippe tauscht das Wasser zwischen ihnen.",
  ...introductions3,
  ...introductions4,
  ...introductions2,
  ...introductions
];

// outputs/nurbis-dungeons/src/lernpfad-collection.js
var rooms10 = [];
var solutions6 = [];
var introductions6 = [];
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Ein freier Weg", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 320010, "collection": true, "sunken": true, "rescue": true, "friend": [6, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.....### ", " #...S#### ", " #..#..### ", " #..#.F### ", " #.#S..GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy0", level: level5, ...createRescueRules(level5, { "p": [5, 3], "boxes": [[5, 6], [5, 4]] }) });
  solutions6.push("DRDDLUURDDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Zwei kleine Aufgaben", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 320221, "collection": true, "sunken": true, "rescue": true, "friend": [5, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.#...### ", " #..#.S### ", " #..S..### ", " #.##F.### ", " #.#...GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy1", level: level5, ...createRescueRules(level5, { "p": [6, 3], "boxes": [[5, 3], [6, 4]] }) });
  solutions6.push("ULDRDLDDRUUDLRDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Platz zum Gehen", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 320432, "collection": true, "sunken": true, "rescue": true, "friend": [5, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.#...### ", " #.#...### ", " #S#.#.### ", " #...FS### ", " #..#..GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy2", level: level5, ...createRescueRules(level5, { "p": [4, 3], "boxes": [[4, 4], [5, 3]] }) });
  solutions6.push("DUURRDDDLLLDLURRUURURDDULLDDRDRRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Die passende Seite", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 320643, "collection": true, "sunken": true, "rescue": true, "friend": [3, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #..#..### ", " ##....### ", " #S#...### ", " #.F.#.### ", " #...S.GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy3", level: level5, ...createRescueRules(level5, { "p": [3, 3], "boxes": [[4, 3], [2, 5]] }) });
  solutions6.push("RDRRUULDRDLULDDLDRLLURRURRDDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Nicht bis zur Wand", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 320854, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.S...### ", " #..S#.### ", " #.....### ", " #F....### ", " ##.#..GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy4", level: level5, ...createRescueRules(level5, { "p": [4, 5], "boxes": [[3, 5], [4, 4]] }) });
  solutions6.push("RURUULLDLDLDRRLUUURRRDDDDLULUDRRULLDLUUDDLRRRRDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Ein Schritt zur\xFCck", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 321065, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #....S### ", " #..S.#### ", " #..F..### ", " #.....### ", " #..#..GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy5", level: level5, ...createRescueRules(level5, { "p": [5, 3], "boxes": [[4, 5], [5, 4]] }) });
  solutions6.push("DRDDLULULLDDRUULURDRDRUUDLLUURRDDLRRDDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Ein ruhiger Umweg", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 321276, "collection": true, "sunken": true, "rescue": true, "friend": [4, 3], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.##.S### ", " #..F..### ", " #.....### ", " ####..### ", " #S....GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy6", level: level5, ...createRescueRules(level5, { "p": [5, 3], "boxes": [[3, 4], [5, 4]] }) });
  solutions6.push("LLLDRURRDULLDRRDRUUDDDLLLRRUUULRRDDDRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Standfl\xE4chen", "difficulty": "leicht", "title": "Noch etwas Platz", "desc": "Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.", "tags": ["Leicht", "Schieber\xE4tsel"], "hint": "Du schiebst immer von der gegen\xFCberliegenden Seite. Direkt an einer Wand fehlt dir daf\xFCr oft die Standfl\xE4che.", "wall": 2, "floor": 1, "seed": 321487, "collection": true, "sunken": true, "rescue": true, "friend": [3, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #.S..#### ", " #....#### ", " #.#...### ", " #SF.#.### ", " #.#...GO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-easy7", level: level5, ...createRescueRules(level5, { "p": [4, 6], "boxes": [[5, 3], [4, 5]] }) });
  solutions6.push("ULLUUURRRDLLLDDRRUDDRRUULULULLDDDRRUULULDRRRULDLLDURRDDLRDRRRR");
  introductions6.push("Leicht: Zwei Steine, zwei Druckplatten. Finde die n\xF6tigen Standfl\xE4chen und halte den Weg zum Freund frei.");
}
{
  const level5 = { "concept": "Zwischenpl\xE4tze", "difficulty": "mittel", "title": "Platz f\xFCr den Dritten", "desc": "Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "\xDCberlege vor jedem Schieben, wie du danach hinter den Stein gelangst.", "wall": 2, "floor": 1, "seed": 321698, "collection": true, "sunken": true, "rescue": true, "friend": [4, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #......## ", " #...S.S## ", " ##..#.### ", " #..F...## ", " ##...S### ", " #..#...GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium0", level: level5, ...createRescueRules(level5, { "p": [3, 7], "boxes": [[3, 3], [6, 3], [3, 6]] }) });
  solutions6.push("URUUUULLDRRURRDULLDRRDDLDLLUURUULLDRRDDRDDRRRR");
  introductions6.push("Mittel: Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "mittel", "title": "Erst au\xDFen herum", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 321909, "collection": true, "sunken": true, "rescue": true, "friend": [5, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #...SS.## ", " ####...## ", " #S.....## ", " #..#F..## ", " #...#.### ", " ##..#..GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium1", level: level5, ...createRescueRules(level5, { "p": [2, 2], "boxes": [[6, 4], [3, 5], [3, 2]] }) });
  solutions6.push("RRRDDDRURULDLUDLLLDDRULURRRURRDLLLLRRDRDDRRR");
  introductions6.push("Mittel: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "mittel", "title": "Die offene Seite", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 322120, "collection": true, "sunken": true, "rescue": true, "friend": [3, 6], "exit": [9, 5], "outside": [10, 5], "map": ["           ", " ######### ", " #S.#...## ", " #..S.#### ", " #.#.S..## ", " #......GO ", " #.F#..### ", " ##.#..### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium2", level: level5, ...createRescueRules(level5, { "p": [5, 2], "boxes": [[5, 3], [6, 5], [4, 5]] }) });
  solutions6.push("DDDLURRRDLULLDLDLUUURRRDRDLRDDLUURULULLLDDRRURRDDLULLDURRRRRR");
  introductions6.push("Mittel: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Zwischenpl\xE4tze", "difficulty": "mittel", "title": "Einer wartet kurz", "desc": "Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "\xDCberlege vor jedem Schieben, wie du danach hinter den Stein gelangst.", "wall": 2, "floor": 1, "seed": 322331, "collection": true, "sunken": true, "rescue": true, "friend": [4, 5], "exit": [9, 5], "outside": [10, 5], "map": ["           ", " ######### ", " #....#.## ", " ##.....## ", " ##.#..S## ", " ###F...GO ", " ##.S..S## ", " ###.##### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium3", level: level5, ...createRescueRules(level5, { "p": [5, 2], "boxes": [[6, 3], [4, 3], [5, 3]] }) });
  solutions6.push("DDRDDLLURUUULLDRURDDRRULLULLDRURDRRDDDLUDLLURDRRUUULLDDUURRDDDLLURLUURRDDLLURDLLRRRRR");
  introductions6.push("Mittel: Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "mittel", "title": "Zwei Wege kreuzen sich", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 322542, "collection": true, "sunken": true, "rescue": true, "friend": [5, 4], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #..##.S## ", " #....#.## ", " #..#F..## ", " #..S.#.## ", " ##....S## ", " ###....GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium4", level: level5, ...createRescueRules(level5, { "p": [4, 7], "boxes": [[3, 5], [4, 6], [4, 3]] }) });
  solutions6.push("ULURLLUURDLDRDRRRRUULLDURRDDDLLLULURDRRDRUUULLDLDRRLUURRUDLLULRDDLLULUURDDLDRUURRDDDRDRRR");
  introductions6.push("Mittel: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Zwischenpl\xE4tze", "difficulty": "mittel", "title": "Vor\xFCbergehend frei", "desc": "Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "\xDCberlege vor jedem Schieben, wie du danach hinter den Stein gelangst.", "wall": 2, "floor": 1, "seed": 322753, "collection": true, "sunken": true, "rescue": true, "friend": [3, 4], "exit": [9, 4], "outside": [10, 4], "map": ["           ", " ######### ", " ##...S### ", " #.#....## ", " #.F....GO ", " ###..#S## ", " #....#.## ", " #S...#### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium5", level: level5, ...createRescueRules(level5, { "p": [4, 5], "boxes": [[3, 6], [4, 4], [4, 6]] }) });
  solutions6.push("URDDDLUDLLURRDRUUULDURRUULLDURRDDLULURDDDLDURUULDDRDDLLURDRUULURRURDLLLLRRRRRR");
  introductions6.push("Mittel: Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "mittel", "title": "Eine L\xFCcke gen\xFCgt", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 322964, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ###.SSS## ", " ###..#.## ", " #....#.## ", " #F.#.#### ", " #......## ", " #......GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium6", level: level5, ...createRescueRules(level5, { "p": [5, 2], "boxes": [[5, 3], [6, 6], [4, 3]] }) });
  solutions6.push("DDLLDDRRDRRULLLDLLUUURRRDULLDLDDRRURDLLURRUUUULDRDDDDRRULDLUUUULURRLDDDDLLLUURRLLDDRULURDDRRUUUDDDLLUURLDDRRUULUURLDDRUDLLDLRDRRRRDRR");
  introductions6.push("Mittel: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Zwischenpl\xE4tze", "difficulty": "mittel", "title": "Die richtige Folge", "desc": "Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.", "tags": ["Mittel", "Schieber\xE4tsel"], "hint": "\xDCberlege vor jedem Schieben, wie du danach hinter den Stein gelangst.", "wall": 2, "floor": 1, "seed": 323175, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " ##S...S## ", " #.##...## ", " #.#F...## ", " #...#..## ", " #......## ", " #....S.GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-medium7", level: level5, ...createRescueRules(level5, { "p": [5, 7], "boxes": [[3, 5], [4, 7], [4, 6]] }) });
  solutions6.push("LULLDRRRURUULLDURRDDLDLLURUURRRDDDLUUULLDDLLURDRRRUULLDLDRUURRDDDRUULULLDDRLUURRDRDDLUUUURULLLRDDLDDDRURURUUDLLLRRRDDDRR");
  introductions6.push("Mittel: Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "anspruchsvoll", "title": "Viereck mit Umwegen", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 323386, "collection": true, "sunken": true, "rescue": true, "friend": [3, 5], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #.S..#.S# ", " ###.S##.# ", " #.......# ", " ##F.....# ", " #..##S..# ", " ##.#....GO", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard0", level: level5, ...createRescueRules(level5, { "p": [8, 2], "boxes": [[5, 5], [7, 4], [6, 5], [8, 3]] }) });
  solutions6.push("DDLLRDDLULULLDRRURDULLUURDLDDRRULDLUURULRDDRDRDRUULLDLURRRUDDLLLLLRRRRRDDRR");
  introductions6.push("Anspruchsvoll: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "anspruchsvoll", "title": "Zwei Zwischenlager", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 323597, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [10, 3], "outside": [11, 3], "map": ["           ", " ######### ", " #.#....S# ", " #.#.....GO", " #....S.## ", " #F...#S## ", " #..#..S.# ", " #....#..# ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard1", level: level5, ...createRescueRules(level5, { "p": [4, 5], "boxes": [[5, 6], [3, 4], [4, 4], [3, 6]] }) });
  solutions6.push("LLDDRRRUUUULURRRDDLLDLUDLLURRRRURDDUUULLLDRDDLLURRRURDLLDDDLLUULURRRDLLLURRURRRRRR");
  introductions6.push("Anspruchsvoll: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Zwischenpl\xE4tze", "difficulty": "anspruchsvoll", "title": "Die geteilte Gasse", "desc": "Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "\xDCberlege vor jedem Schieben, wie du danach hinter den Stein gelangst.", "wall": 2, "floor": 1, "seed": 323808, "collection": true, "sunken": true, "rescue": true, "friend": [4, 5], "exit": [10, 4], "outside": [11, 4], "map": ["           ", " ######### ", " ##......# ", " #.#.#..S# ", " #..##...GO", " #.#F...## ", " #S.....S# ", " #...#.S.# ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard2", level: level5, ...createRescueRules(level5, { "p": [8, 4], "boxes": [[7, 4], [6, 5], [6, 6], [5, 6]] }) });
  solutions6.push("LDLURDDDLULLDLLURRRRRUULDURUULDRDDDLLLURRDRUURUULLDDRDDLLURURDDUULURDDDLLLLRURRURRRR");
  introductions6.push("Anspruchsvoll: Mehrere Steine brauchen dieselben Standfl\xE4chen. Bereite Zwischenpl\xE4tze vor und halte den n\xE4chsten Schiebeweg offen.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "anspruchsvoll", "title": "Nach dem Seitenwechsel", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 324019, "collection": true, "sunken": true, "rescue": true, "friend": [3, 4], "exit": [10, 5], "outside": [11, 5], "map": ["           ", " ######### ", " #...#..S# ", " ##......# ", " #.F.....# ", " #.....#.GO", " #.S.##### ", " #...S..S# ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard3", level: level5, ...createRescueRules(level5, { "p": [8, 7], "boxes": [[5, 3], [7, 4], [7, 7], [6, 4]] }) });
  solutions6.push("LLLLUUUURRURRDLLLDLLUURDDDLDLDRRRRRLLLLUURDLDRUURRULURURRDDLLULDRDLLULDURRRRULURDDLLLLRRRRRDRR");
  introductions6.push("Anspruchsvoll: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "anspruchsvoll", "title": "Kein endg\xFCltiger Platz", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 324230, "collection": true, "sunken": true, "rescue": true, "friend": [4, 4], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " #.S.S.#.# ", " #..#....# ", " #..F##.## ", " #.......# ", " ##S.#...GO", " #...#..S# ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard4", level: level5, ...createRescueRules(level5, { "p": [2, 5], "boxes": [[3, 4], [7, 5], [3, 5], [7, 4]] }) });
  solutions6.push("RURDRRDRRULLLLULLDRRRLULLUURRRRDRDDUULULLLLDDRRDRRDRLULLULLUURRRRDRDDLLLLDDRULUULUURRRRDRDDLLLULULURRLDDRDDLUUUDRDRRRRDULLDDRURULLLLULDURDRRRRDRR");
  introductions6.push("Anspruchsvoll: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Ziele freigeben", "difficulty": "anspruchsvoll", "title": "Der lange Tausch", "desc": "Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.", "tags": ["Anspruchsvoll", "Schieber\xE4tsel"], "hint": "Mindestens ein belegtes Ziel muss sp\xE4ter wieder frei werden. Ein Ziel ist nicht immer der letzte Parkplatz.", "wall": 2, "floor": 1, "seed": 324441, "collection": true, "sunken": true, "rescue": true, "friend": [2, 5], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " #..#.S..# ", " #..#.#..# ", " #.##.#.## ", " #F...#S.# ", " #.......GO", " #S...S.## ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-hard5", level: level5, ...createRescueRules(level5, { "p": [7, 2], "boxes": [[5, 3], [5, 7], [3, 5], [7, 3]] }) });
  solutions6.push("LLDDDUUURRDDDRDLDLLLUURDLDRLLULURDRRUUUURRDDDDLLDLLUURLDDRRURRDLULLRRRUUUULLDDDLDRRDRUUUURULDDDDLLULLLDRRRRDRULLLDRUULLLRRRDRRRRR");
  introductions6.push("Anspruchsvoll: Die Zielpl\xE4tze teilen sich wichtige Arbeitswege. Entscheide, wann ein Stein wirklich an seinem Platz bleiben kann.");
}
{
  const level5 = { "concept": "Wippenseiten", "difficulty": "leicht", "title": "Das tiefe Ende", "desc": "Die Wippe \xF6ffnet einen Weg und schlie\xDFt einen anderen. Tritt vom tiefen Ende ein und gehe vollst\xE4ndig dar\xFCber.", "tags": ["Leicht", "Richtungswippe"], "hint": "Auf das tiefe Ende treten schaltet noch nichts. Du darfst zur\xFCckgehen. Erst vollst\xE4ndiges \xDCberqueren kippt die Wippe.", "wall": 2, "floor": 1, "seed": 324652, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[4, 5], [6, 5], [6, 3]], [[4, 5], [3, 5], [3, 4]]], "friend": [4, 4], "exit": [8, 5], "outside": [9, 5], "map": ["           ", " ######### ", " #S....### ", " ###.#G### ", " #.EF..### ", " ##.A..DO  ", " #....S### ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-switchIntro1", level: level5, ...createSwitchRescueRules(level5, { "p": [3, 2], "boxes": [[4, 2], [6, 5]] }) });
  solutions6.push("RDDRRDULLLDRRURUULLLRDDRRDRR");
  introductions6.push("Leicht: Die Wippe \xF6ffnet einen Weg und schlie\xDFt einen anderen. Tritt vom tiefen Ende ein und gehe vollst\xE4ndig dar\xFCber.");
}
{
  const level5 = { "concept": "Wippenseiten", "difficulty": "leicht", "title": "Einmal hin und zur\xFCck", "desc": "Diesmal brauchst du beide Stellungen der Wippe. Bereite vor, wie du sp\xE4ter wieder an ihr tiefes Ende gelangst.", "tags": ["Leicht", "Richtungswippe"], "hint": "Nach dem Kippen liegt das tiefe Ende auf der anderen Seite. Plane den Weg dorthin.", "wall": 2, "floor": 1, "seed": 324863, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[5, 3], [6, 3], [6, 4]], [[5, 3], [4, 3], [4, 5]]], "friend": [5, 5], "exit": [8, 6], "outside": [9, 6], "map": ["           ", " ######### ", " #..S..### ", " #...A.### ", " ##...G### ", " ###EF.### ", " ##.S..DO  ", " ######### ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-switchIntro2", level: level5, ...createSwitchRescueRules(level5, { "p": [3, 4], "boxes": [[4, 4], [4, 3]] }) });
  solutions6.push("RURRDLRULLDDRRDRR");
  introductions6.push("Leicht: Diesmal brauchst du beide Stellungen der Wippe. Bereite vor, wie du sp\xE4ter wieder an ihr tiefes Ende gelangst.");
}
{
  const level5 = { "concept": "Einmalige Standfl\xE4che", "difficulty": "mittel", "title": "Einmal tr\xE4gt es dich", "desc": "Diese morschen Bretter tragen Nurbi einmal. Beim Verlassen brechen sie weg; danach brauchst du einen festen R\xFCckweg.", "tags": ["Mittel", "Morsche Bretter"], "hint": "Erledige vor dem \xDCberqueren die Arbeit, f\xFCr die du diese Standfl\xE4che noch brauchst.", "wall": 2, "floor": 1, "seed": 325074, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [4, 5], "exit": [9, 7], "outside": [10, 7], "map": ["           ", " ######### ", " #......## ", " #...S.S## ", " ##.T#.### ", " #..F...## ", " ##...S### ", " #..#...GO ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-boardsIntro", level: level5, ...createFractureRescueRules(level5, { "p": [3, 7], "boxes": [[3, 3], [6, 3], [3, 6]] }) });
  solutions6.push("UURUUULLDRRURRDULLDRRDDLLLUDRRRUUULLLLDRRLDDRRDDRRRR");
  introductions6.push("Mittel: Diese morschen Bretter tragen Nurbi einmal. Beim Verlassen brechen sie weg; danach brauchst du einen festen R\xFCckweg.");
}
{
  const level5 = { "concept": "Trockene Wege", "difficulty": "mittel", "title": "Das trockene Ufer", "desc": "Die Wippe tauscht den Wasserstand zwischen zwei Becken. Nur das trockene Becken ist begehbar; benutze seine Treppenenden.", "tags": ["Mittel", "Wasserwechsel"], "hint": "Steine bleiben im gefluteten Becken liegen. Lege es trocken, bevor du sie weiterschiebst.", "wall": 2, "floor": 1, "seed": 325285, "collection": true, "sunken": true, "rescue": true, "water": true, "waterRescue": true, "lever": true, "basinMount": "flush", "liquidType": "water", "connections": [[[3, 5], [6, 5], [6, 3]], [[3, 5], [6, 5], [6, 6]]], "friend": [4, 3], "exit": [12, 6], "outside": [13, 6], "map": ["             ", " ########### ", " ##..###...# ", " ##.FUUU...# ", " #...###...# ", " #.A.####.S# ", " #..SWWW...GO", " #..####..## ", " #...###...# ", " ########### ", "             "] };
  rooms10.push({ id: "lernpfad-waterIntro", level: level5, ...createWaterRescueRules(level5, { "p": [2, 5], "boxes": [[5, 3], [3, 3]] }) });
  solutions6.push("URRUULDRDDDLLUURURDDULLDRRUURRRRRURDDULLLLLLRRRRRDDDRRR");
  introductions6.push("Mittel: Die Wippe tauscht den Wasserstand zwischen zwei Becken. Nur das trockene Becken ist begehbar; benutze seine Treppenenden.");
}
{
  const level5 = { "concept": "Wippenseiten", "difficulty": "anspruchsvoll", "title": "Zwischen beiden Stellungen", "desc": "Vier Steine und zwei wechselnde Durchg\xE4nge teilen sich die Arbeitswege. Plane mehrere Wechsel im Voraus.", "tags": ["Anspruchsvoll", "Richtungswippe"], "hint": "Die gerade offene Seite kann sp\xE4ter wieder schlie\xDFen. Halte den Zugang zur Wippe erreichbar.", "wall": 2, "floor": 1, "seed": 325496, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[5, 2], [4, 2], [4, 7]], [[5, 2], [3, 2], [3, 6]]], "friend": [2, 5], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " ##..A...# ", " #...#S.S# ", " #....#S.# ", " #F#..#..# ", " #.ES....DO", " #.#G#..## ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-switchHard1", level: level5, ...createSwitchRescueRules(level5, { "p": [5, 4], "boxes": [[3, 3], [5, 5], [4, 4], [4, 5]] }) });
  solutions6.push("LUURRRDDDDLLLUURDLDRRDRUUURUULLDRURDDUULLLLDDRDDLLLUUURURRRRDDDDLLUULDRDRRUUUULLLDDULLDDDRRRUULDUULLDRURDRDDRDRUUURULDDDLLUULLLDDRRRRDRUUDRUUDDLLLUULDULLDURRRDDRRRRR");
  introductions6.push("Anspruchsvoll: Vier Steine und zwei wechselnde Durchg\xE4nge teilen sich die Arbeitswege. Plane mehrere Wechsel im Voraus.");
}
{
  const level5 = { "concept": "Wippenseiten", "difficulty": "anspruchsvoll", "title": "Die R\xFCckseite des Plans", "desc": "Ein erster offener Weg gen\xFCgt hier nicht. Koordiniere die n\xE4chsten Steinpl\xE4tze mit der erreichbaren Wippenseite.", "tags": ["Anspruchsvoll", "Richtungswippe"], "hint": "Bevor du umschaltest, pr\xFCfe, auf welcher Seite die ben\xF6tigten Steine und Standfl\xE4chen liegen.", "wall": 2, "floor": 1, "seed": 325707, "collection": true, "sunken": true, "rescue": true, "switchRescue": true, "combined": true, "lever": true, "connections": [[[3, 7], [6, 7]], [[3, 7], [7, 7], [7, 5]]], "friend": [3, 5], "exit": [0, 7], "outside": [-1, 7], "map": ["           ", " ######### ", " ###..#..# ", " #....#S.# ", " #.#...S.# ", " ##F.#SES# ", " #.....#.# ", "OD.A..G.## ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-switchHard2", level: level5, ...createSwitchRescueRules(level5, { "p": [4, 6], "boxes": [[4, 5], [5, 4], [8, 3], [6, 6]] }) });
  solutions6.push("UURUULDDDLDRUURRDRRULLLULDDURRRUURDDLLLLDLDLDRRUUUDDDRRUUDDLLURDRULLUURRLLDDRRUDDLLLLURRRRURUDLDLLUURRLUULDDDLDRRLLLDRRRRULLULDLDLL");
  introductions6.push("Anspruchsvoll: Ein erster offener Weg gen\xFCgt hier nicht. Koordiniere die n\xE4chsten Steinpl\xE4tze mit der erreichbaren Wippenseite.");
}
{
  const level5 = { "concept": "Einmalige Standfl\xE4che", "difficulty": "anspruchsvoll", "title": "Der letzte \xDCbergang", "desc": "Ein morsches Feld verbindet mehrere Arbeitswege. Bereite die endg\xFCltige \xDCberquerung vor.", "tags": ["Anspruchsvoll", "Morsche Bretter"], "hint": "Nach dem Einbruch muss auch der Freund noch auf festem Boden zum Ausgang gelangen k\xF6nnen.", "wall": 2, "floor": 1, "seed": 325918, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [4, 5], "exit": [10, 6], "outside": [11, 6], "map": ["           ", " ######### ", " ##......# ", " #.......# ", " ##.#...T# ", " #..F##.## ", " #..S.S..GO", " ##..SS.## ", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-boardsHard1", level: level5, ...createFractureRescueRules(level5, { "p": [5, 4], "boxes": [[5, 3], [7, 6], [6, 4], [3, 6]] }) });
  solutions6.push("RULULLDDDRDRRDRULLLULLDRUUUURRDLULDDDRDULLDRRRLULUURRRRRDLULLLLDDRDRDRRUUUDDDLLULULUUURRRRRDLLLLULDDDUURRDRULLLDDRDRDRRUUULULLLDDLDRUUUURRRRRDLLLULLDDDDDRRLLUURDLDRUULUUURRDLULDDDLDRURLUURRRRDDDRRR");
  introductions6.push("Anspruchsvoll: Ein morsches Feld verbindet mehrere Arbeitswege. Bereite die endg\xFCltige \xDCberquerung vor.");
}
{
  const level5 = { "concept": "Einmalige Standfl\xE4che", "difficulty": "anspruchsvoll", "title": "Wenn der Weg verschwindet", "desc": "Vier Steine, wenig Rangierraum und eine einmal nutzbare Standfl\xE4che. Der Einsturz geh\xF6rt zur Planung.", "tags": ["Anspruchsvoll", "Morsche Bretter"], "hint": "Verschiebe die letzte \xDCberquerung so lange, bis keine Arbeit mehr auf den alten Zugang angewiesen ist.", "wall": 2, "floor": 1, "seed": 326129, "collection": true, "sunken": true, "rescue": true, "weight": true, "fragileWalk": true, "friend": [6, 4], "exit": [10, 7], "outside": [11, 7], "map": ["           ", " ######### ", " #....#T.# ", " #.#..#..# ", " #..S#F..# ", " ##S.....# ", " #.#..##.# ", " #.SS.#..GO", " ######### ", "           "] };
  rooms10.push({ id: "lernpfad-boardsHard2", level: level5, ...createFractureRescueRules(level5, { "p": [2, 4], "boxes": [[7, 3], [4, 5], [5, 6], [3, 4]] }) });
  solutions6.push("RDRRRURRDLLLLDDRULURRLLULLUURRDDDDURRURRDLLLDLUULLUURRDDDRDDLRUULDURRURRUULDDRDLLLDLURRURRDDDRR");
  introductions6.push("Anspruchsvoll: Vier Steine, wenig Rangierraum und eine einmal nutzbare Standfl\xE4che. Der Einsturz geh\xF6rt zur Planung.");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  added,
  addedSolutions,
  introductions,
  rooms,
  solutions
});
