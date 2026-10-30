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

// outputs/nurbis-dungeons/src/hard-collection.js
var hard_collection_exports = {};
__export(hard_collection_exports, {
  rooms: () => rooms2
});
module.exports = __toCommonJS(hard_collection_exports);

// outputs/nurbis-dungeons/src/lever-rules.js
function createRules(workshop, start) {
  const eq2 = (a, b) => a[0] === b[0] && a[1] === b[1];
  function initial2() {
    return { p: [2, 7], boxes: [[4, 7]], off: false, moves: 0, won: false, flowers: [] };
  }
  function covered(s) {
    return s.boxes.some((b) => eq2(b, [5, 4]));
  }
  function hot(s) {
    return !s.off && !covered(s);
  }
  function plate2(s) {
    return s.boxes.some((b) => eq2(b, [8, 8]));
  }
  function canUse(s) {
    return eq2(s.p, s.off ? [8, 3] : [6, 3]) && !s.won;
  }
  function act2(s, action) {
    if (s.won) return { state: null, reason: "Die Anlage ist entlastet und der K\xE4fer ist frei." };
    if (action === "valve") return { state: null, reason: "Betritt die Wippe von ihrer abgesenkten Seite." };
    const [dx, dy] = action;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return { state: null, reason: "Nur benachbarte Felder sind erreichbar." };
    const p = [s.p[0] + dx, s.p[1] + dy], at = (p2) => workshop.map[p2[1]]?.[p2[0]] ?? " ", blocked = (p2) => {
      const c = at(p2);
      return c === "#" || c === " " || c === "M" && !s.off || c === "G" && !plate2(s);
    };
    if (at(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { state: null, reason: "Gehe \xFCber das jetzt abgesenkte Ende weiter. Die Wippe wird entlang ihrer Kippachse \xFCberquert." };
    if (at(p) === "A") {
      const enter = s.off ? -1 : 1;
      if (dy !== 0 || dx !== enter) return { state: null, reason: dy !== 0 ? "Die Seitenfassung ist geschlossen. Betritt die Wippe an ihrem abgesenkten Ende." : "Dieses Ende steht hoch. Suche den Weg zur abgesenkten Seite." };
      if (s.off && s.boxes.some((b) => at(b) === "M")) return { state: null, reason: "Ein Stein blockiert das Schiebewerk. Die Wippe l\xE4sst sich gerade nicht zur\xFCckschalten." };
      const exit = [p[0] + dx, p[1]], exitTile = at(exit), closing = !s.off;
      if (exitTile === "#" || exitTile === " " || exitTile === "A" || exitTile === "G" && !plate2(s) || exitTile === "M" && !closing || s.boxes.some((b) => eq2(b, exit))) return { state: null, reason: "Das andere Ende ist versperrt. Nurbi kann die Wippe nicht \xFCberqueren." };
      const n2 = structuredClone(s);
      n2.p = p;
      n2.off = !s.off;
      n2.moves++;
      return { state: n2, reason: n2.off ? "Nurbi betritt das tiefe Ende. Die Wippe kippt: Druck abgebaut, Schiebewerk offen. Gehe gerade dar\xFCber." : "Nurbi betritt das tiefe Ende. Die Wippe kippt zur\xFCck: Die Anlage steht wieder unter Druck. Gehe gerade dar\xFCber." };
    }
    if (blocked(p)) return { state: null, reason: at(p) === "M" ? "Das Schiebewerk steht unter Druck. \xDCberquere die Bodenwippe von ihrer abgesenkten Seite." : "Hier ist der Weg versperrt." };
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq2(b, p));
    if (bi >= 0) {
      const dest = [p[0] + dx, p[1] + dy];
      if (blocked(dest) || at(dest) === "A" || at(dest) === "F" || n.boxes.some((b) => eq2(b, dest))) return { state: null, reason: "Der Stein l\xE4sst sich nicht weiter schieben." };
      n.boxes[bi] = dest;
    }
    if (at(p) === "H" && hot(n) || at(p) === "V" && !n.off) return { state: null, hazard: true, reason: "Hei\xDFer Dampf! Nurbi weicht zur\xFCck. Der Zug wurde nicht ausgef\xFChrt." };
    n.p = p;
    n.moves++;
    n.won = at(p) === "F";
    return { state: n, reason: n.won ? "Der K\xE4fer ist in Sicherheit." : n.off ? "Die Anlage ist drucklos. Nutze den Stein f\xFCr das Siegel." : covered(n) ? "\xD6ffnung abgedeckt. Der Dampfstrahl ist gestoppt." : "Die \xD6ffnung ist hei\xDF. Ein Stein kann sie verschlie\xDFen." };
  }
  const baseInitial = initial2;
  return { initial: () => ({ ...baseInitial(), ...structuredClone(start), moves: 0, won: false }), act: act2 };
}

// outputs/nurbis-dungeons/src/water-rules.js
function createRules2(workshop, start) {
  const tile2 = (p) => workshop.map[p[1]]?.[p[0]] ?? "#";
  function initial2() {
    return { p: [2, 8], boxes: [], off: false, key: false, moves: 0, won: false, flowers: [] };
  }
  function flooded(s, c) {
    return c === "U" ? !s.off : c === "W" ? s.off : false;
  }
  function act2(s, action) {
    if (s.won) return { state: null, reason: "Der Freund ist in Sicherheit." };
    if (!Array.isArray(action) || Math.abs(action[0]) + Math.abs(action[1]) !== 1) return { state: null, reason: "Gehe auf ein Nachbarfeld." };
    const [dx, dy] = action, p = [s.p[0] + dx, s.p[1] + dy], c = tile2(p);
    if (tile2(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { state: null, reason: "\xDCberquere die Wippe gerade \xFCber das neu abgesenkte Ende." };
    if (c === "#") return { state: null, reason: "Hier ist eine Wand." };
    if (flooded(s, c)) return { state: null, hazard: true, reason: "Dieser Kanal ist geflutet. Nurbi bleibt am sicheren Ufer. Leite das Wasser mit der Wippe um." };
    if (c === "F" && !s.key) return { state: null, reason: "Hole zuerst den Gartensamen aus dem oberen Bereich." };
    const n = structuredClone(s);
    if (c === "A") {
      if (dy !== 0 || dx !== (s.off ? -1 : 1)) return { state: null, reason: "Betritt die Wippe nur vom abgesenkten Ende: " + (s.off ? "rechts." : "links.") };
      const next = { ...s, off: !s.off }, exit = tile2([p[0] + dx, p[1] + dy]);
      if (exit === "#" || flooded(next, exit)) return { state: null, reason: "Der Ausgang der Wippe w\xE4re versperrt." };
      n.off = !s.off;
    }
    n.p = p;
    n.moves++;
    if (c === "K") n.key = true;
    n.won = c === "F" && n.key;
    return { state: n, reason: n.won ? "Gartensamen und Freund sind wieder zusammen." : c === "A" ? n.off ? "Oberes Becken l\xE4uft leer, unteres f\xFCllt sich. Gehe gerade \xFCber die Wippe." : "Unteres Becken l\xE4uft leer, oberes f\xFCllt sich. Gehe gerade \xFCber die Wippe." : !s.key && n.key ? "Gartensamen gefunden. Kehre zur\xFCck zur Wippe: Der Freund wartet unten." : "Beachte, welcher Kanal gerade trocken ist." };
  }
  const baseInitial = initial2;
  return { initial: () => ({ ...baseInitial(), ...structuredClone(start), moves: 0, won: false }), act: act2 };
}

// outputs/nurbis-dungeons/src/press-rules.js
function createRules3(workshop, start) {
  const tile2 = (p) => workshop.map[p[1]]?.[p[0]] ?? "#";
  function initial2() {
    return { p: [2, 8], boxes: [], off: false, key: false, moves: 0, won: false, flowers: [] };
  }
  function blockedRiegel(s, c) {
    return c === "U" ? !s.off : c === "W" ? s.off : false;
  }
  function act2(s, action) {
    if (s.won) return { state: null, reason: "Der Freund ist in Sicherheit." };
    if (!Array.isArray(action) || Math.abs(action[0]) + Math.abs(action[1]) !== 1) return { state: null, reason: "Gehe auf ein Nachbarfeld." };
    const [dx, dy] = action, p = [s.p[0] + dx, s.p[1] + dy], c = tile2(p);
    if (tile2(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { state: null, reason: "\xDCberquere die Wippe gerade \xFCber das neu abgesenkte Ende." };
    if (c === "#") return { state: null, reason: "Hier ist eine Wand." };
    if (blockedRiegel(s, c)) return { state: null, hazard: true, reason: "Der Steinriegel sperrt diesen Durchgang. Schalte die Wippe von der passenden Seite um." };
    if (c === "F" && !s.key) return { state: null, reason: "Hole zuerst den Gartensamen aus dem oberen Bereich." };
    const n = structuredClone(s);
    if (c === "A") {
      if (dy !== 0 || dx !== (s.off ? -1 : 1)) return { state: null, reason: "Betritt die Wippe nur vom abgesenkten Ende: " + (s.off ? "rechts." : "links.") };
      const next = { ...s, off: !s.off }, exit = tile2([p[0] + dx, p[1] + dy]);
      if (exit === "#" || blockedRiegel(next, exit)) return { state: null, reason: "Der Ausgang der Wippe w\xE4re versperrt." };
      n.off = !s.off;
    }
    n.p = p;
    n.moves++;
    if (c === "K") n.key = true;
    n.won = c === "F" && n.key;
    return { state: n, reason: n.won ? "Gartensamen und Freund sind wieder zusammen." : c === "A" ? n.off ? "Oberer Riegel f\xE4hrt in die Nische, unterer sperrt den Durchgang. Gehe gerade \xFCber die Wippe." : "Unterer Riegel f\xE4hrt in die Nische, oberer sperrt den Durchgang. Gehe gerade \xFCber die Wippe." : !s.key && n.key ? "Gartensamen gefunden. Kehre zur\xFCck zur Wippe: Der Freund wartet unten." : "Beachte die Riegelstellung und die Parknischen." };
  }
  const baseInitial = initial2;
  return { initial: () => ({ ...baseInitial(), ...structuredClone(start), moves: 0, won: false }), act: act2 };
}

// outputs/nurbis-dungeons/src/trap-rules.js
function createRules4(workshop, start) {
  const eq2 = (a, b) => a[0] === b[0] && a[1] === b[1];
  function initial2() {
    return { p: [2, 5], boxes: [[8, 5]], opened: false, filled: false, key: false, moves: 0, won: false, flowers: [] };
  }
  function act2(s, action) {
    if (s.won) return { state: null, reason: "Der Freund ist bereits in Sicherheit." };
    if (!Array.isArray(action) || Math.abs(action[0]) + Math.abs(action[1]) !== 1) return { state: null, reason: "Gehe auf ein Nachbarfeld." };
    const [dx, dy] = action, p = [s.p[0] + dx, s.p[1] + dy], tile2 = (p2) => workshop.map[p2[1]]?.[p2[0]] ?? "#";
    if (tile2(p) === "#") return { state: null, reason: "Hier ist eine Wand." };
    if (tile2(p) === "F" && !s.key) return { state: null, reason: "Der Freund wartet hier. Hole zuerst seinen Gartensamen von der anderen Seite." };
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq2(b, p));
    let bridge = false;
    if (bi >= 0) {
      const dest = [p[0] + dx, p[1] + dy];
      if (tile2(dest) === "#" || tile2(dest) === "F" || n.boxes.some((b) => eq2(b, dest))) return { state: null, reason: "Der Stein l\xE4sst sich hier nicht weiterschieben." };
      if (tile2(dest) === "C" && !n.filled) {
        n.boxes.splice(bi, 1);
        n.opened = true;
        n.filled = true;
        bridge = true;
      } else n.boxes[bi] = dest;
    }
    if (tile2(p) === "C" && n.opened && !n.filled) return { state: null, hazard: true, reason: "Die Platte ist offen. Nurbi bleibt sicher am Rand. Ein Stein kann die \xD6ffnung f\xFCllen." };
    let collapsed = false;
    if (tile2(s.p) === "C" && !n.filled && !n.opened) {
      n.opened = true;
      collapsed = true;
    }
    n.p = p;
    n.moves++;
    if (tile2(p) === "K") n.key = true;
    n.won = tile2(p) === "F" && n.key;
    return { state: n, reason: n.won ? "Samen und Freund sind wieder zusammen." : bridge ? "Der Stein sitzt fest in der \xD6ffnung. Der R\xFCckweg ist wieder begehbar." : collapsed ? "Die alte Platte klappt hinter Nurbi weg. Der R\xFCckweg ist jetzt unterbrochen." : tile2(p) === "C" && !n.filled ? "Die Platte tr\xE4gt Nurbi noch. Sobald er sie verl\xE4sst, klappt sie auf." : !s.key && n.key ? "Gartensamen gefunden. Bringe ihn zur\xFCck zum Freund." : "Plane deinen n\xE4chsten Schritt." };
  }
  const baseInitial = initial2;
  return { initial: () => ({ ...baseInitial(), ...structuredClone(start), moves: 0, won: false }), act: act2 };
}

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

// outputs/nurbis-dungeons/src/puzzle-collection.js
var base = { wall: 2, floor: 1, seed: 1821, collection: true, sunken: true };
function simpleRules(level2, start) {
  const tile2 = (p) => level2.map[p[1]]?.[p[0]] ?? "#", eq2 = (a, b) => a[0] === b[0] && a[1] === b[1];
  const seals = [];
  level2.map.forEach((r, y) => [...r].forEach((c, x) => {
    if (c === "S") seals.push([x, y]);
  }));
  const ready = (s) => seals.every((p) => s.boxes.some((b) => eq2(b, p)));
  return { initial: () => ({ ...structuredClone(start), off: false, opened: false, filled: false, key: false, moves: 0, won: false, flowers: [] }), act(s, [dx, dy]) {
    if (s.won) return { reason: "Dieser Raum ist geschafft." };
    if (Math.abs(dx) + Math.abs(dy) !== 1) return { reason: "Ein Schritt pro Richtung." };
    const p = [s.p[0] + dx, s.p[1] + dy], c = tile2(p), blocked = (p2) => tile2(p2) === "#" || tile2(p2) === "T" && s.opened;
    if (blocked(p)) return { reason: c === "T" ? "Der Boden ist eingebrochen. Hier geht es nicht mehr weiter." : "Hier ist eine Wand." };
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq2(b, p));
    if (bi >= 0) {
      const d = [p[0] + dx, p[1] + dy];
      if (blocked(d) || tile2(d) === "F" || n.boxes.some((b) => eq2(b, d))) return { reason: "Der Stein l\xE4sst sich hier nicht weiterschieben." };
      if (tile2(d) === "T") {
        n.boxes.splice(bi, 1);
        n.opened = true;
        n.p = p;
        n.moves++;
        return { state: n, reason: "Der Stein bricht durch die Bretter und ist verloren. Mit R\xFCckg\xE4ngig kannst du einen sicheren Weg suchen." };
      }
      n.boxes[bi] = d;
    }
    n.p = p;
    n.moves++;
    n.won = level2.sealGoal ? ready(n) : c === "F" && ready(n);
    return { state: n, reason: n.won ? "Geschafft! Alle n\xF6tigen Wege sind gesichert." : c === "F" && !ready(n) ? "Der Freund wartet. Bringe zuerst die Steine auf ihre markierten Ruhepl\xE4tze." : ready(n) ? "Alle Ruhepl\xE4tze sind belegt. Der Freund wartet auf dich." : c === "T" ? "Die alten Bretter tragen Nurbi, aber keinen schweren Stein." : "Plane den n\xE4chsten Schub und den Platz zum Umrunden." };
  } };
}
var rooms = [];
function add(id, title, desc, tags, extra, start, rules = simpleRules) {
  const level2 = { ...base, ...extra, title, desc, tags, theme: "R\xC4TSELREIHE \xB7 " + tags.join(" / "), hint: extra.hint || "Du kannst jeden Schritt r\xFCckg\xE4ngig machen. Plane auch, wo Nurbi f\xFCr den n\xE4chsten Schub stehen muss." };
  rooms.push({ id, level: level2, ...rules(level2, start) });
}
add("ruheplaetze", "Zwei freie Wege", "Bringe beide Steine auf ihre markierten Ruhepl\xE4tze. Hier gibt es keine Schalter, Tore oder Gefahren.", ["Schieben", "Zwei Steine"], { sealGoal: true, map: ["###########", "###########", "#..S......#", "#..#.#....#", "#..BB.....#", "#..#..S...#", "#..P......#", "#.........#", "###########", "###########", "###########"] }, { p: [3, 6], boxes: [[3, 4], [4, 4]] });
add("bretter", "Der leichte und der schwere Weg", "Nurbi darf die Bretter betreten. Bringe den schweren Stein \xFCber festen Boden auf seinen Ruheplatz.", ["Bruchboden", "Sicherer Umweg"], { weight: true, sealGoal: true, map: ["###########", "###########", "#.........#", "#...#..S..#", "#.........#", "#...BT....#", "#.P.......#", "#.........#", "###########", "###########", "###########"] }, { p: [2, 6], boxes: [[4, 5]] });
add("rueckweg", "Die Platte hinter dir", "Hole den Gartensamen. Die Platte \xF6ffnet sich hinter Nurbi; ein Stein muss den R\xFCckweg wiederherstellen.", ["Kippboden", "Loch f\xFCllen"], { trap: true, floor: 5, map: ["###########", "###########", "##F###..K.#", "#....#.#..#", "#....C....#", "#.P..#..B.#", "#....#....#", "#....#.#..#", "###########", "###########", "###########"] }, { p: [2, 5], boxes: [[8, 5]] }, createRules4);
rooms.push({ id: "durchgang", level: { ...level, ...base, tags: ["Wippe", "Versenkbare Gitter"], hint: level.hint }, initial, act });
add("druckwerk", "Das vergessene Druckwerk", "Verschlie\xDFe die hei\xDFe \xD6ffnung mit dem Stein. Entlaste das Werk \xFCber die Wippe und hole den Stein f\xFCr das Siegel zur\xFCck.", ["Dampf", "Schienen", "Wippe"], { workshop: true, lever: true, recess: [9, 6], map: ["###########", "###########", "#....#....#", "#....#.A..#", "#....V....#", "#....H....#", "#.....##M##", "#.P.B.#...#", "#.....#.S##", "#######.GF#", "###########"] }, { p: [2, 8], boxes: [[3, 7]] }, createRules);
var channelMap = ["###########", "###########", "#....#..K.#", "#....UUU..#", "#....######", "#..A.######", "#....######", "#....WWW..#", "#.P..#..F.#", "###########", "###########"];
add("wasser", "Die wandernden Wasser", "Lege den oberen Kanal trocken und hole den Samen. F\xFCr die Rettung musst du anschlie\xDFend den unteren Weg freigeben.", ["Wasser", "Becken", "R\xFCckschalten"], { water: true, lever: true, basinMount: "flush", floor: 0, map: channelMap }, { p: [1, 8], boxes: [] }, createRules2);
add("lava", "Unter dem warmen Gestein", "Dieselben alten Schleusen f\xFChren hier Lava. Hole den Samen und leite sie f\xFCr den R\xFCckweg wieder in das andere Becken.", ["Lava", "Becken", "Wippe"], { water: true, lever: true, basinMount: "flush", liquidType: "lava", floor: 4, seed: 1953, map: ["###########", "###########", "#....#K...#", "#....UUU..#", "#....######", "#..A.######", "#....######", "#....WWW..#", "#.P..#...F#", "###########", "###########"] }, { p: [2, 8], boxes: [] }, createRules2);
add("riegel", "Zwei Wege, ein Schiebewerk", "Die gekoppelten Steinriegel geben abwechselnd einen Weg frei. Hole den Samen und finde zur\xFCck zum unteren Durchgang.", ["Steinriegel", "Schienen", "Parknischen"], { press: true, lever: true, recesses: [[5, 4], [5, 6]], floor: 0, map: ["###########", "###########", "#....#..K.#", "#....U....#", "#....######", "#..A.######", "#....######", "#....W....#", "#.P..#..F.#", "###########", "###########"] }, { p: [1, 7], boxes: [] }, createRules3);

// outputs/nurbis-dungeons/src/return-rules.js
function createReturnRules(level2, start) {
  const eq2 = (a, b) => a[0] === b[0] && a[1] === b[1], tile2 = (p) => level2.map[p[1]]?.[p[0]] ?? "#", plate2 = (s) => s.boxes.some((b) => tile2(b) === "S");
  const open = (s, c) => c === "G" ? s.off : c === "E" ? !s.off : plate2(s);
  return { initial: () => ({ ...structuredClone(start), off: false, opened: true, filled: false, key: false, moves: 0, won: false, flowers: [] }), act(s, [dx, dy]) {
    if (s.won) return { reason: "Der Freund ist in Sicherheit." };
    if (Math.abs(dx) + Math.abs(dy) !== 1) return { reason: "Gehe auf ein Nachbarfeld." };
    const p = [s.p[0] + dx, s.p[1] + dy], c = tile2(p), blocked = (p2, n2 = s) => tile2(p2) === "#" || ["G", "D", "E"].includes(tile2(p2)) && !open(n2, tile2(p2));
    if (tile2(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { reason: "\xDCberquere die Wippe gerade bis zum anderen Ende." };
    if (c === "A") {
      if (dy !== 0 || dx !== (s.off ? -1 : 1)) return { reason: "Betritt das abgesenkte Ende der Wippe." };
      const n2 = structuredClone(s);
      n2.off = !n2.off;
      const exit = [p[0] + dx, p[1] + dy];
      if (blocked(exit, n2) || s.boxes.some((b) => eq2(b, exit))) return { reason: "Der Ausgang der Wippe ist versperrt." };
      if (s.boxes.some((b) => ["G", "E"].includes(tile2(b)) && !open(n2, tile2(b)))) return { reason: "Der Stein blockiert ein schlie\xDFendes Gitter. Die Wippe bleibt in ihrer Stellung." };
      n2.p = p;
      n2.moves++;
      return { state: n2, reason: n2.off ? "Transportgitter offen, Zielgitter geschlossen. Gehe gerade weiter." : "Transportgitter geschlossen, Zielgitter offen. Gehe gerade weiter." };
    }
    if (blocked(p)) return { reason: c === "D" ? "Dieser Durchgang wird vom Steinsiegel bedient." : ["G", "E"].includes(c) ? "Dieses Gitter wird von der Wippe bedient." : "Hier ist eine Wand." };
    if (c === "C" && !s.filled) return { reason: "Der Schacht ist offen. Ein Stein kann einen dauerhaften Tritt bilden." };
    if (c === "F" && !s.key) return { reason: "Hole erst den Gartensamen aus der Nische." };
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq2(b, p));
    let consumed = false;
    if (bi >= 0) {
      const d = [p[0] + dx, p[1] + dy];
      if (blocked(d) || ["A", "K", "F"].includes(tile2(d)) || n.boxes.some((b) => eq2(b, d))) return { reason: "Der Stein kann hier nicht weitergeschoben werden." };
      if (tile2(d) === "C" && !n.filled) {
        n.boxes.splice(bi, 1);
        n.filled = true;
        consumed = true;
      } else n.boxes[bi] = d;
    }
    n.p = p;
    n.moves++;
    if (c === "K") n.key = true;
    n.won = c === "F" && n.key;
    return { state: n, reason: n.won ? "Du hast den R\xFCckweg vorbereitet und den Freund erreicht." : consumed ? "Der Stein sitzt fest im Schacht. Er kann das Siegel jetzt nicht mehr bedienen." : !s.key && n.key ? "Samen gefunden. Plane die endg\xFCltige Verwendung des Steins." : plate2(n) ? "Der Stein h\xE4lt die Samennische offen." : "Achte darauf, welche Wege nach dem n\xE4chsten Umschalten erreichbar bleiben." };
  } };
}

// outputs/nurbis-dungeons/src/hard-collection.js
var base2 = { wall: 2, floor: 1, seed: 4217, collection: true, sunken: true };
var rooms2 = [];
function add2(id, title, desc, tags, extra, start, rules) {
  const level2 = { ...base2, ...extra, title, desc, tags };
  rooms2.push({ id, level: level2, ...rules(level2, start) });
}
add2("umparken", "Der Platz ist nur geliehen", "Zwei Steine, zwei Ruhepl\xE4tze und wenig Bewegungsraum. Bringe beide Steine an ihren Platz.", ["Umparken", "Zwei Steine"], { "sealGoal": true, "map": ["###########", "###########", "###########", "###.....###", "###..###.##", "###..#...##", "###..#...##", "###S....###", "###S.#..###", "###########", "###########"], "hint": "Ein Stein kann anfangs richtig stehen und trotzdem den Arbeitsweg f\xFCr den anderen versperren. Plane auch die freien Standfl\xE4chen." }, { "p": [3, 8], "boxes": [[3, 7], [4, 6]] }, simpleRules);
add2("wiederverwenden", "Der geliehene Stein", "Ein Stein, zwei Aufgaben: erst die Dampf\xF6ffnung verschlie\xDFen, sp\xE4ter das Zielgitter offenhalten. Dazwischen liegt ein enges Schiebewerk.", ["Wiederverwenden", "Dampf & Schienen"], { "workshop": true, "lever": true, "recess": [9, 6], "map": ["###########", "###########", "#...##....#", "#..#.#.A..#", "#....V.#..#", "#....H....#", "#..##.##M##", "#....B#...#", "#....##.S##", "#######.GF#", "###########"], "hint": "Der Stein muss zun\xE4chst vom Ziel weg. Entlaste die Anlage, bevor du ihn zur\xFCckholst. Die Mauer rechts zwingt ihn zu einem weiteren Umweg." }, { "p": [2, 8], "boxes": [[3, 7]] }, createRules);
add2("vorbereiten", "Erst sichern, dann aufgeben", "Hole den Gartensamen aus der linken Nische und erreiche den Freund rechts unten. Die Wippe \xF6ffnet abwechselnd Transport- und Zielgitter. Ein Stein im Schacht bleibt dort f\xFCr immer.", ["R\xFCckweg vorbereiten", "Endg\xFCltig verwenden"], { advanced: true, combined: true, lever: true, trap: true, connections: [[[3, 5], [3, 3], [5, 3]], [[3, 5], [9, 5], [9, 8]], [[8, 4], [8, 2], [1, 2]]], map: ["###########", "#K####....#", "#D...#....#", "#....G....#", "#....#..S.#", "#..A.#....#", "#....#....#", "#....C....#", "#....####E#", "#....#...F#", "###########"], hint: "Das Siegel und der Schacht brauchen denselben Stein. \xDCberlege, welche Aufgabe du danach nicht mehr r\xFCckg\xE4ngig machen kannst \u2013 und auf welcher Seite du zum Umschalten stehen musst." }, { p: [2, 8], boxes: [[3, 6]] }, createReturnRules);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rooms
});
