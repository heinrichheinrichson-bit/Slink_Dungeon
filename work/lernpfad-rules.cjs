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

// work/lernpfad-rules-entry.js
var lernpfad_rules_entry_exports = {};
__export(lernpfad_rules_entry_exports, {
  createFractureRescueRules: () => createFractureRescueRules,
  createRescueRules: () => createRescueRules,
  createSwitchRescueRules: () => createSwitchRescueRules,
  createWaterRescueRules: () => createWaterRescueRules
});
module.exports = __toCommonJS(lernpfad_rules_entry_exports);

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
    if (c === "G" && !ready(s)) return { reason: "Alle Druckplatten m\xFCssen belegt sein, damit das Ausgangsgitter offen bleibt." };
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

// outputs/nurbis-dungeons/src/switch-rescue-rules.js
function createSwitchRescueRules(level, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level.map.forEach((row, y) => [...row].forEach((c, x) => {
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
    if (blocked(s, p)) return { reason: ["G", "E"].includes(c) ? "Dieser Durchgang wird von der Wippe bedient." : c === "D" ? "Alle Druckplatten m\xFCssen den Ausgang offenhalten." : "Hier ist eine Wand." };
    if (c === "O") {
      if (!s.rescued || !ready(s)) return { reason: "Hole den Freund dazu und belege alle Druckplatten." };
      const friendPath = path(s, level.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Die Wippe kann auf dem Fluchtweg nicht einfach \xFCbergangen werden." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level.outside];
      n2.nurbiRoute = [...nurbiPath, level.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level.outside;
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
function createFractureRescueRules(level, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level.map.forEach((row, y) => [...row].forEach((c, x) => {
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
      const friendPath = path(s, level.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der Weg ist noch nicht f\xFCr euch beide frei. Der offene Schacht bleibt unpassierbar." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level.outside];
      n2.nurbiRoute = [...nurbiPath, level.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level.outside;
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

// outputs/nurbis-dungeons/src/water-rescue-rules.js
function createWaterRescueRules(level, start) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1], tile = (p) => level.map[p[1]]?.[p[0]] ?? "#", dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], seals = [];
  level.map.forEach((row, y) => [...row].forEach((c, x) => {
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
    if (blocked(s, p)) return { reason: wet(s, p) ? "Das Becken ist geflutet. Lege es mit der Wippe trocken." : c === "G" ? "Alle Druckplatten m\xFCssen den Ausgang offenhalten." : "Hier ist eine Wand." };
    if (c === "O") {
      if (!s.rescued || !ready(s)) return { reason: "Hole den Freund dazu und belege alle Druckplatten." };
      const friendPath = path(s, level.friend, p), nurbiPath = path(s, s.p, p);
      if (!friendPath || !nurbiPath) return { reason: "Der gemeinsame R\xFCckweg ist noch versperrt. Beide brauchen ein trockenes Becken oder einen Weg \xFCber festen Boden." };
      const n2 = structuredClone(s);
      n2.escapeRoute = [...friendPath, level.outside];
      n2.nurbiRoute = [...nurbiPath, level.outside];
      n2.escapeDuration = Math.max(n2.escapeRoute.length, n2.nurbiRoute.length) * 0.22 + 0.35;
      n2.p = level.outside;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFractureRescueRules,
  createRescueRules,
  createSwitchRescueRules,
  createWaterRescueRules
});
