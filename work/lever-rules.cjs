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

// outputs/nurbis-dungeons/src/lever-rules.js
var lever_rules_exports = {};
__export(lever_rules_exports, {
  createRules: () => createRules
});
module.exports = __toCommonJS(lever_rules_exports);
function createRules(workshop, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
  function initial() {
    return { p: [2, 7], boxes: [[4, 7]], off: false, moves: 0, won: false, flowers: [] };
  }
  function covered(s) {
    return s.boxes.some((b) => eq(b, [5, 4]));
  }
  function hot(s) {
    return !s.off && !covered(s);
  }
  function plate(s) {
    return s.boxes.some((b) => eq(b, [8, 8]));
  }
  function canUse(s) {
    return eq(s.p, s.off ? [8, 3] : [6, 3]) && !s.won;
  }
  function act(s, action) {
    if (s.won) return { state: null, reason: "Die Anlage ist entlastet und der K\xE4fer ist frei." };
    if (action === "valve") return { state: null, reason: "Betritt die Wippe von ihrer abgesenkten Seite." };
    const [dx, dy] = action;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return { state: null, reason: "Nur benachbarte Felder sind erreichbar." };
    const p = [s.p[0] + dx, s.p[1] + dy], at = (p2) => workshop.map[p2[1]]?.[p2[0]] ?? " ", blocked = (p2) => {
      const c = at(p2);
      return c === "#" || c === " " || c === "M" && !s.off || c === "G" && !plate(s);
    };
    if (at(s.p) === "A" && (dy !== 0 || dx !== (s.off ? 1 : -1))) return { state: null, reason: "Gehe \xFCber das jetzt abgesenkte Ende weiter. Die Wippe wird entlang ihrer Kippachse \xFCberquert." };
    if (at(p) === "A") {
      const enter = s.off ? -1 : 1;
      if (dy !== 0 || dx !== enter) return { state: null, reason: dy !== 0 ? "Die Seitenfassung ist geschlossen. Betritt die Wippe an ihrem abgesenkten Ende." : "Dieses Ende steht hoch. Suche den Weg zur abgesenkten Seite." };
      if (s.off && s.boxes.some((b) => at(b) === "M")) return { state: null, reason: "Ein Stein blockiert das Schiebewerk. Die Wippe l\xE4sst sich gerade nicht zur\xFCckschalten." };
      const exit = [p[0] + dx, p[1]], exitTile = at(exit), closing = !s.off;
      if (exitTile === "#" || exitTile === " " || exitTile === "A" || exitTile === "G" && !plate(s) || exitTile === "M" && !closing || s.boxes.some((b) => eq(b, exit))) return { state: null, reason: "Das andere Ende ist versperrt. Nurbi kann die Wippe nicht \xFCberqueren." };
      const n2 = structuredClone(s);
      n2.p = p;
      n2.off = !s.off;
      n2.moves++;
      return { state: n2, reason: n2.off ? "Nurbi betritt das tiefe Ende. Die Wippe kippt: Druck abgebaut, Schiebewerk offen. Gehe gerade dar\xFCber." : "Nurbi betritt das tiefe Ende. Die Wippe kippt zur\xFCck: Die Anlage steht wieder unter Druck. Gehe gerade dar\xFCber." };
    }
    if (blocked(p)) return { state: null, reason: at(p) === "M" ? "Das Schiebewerk steht unter Druck. \xDCberquere die Bodenwippe von ihrer abgesenkten Seite." : "Hier ist der Weg versperrt." };
    const n = structuredClone(s), bi = n.boxes.findIndex((b) => eq(b, p));
    if (bi >= 0) {
      const dest = [p[0] + dx, p[1] + dy];
      if (blocked(dest) || at(dest) === "A" || at(dest) === "F" || n.boxes.some((b) => eq(b, dest))) return { state: null, reason: "Der Stein l\xE4sst sich nicht weiter schieben." };
      n.boxes[bi] = dest;
    }
    if (at(p) === "H" && hot(n) || at(p) === "V" && !n.off) return { state: null, hazard: true, reason: "Hei\xDFer Dampf! Nurbi weicht zur\xFCck. Der Zug wurde nicht ausgef\xFChrt." };
    n.p = p;
    n.moves++;
    n.won = at(p) === "F";
    return { state: n, reason: n.won ? "Der K\xE4fer ist in Sicherheit." : n.off ? "Die Anlage ist drucklos. Nutze den Stein f\xFCr das Siegel." : covered(n) ? "\xD6ffnung abgedeckt. Der Dampfstrahl ist gestoppt." : "Die \xD6ffnung ist hei\xDF. Ein Stein kann sie verschlie\xDFen." };
  }
  const baseInitial = initial;
  return { initial: () => ({ ...baseInitial(), ...structuredClone(start), moves: 0, won: false }), act };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRules
});
