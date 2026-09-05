/* app.js — el controlador: panell, estat a l'URL i render. */
(function (w, d) {
  'use strict';

  var SENTITS_ORDRE = ['numeric', 'algebraic', 'espacial', 'mesura', 'estocastic'];

  function perDefecte() {
    return {
      codi: w.codiNou(),
      model: 'A',
      curs: '1r d\u2019ESO',
      data: '10 de setembre de 2026',
      nivell: 2,
      // per defecte, la selecció de la primera proposta: 9 preguntes
      part1: w.GENERADORS.filter(function (g) { return g.part === 1; }).map(function (g) {
        return { id: g.id, on: ['suma', 'problema1', 'estimacio'].indexOf(g.id) < 0, subs: g.defSub, nivell: 0 };
      }),
      part2: {
        on: true, mode: 'auto', objectiu: 19, difMax: 2,
        sentits: SENTITS_ORDRE.slice(), tria: []
      },
      part3: w.GENERADORS.filter(function (g) { return g.part === 3; }).map(function (g, i) {
        return { id: g.id, on: i < 2, subs: g.defSub, nivell: 0 };
      }),
      opcions: { portada: true, fitxa: true, mida: 85, min1: 12, min2: 30, min3: 10 },
      portada: w.FULL.portadaPerDefecte()
    };
  }

  var E = perDefecte();

  /* ------------------------------------------------------------ URL */
  function desa() {
    try {
      location.replace('#' + btoa(unescape(encodeURIComponent(JSON.stringify(E)))));
    } catch (e) { /* res */ }
  }
  function llegeix() {
    if (!location.hash || location.hash.length < 4) return;
    try {
      var o = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1)))));
      if (o && o.codi) {
        // fusiona amb els valors per defecte per si el catàleg ha canviat
        var base = perDefecte();
        ['codi', 'model', 'curs', 'data', 'nivell'].forEach(function (k) { if (o[k] !== undefined) base[k] = o[k]; });
        if (o.part2) Object.keys(o.part2).forEach(function (k) { base.part2[k] = o.part2[k]; });
        if (o.opcions) Object.keys(o.opcions).forEach(function (k) { base.opcions[k] = o.opcions[k]; });
        if (o.portada) {
          Object.keys(o.portada).forEach(function (k) {
            if (k === 'parts') {
              Object.keys(o.portada.parts || {}).forEach(function (r) {
                if (base.portada.parts[r]) Object.keys(o.portada.parts[r]).forEach(function (c) {
                  base.portada.parts[r][c] = o.portada.parts[r][c];
                });
              });
            } else { base.portada[k] = o.portada[k]; }
          });
        }
        [['part1', 'part1'], ['part3', 'part3']].forEach(function (par) {
          (o[par[0]] || []).forEach(function (c) {
            base[par[1]].forEach(function (b) { if (b.id === c.id) { b.on = c.on; b.subs = c.subs; b.nivell = c.nivell; } });
          });
        });
        E = base;
      }
    } catch (e) { /* res */ }
  }

  /* --------------------------------------------------------- widgets */
  function el(tag, cls, txt) {
    var x = d.createElement(tag);
    if (cls) x.className = cls;
    if (txt !== undefined) x.innerHTML = txt;
    return x;
  }

  function bloc(titol, sub) {
    var b = el('section', 'grup');
    b.appendChild(el('h3', null, titol));
    if (sub) b.appendChild(el('p', 'ajuda', sub));
    return b;
  }

  function fila(etiqueta, control) {
    var f = el('div', 'fila');
    f.appendChild(el('span', 'et', etiqueta));
    f.appendChild(control);
    return f;
  }

  function num(val, min, max, cb) {
    var i = el('input', 'num');
    i.type = 'number'; i.min = min; i.max = max; i.value = val;
    i.addEventListener('change', function () {
      var v = Math.max(min, Math.min(max, parseInt(i.value, 10) || min));
      i.value = v; cb(v); pinta();
    });
    return i;
  }

  function selNivell(val, cb, ambAuto) {
    var s = el('select', 'niv');
    if (ambAuto) s.appendChild(new Option('nivell general', '0', false, val === 0));
    [1, 2, 3].forEach(function (n) {
      s.appendChild(new Option('nivell ' + n, String(n), false, val === n));
    });
    s.addEventListener('change', function () { cb(parseInt(s.value, 10)); pinta(); });
    return s;
  }

  function check(text, on, cb) {
    var l = el('label', 'check');
    var i = el('input'); i.type = 'checkbox'; i.checked = on;
    i.addEventListener('change', function () { cb(i.checked); pinta(); });
    l.appendChild(i);
    l.appendChild(el('span', null, text));
    return l;
  }

  /* ---------------------------------------------------------- panell */
  function panell() {
    var p = d.getElementById('panell');
    p.innerHTML = '';

    /* --- capçalera: codi i model */
    var g0 = bloc('La prova', 'Mateix codi i mateix model = mateixa prova. Desa l\u2019adre\u00e7a i la recuperes.');
    var codi = el('input', 'codi'); codi.value = E.codi; codi.maxLength = 5;
    codi.addEventListener('change', function () { E.codi = w.netejaCodi(codi.value); pinta(); });
    g0.appendChild(fila('Codi', codi));

    var mod = el('select', 'niv');
    ['A', 'B', 'C'].forEach(function (m) { mod.appendChild(new Option('model ' + m, m, false, E.model === m)); });
    mod.addEventListener('change', function () { E.model = mod.value; pinta(); });
    g0.appendChild(fila('Model', mod));

    var b = el('button', 'sec', 'Altres nombres');
    b.title = 'Genera un codi nou: mateixa estructura, nombres diferents';
    b.addEventListener('click', function () { E.codi = w.codiNou(); pinta(); });
    g0.appendChild(fila('', b));

    g0.appendChild(fila('Nivell general', selNivell(E.nivell, function (v) { E.nivell = v || 2; })));

    var curs = el('input', 'txt'); curs.value = E.curs;
    curs.addEventListener('change', function () { E.curs = curs.value; pinta(); });
    g0.appendChild(fila('Curs', curs));
    var data = el('input', 'txt'); data.value = E.data;
    data.addEventListener('change', function () { E.data = data.value; pinta(); });
    g0.appendChild(fila('Data', data));
    p.appendChild(g0);

    /* --- Part 1 */
    var g1 = bloc('Part 1 \u00b7 c\u00e0lcul i escriptura',
      'Preguntes obertes generades. El nivell canvia els nombres: 1 amables \u00b7 2 amb portada i decimals \u00b7 3 amb zeros, decimals llargs i m\u00e9s passos.');
    E.part1.forEach(function (c) {
      var g = gen(c.id);
      var f = el('div', 'gen' + (c.on ? '' : ' off'));
      f.appendChild(check(g.titol, c.on, function (v) { c.on = v; }));
      var ctrl = el('div', 'ctrl');
      if (g.maxSub > 1) {
        ctrl.appendChild(el('span', 'mini', 'apartats'));
        ctrl.appendChild(num(c.subs, g.minSub, g.maxSub, function (v) { c.subs = v; }));
      }
      ctrl.appendChild(selNivell(c.nivell, function (v) { c.nivell = v; }, true));
      f.appendChild(ctrl);
      f.appendChild(el('p', 'destresa', g.destresa));
      g1.appendChild(f);
    });
    p.appendChild(g1);

    /* --- Part 2 */
    var g2 = bloc('Part 2 \u00b7 situacions (CB)',
      'S\u00f3n els fulls del PDF del departament. La unitat de tria \u00e9s el <b>full sencer</b>: la imatge no es pot partir, i per aix\u00f2 les preguntes que comparteixen p\u00e0gina entren juntes.');
    g2.appendChild(check('incloure la Part 2', E.part2.on, function (v) { E.part2.on = v; }));

    var mode = el('select', 'niv');
    mode.appendChild(new Option('tria autom\u00e0tica', 'auto', false, E.part2.mode === 'auto'));
    mode.appendChild(new Option('tria manual', 'manual', false, E.part2.mode === 'manual'));
    mode.addEventListener('change', function () { E.part2.mode = mode.value; pinta(); });
    g2.appendChild(fila('Tria', mode));

    if (E.part2.mode === 'auto') {
      g2.appendChild(fila('Preguntes (aprox.)', num(E.part2.objectiu, 4, 37, function (v) { E.part2.objectiu = v; })));
      var dm = el('select', 'niv');
      [[1, 'nom\u00e9s les accessibles (1)'], [2, 'fins a nivell 2'], [3, 'tot, inclòs 2n d\u2019ESO (3)']].forEach(function (o) {
        dm.appendChild(new Option(o[1], String(o[0]), false, E.part2.difMax === o[0]));
      });
      dm.addEventListener('change', function () { E.part2.difMax = parseInt(dm.value, 10); pinta(); });
      g2.appendChild(fila('Dificultat', dm));
      var sen = el('div', 'sentits');
      SENTITS_ORDRE.forEach(function (s) {
        sen.appendChild(check(w.CB.sentits[s], E.part2.sentits.indexOf(s) >= 0, function (v) {
          var i = E.part2.sentits.indexOf(s);
          if (v && i < 0) E.part2.sentits.push(s);
          if (!v && i >= 0) E.part2.sentits.splice(i, 1);
        }));
      });
      g2.appendChild(sen);
    } else {
      var llista = el('div', 'fulls');
      var blocActual = null;
      w.CB.fulls.forEach(function (f) {
        if (f.bloc !== blocActual) {
          blocActual = f.bloc;
          llista.appendChild(el('div', 'bloc-tit', 'Bloc ' + f.bloc + ' \u00b7 ' + f.act + ' <span class="any">' + f.any + '</span>'));
        }
        var txt = f.preg.length
          ? f.preg.map(function (q) { return 'p' + q.n; }).join(', ') + ' \u00b7 <span class="dif d' + f.difMax + '">dif ' + f.difMin + (f.difMin !== f.difMax ? '\u2013' + f.difMax : '') + '</span>'
          : '<i>context, sense preguntes</i>';
        var c = check('<b>Full ' + f.p + '</b> ' + txt, E.part2.tria.indexOf(f.p) >= 0, function (v) {
          var i = E.part2.tria.indexOf(f.p);
          if (v && i < 0) E.part2.tria.push(f.p);
          if (!v && i >= 0) E.part2.tria.splice(i, 1);
        });
        c.className = 'check full-check';
        llista.appendChild(c);
      });
      g2.appendChild(llista);
    }
    p.appendChild(g2);

    /* --- Part 3 */
    var g3 = bloc('Part 3 \u00b7 repte', 'El sostre. Al nivell 3 demana la generalitzaci\u00f3 amb una lletra.');
    E.part3.forEach(function (c) {
      var g = gen(c.id);
      var f = el('div', 'gen' + (c.on ? '' : ' off'));
      f.appendChild(check(g.titol, c.on, function (v) { c.on = v; }));
      var ctrl = el('div', 'ctrl');
      ctrl.appendChild(el('span', 'mini', 'apartats'));
      ctrl.appendChild(num(c.subs, g.minSub, g.maxSub, function (v) { c.subs = v; }));
      ctrl.appendChild(selNivell(c.nivell, function (v) { c.nivell = v; }, true));
      f.appendChild(ctrl);
      f.appendChild(el('p', 'destresa', g.destresa));
      g3.appendChild(f);
    });
    p.appendChild(g3);

    /* --- portada */
    var gp = bloc('Portada',
      'Tot el text de la portada s\u2019escriu <b>directament sobre el full</b>: clica-hi a sobre i reescriu-lo. ' +
      'El que posis entre claus \u2014 {codi}, {curs}, {preg1}, {min1}\u2026 \u2014 se substitueix pel valor de cada moment.');
    gp.appendChild(check('incloure la portada', E.opcions.portada, function (v) { E.opcions.portada = v; }));
    var rp = el('button', 'sec', 'Recupera el text original');
    rp.addEventListener('click', function () { E.portada = w.FULL.portadaPerDefecte(); pinta(); });
    gp.appendChild(fila('', rp));
    p.appendChild(gp);

    /* --- opcions */
    var g4 = bloc('El document');
    g4.appendChild(check('fitxa de respostes de la Part 2', E.opcions.fitxa, function (v) { E.opcions.fitxa = v; }));
    var md = el('select', 'niv');
    [[100, 'grans (100 %)'], [85, 'normals (85 %)'], [70, 'petits (70 %) — menys paper']].forEach(function (o) {
      md.appendChild(new Option(o[1], String(o[0]), false, E.opcions.mida === o[0]));
    });
    md.addEventListener('change', function () { E.opcions.mida = parseInt(md.value, 10); pinta(); });
    g4.appendChild(fila('Fulls de CB', md));
    g4.appendChild(fila('Minuts Part 1', num(E.opcions.min1, 0, 60, function (v) { E.opcions.min1 = v; })));
    g4.appendChild(fila('Minuts Part 2', num(E.opcions.min2, 0, 60, function (v) { E.opcions.min2 = v; })));
    g4.appendChild(fila('Minuts Part 3', num(E.opcions.min3, 0, 60, function (v) { E.opcions.min3 = v; })));
    var rb = el('button', 'sec', 'Torna als valors inicials');
    rb.addEventListener('click', function () { E = perDefecte(); pinta(); });
    g4.appendChild(fila('', rb));
    p.appendChild(g4);
  }

  function gen(id) {
    for (var i = 0; i < w.GENERADORS.length; i++) if (w.GENERADORS[i].id === id) return w.GENERADORS[i];
    return null;
  }

  /* ------------------------------------------- edició directa a la portada */

  /* de 'portada.parts.p1.nom' al lloc de l'estat que toca */
  function posaCami(cami, valor) {
    var t = cami.split('.'), o = E;
    for (var i = 0; i < t.length - 1; i++) o = o[t[i]];
    o[t[t.length - 1]] = valor;
  }

  /* del que enganxa el navegador només ens quedem negreta, cursiva i salt */
  function netejaHTML(html) {
    var caixa = d.createElement('div');
    caixa.innerHTML = html;
    var permes = { B: 1, I: 1, EM: 1, STRONG: 1, BR: 1 };
    for (var volta = 0; volta < 6; volta++) {
      var dolents = [];
      Array.prototype.forEach.call(caixa.querySelectorAll('*'), function (n) {
        if (!permes[n.tagName]) dolents.push(n);
        else { n.removeAttribute('style'); n.removeAttribute('class'); }
      });
      if (!dolents.length) break;
      dolents.forEach(function (n) {
        while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
        n.parentNode.removeChild(n);
      });
    }
    return caixa.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function editable() {
    var zona = d.getElementById('prova');

    Array.prototype.forEach.call(zona.querySelectorAll('.ed'), function (n) {
      n.contentEditable = 'true';
      n.spellcheck = true;

      n.addEventListener('paste', function (ev) {          // enganxar sempre en text pla
        ev.preventDefault();
        var t = (ev.clipboardData || w.clipboardData).getData('text');
        d.execCommand('insertText', false, t);
      });

      n.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); n.blur(); }
        if (ev.key === 'Escape') { n.blur(); }
      });

      n.addEventListener('blur', function () {
        var net = netejaHTML(n.innerHTML);
        n.innerHTML = net;
        posaCami(n.dataset.camp, net);
        desa();
      });
    });

    Array.prototype.forEach.call(zona.querySelectorAll('.ed-btn'), function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(b.dataset.i, 10);
        var P = E.portada;
        if (b.dataset.accio === 'avis-treu' && P.avisos.length > 1) P.avisos.splice(i, 1);
        if (b.dataset.accio === 'avis-afegeix') P.avisos.push('Escriu aqu\u00ed el teu av\u00eds.');
        if (b.dataset.accio === 'camp-treu' && P.camps.length > 1) P.camps.splice(i, 1);
        if (b.dataset.accio === 'camp-afegeix') P.camps.push('Camp nou');
        pinta();
      });
    });
  }

  /* ----------------------------------------------------------- render */
  function pinta() {
    var doc = w.composa(E);
    d.getElementById('prova').innerHTML = w.FULL.prova(E, doc);
    d.getElementById('clau').innerHTML = w.FULL.clau(E, doc);
    var t = (E.opcions.min1 * (doc.part1.length ? 1 : 0)) + (E.opcions.min2 * (doc.nPreg2 ? 1 : 0)) +
      (E.opcions.min3 * (doc.part3.length ? 1 : 0));
    d.getElementById('resum').innerHTML =
      '<b>' + doc.part1.length + '</b> preguntes obertes \u00b7 <b>' + doc.nPreg2 + '</b> de CB en ' +
      doc.part2.length + ' fulls \u00b7 <b>' + doc.part3.length + '</b> reptes \u00b7 ~<b>' + t + ' min</b>';
    panell();
    if (E.opcions.portada) editable();
    desa();
  }

  function imprimeix(quin) {
    d.body.className = 'imp-' + quin;
    w.print();
    setTimeout(function () { d.body.className = ''; }, 400);
  }

  d.addEventListener('DOMContentLoaded', function () {
    llegeix();
    d.getElementById('imp-prova').addEventListener('click', function () { imprimeix('prova'); });
    d.getElementById('imp-clau').addEventListener('click', function () { imprimeix('clau'); });
    d.getElementById('veure').addEventListener('change', function () {
      d.getElementById('centre').className = this.value;
    });
    pinta();
  });
})(window, document);
