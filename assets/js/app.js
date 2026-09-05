/* app.js — el controlador: panell, estat a l'URL i render. */
(function (w, d) {
  'use strict';

  var SENTITS_ORDRE = ['numeric', 'algebraic', 'espacial', 'mesura', 'estocastic'];

  /* Els valors de fàbrica. Són la configuració real del departament, no un exemple:
     nivell 1, sense restes ni sumes (ja hi ha multiplicar i dividir), Part 2 curta
     i el repte del patró sencer. Si en vols uns altres, canvia'ls aquí. */
  var FABRICA = {
    nivell: 1,
    curs: '1r d\u2019ESO',
    data: '2026-27',
    part1: {
      xifres: { on: true, subs: 2 },
      resta: { on: false, subs: 2 },
      suma: { on: false, subs: 2 },
      multiplicacio: { on: true, subs: 2 },
      divisio: { on: true, subs: 2 },
      ordena: { on: true, subs: 1 },
      fraccio: { on: true, subs: 2 },
      percentatges: { on: true, subs: 3 },
      problema1: { on: true, subs: 1 },
      problema2: { on: false, subs: 1 },
      estimacio: { on: false, subs: 1 },
      escriptura: { on: false, subs: 1 }
    },
    part3: {
      patro: { on: true, subs: 4 },
      tarifes: { on: false, subs: 2 },
      coincidencies: { on: false, subs: 1 },
      probabilitat: { on: false, subs: 2 }
    },
    part2: { on: true, mode: 'auto', objectiu: 4, difMax: 2 },
    opcions: { portada: true, fitxa: true, mida: 85, base: 'https://prova1eso.step-quiz.net/' }
  };

  function ajust(taula, g) {
    var f = taula[g.id] || {};
    return {
      id: g.id,
      on: f.on !== undefined ? f.on : true,
      subs: Math.max(g.minSub, Math.min(g.maxSub, f.subs !== undefined ? f.subs : g.defSub)),
      nivell: 0
    };
  }

  function perDefecte() {
    return {
      codi: w.codiNou(),
      model: 'A',
      curs: FABRICA.curs,
      data: FABRICA.data,
      nivell: FABRICA.nivell,
      part1: w.GENERADORS.filter(function (g) { return g.part === 1; })
        .map(function (g) { return ajust(FABRICA.part1, g); }),
      part2: {
        on: FABRICA.part2.on, mode: FABRICA.part2.mode,
        objectiu: FABRICA.part2.objectiu, difMax: FABRICA.part2.difMax,
        sentits: SENTITS_ORDRE.slice(), tria: []
      },
      part3: w.GENERADORS.filter(function (g) { return g.part === 3; })
        .map(function (g) { return ajust(FABRICA.part3, g); }),
      opcions: {
        portada: FABRICA.opcions.portada, fitxa: FABRICA.opcions.fitxa,
        mida: FABRICA.opcions.mida, base: FABRICA.opcions.base
      },
      portada: w.FULL.portadaPerDefecte()
    };
  }

  var E = perDefecte();

  /* ------------------------------------------------------------ URL */
  function hashActual() {
    return '#' + btoa(unescape(encodeURIComponent(JSON.stringify(E))));
  }

  /* L'adreça que reprodueix aquesta prova. Si el fitxer s'obre des del disc
     (file://) no serveix de res, i fem servir l'adreça pública configurada. */
  function adreca() {
    if (location.protocol === 'file:') {
      var b = (E.opcions.base || 'https://prova1eso.step-quiz.net/').trim();
      return b.replace(/#.*$/, '').replace(/\/*$/, '/') + hashActual();
    }
    return location.origin + location.pathname + hashActual();
  }

  function desa() {
    try { location.replace(hashActual()); } catch (e) { /* res */ }
  }

  /* --------------------------------------- desar la prova en un fitxer */
  function fitxerDeLaProva() {
    var u = adreca();
    var titol = 'Prova inicial \u00b7 ' + E.curs + ' \u00b7 codi ' + E.codi + ' \u00b7 model ' + E.model;
    var avui = new Date().toLocaleDateString('ca-ES');
    return '<!DOCTYPE html>\n<html lang="ca"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + titol + '</title><style>' +
      'body{font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:#eceff2;margin:0;padding:40px 16px;color:#1a1a1a}' +
      'main{max-width:640px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 34px;' +
      'box-shadow:0 1px 6px rgba(0,0,0,.14)}' +
      'h1{color:#12507a;font-size:22px;margin:0 0 4px}' +
      '.sub{color:#5a5a5a;margin:0 0 22px}' +
      '.dades{background:#eef3f7;border-radius:7px;padding:12px 16px;margin:0 0 22px;font-size:15px}' +
      '.dades b{color:#12507a}' +
      'a.boto{display:inline-block;background:#12507a;color:#fff;text-decoration:none;font-weight:700;' +
      'padding:12px 22px;border-radius:7px}' +
      'a.boto:hover{background:#0e3f60}' +
      'textarea{width:100%;height:88px;margin-top:8px;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;' +
      'border:1px solid #c9d6e0;border-radius:6px;padding:8px;resize:vertical;color:#333}' +
      '.peu{color:#5a5a5a;font-size:13px;margin-top:22px}' +
      '</style></head><body><main>' +
      '<h1>Prova inicial de Matem\u00e0tiques</h1>' +
      '<p class="sub">' + E.curs + ' \u00b7 ' + E.data + '</p>' +
      '<div class="dades">codi <b>' + E.codi + '</b> \u00b7 model <b>' + E.model + '</b><br>' +
      'Aquesta adre\u00e7a torna a muntar exactament la mateixa prova: mateixes preguntes, ' +
      'mateixos nombres i el text de la portada tal com el vas deixar.</div>' +
      '<p><a class="boto" href="' + u + '">Obre la prova</a></p>' +
      '<p class="peu">Si l\u2019enlla\u00e7 no s\u2019obre, copia aquesta adre\u00e7a al navegador:</p>' +
      '<textarea readonly onclick="this.select()">' + u + '</textarea>' +
      '<p class="peu">Desat el ' + avui + '. Aquest fitxer nom\u00e9s guarda l\u2019adre\u00e7a; ' +
      'la prova es munta al navegador quan l\u2019obres.</p>' +
      '</main></body></html>';
  }

  function desaFitxer() {
    var b = new Blob([fitxerDeLaProva()], { type: 'text/html;charset=utf-8' });
    var a = d.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'prova-1eso-' + E.codi + '-model-' + E.model + '.html';
    d.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 2000);
  }
  function fusiona(base, o) {
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
    ['part1', 'part3'].forEach(function (par) {
      (o[par] || []).forEach(function (c) {
        base[par].forEach(function (b) {
          if (b.id === c.id) { b.on = c.on; b.subs = c.subs; b.nivell = c.nivell; }
        });
      });
    });
    return base;
  }

  /* els teus valors inicials, si te'ls has desat en aquest navegador */
  var CLAU = 'prova1eso.inicials';
  function desaInicials() { try { localStorage.setItem(CLAU, JSON.stringify(E)); } catch (e) { /* res */ } }
  function treuInicials() { try { localStorage.removeItem(CLAU); } catch (e) { /* res */ } }
  function llegeixInicials() {
    try { var x = localStorage.getItem(CLAU); return x ? JSON.parse(x) : null; } catch (e) { return null; }
  }

  function llegeix() {
    var base = perDefecte();
    var meus = llegeixInicials();
    if (meus) { base = fusiona(base, meus); base.codi = meus.codi ? w.codiNou() : base.codi; }
    if (location.hash && location.hash.length > 4) {
      try {
        var o = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1)))));
        if (o && o.codi) base = fusiona(base, o);
      } catch (e) { /* adreça malmesa: seguim amb el que tenim */ }
    }
    E = base;
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
      'El que posis entre claus \u2014 {codi}, {curs}, {data}, {preg1}\u2026 \u2014 se substitueix pel valor de cada moment.');
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
    var ba = el('input', 'txt'); ba.value = E.opcions.base || '';
    ba.title = 'On \u00e9s publicada aquesta eina. S\u2019utilitza per al bot\u00f3 «Desar la prova en PC local».';
    ba.addEventListener('change', function () { E.opcions.base = ba.value.trim(); pinta(); });
    g4.appendChild(fila('Adre\u00e7a p\u00fablica', ba));
    p.appendChild(g4);

    /* --- valors inicials */
    var g5 = bloc('Valors inicials',
      'Deixa-ho tot com t\u2019agrada i desa-ho: cada vegada que obris l\u2019eina en aquest navegador ' +
      'sortir\u00e0 aix\u00ed, amb un codi nou.');
    var bd = el('button', null, 'Desa aquests valors com a inicials');
    bd.addEventListener('click', function () {
      desaInicials();
      bd.textContent = 'Desat \u2713';
      setTimeout(function () { bd.textContent = 'Desa aquests valors com a inicials'; }, 1600);
    });
    g5.appendChild(fila('', bd));
    var rb = el('button', null, 'Torna als valors de f\u00e0brica');
    rb.addEventListener('click', function () { treuInicials(); E = perDefecte(); pinta(); });
    g5.appendChild(fila('', rb));
    p.appendChild(g5);
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
    d.getElementById('resum').innerHTML =
      '<b>' + doc.part1.length + '</b> preguntes obertes \u00b7 <b>' + doc.nPreg2 + '</b> de CB en ' +
      doc.part2.length + ' fulls \u00b7 <b>' + doc.part3.length + '</b> reptes';
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
    d.getElementById('desa-fitxer').addEventListener('click', desaFitxer);
    d.getElementById('veure').addEventListener('change', function () {
      d.getElementById('centre').className = this.value;
    });
    pinta();
  });
})(window, document);
