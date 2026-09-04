/* generadors.js — les preguntes obertes, generades amb paràmetres.
   Cada generador rep un Atzar i un nivell (1, 2 o 3) i torna subapartats
   amb la seva solució. Cap solució s'escriu a mà: totes es calculen. */
(function (w) {
  'use strict';

  /* ---------------------------------------------------------- utilitats */

  var U = ['zero', 'un', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou',
    'deu', 'onze', 'dotze', 'tretze', 'catorze', 'quinze', 'setze', 'disset', 'divuit', 'dinou'];
  var D = ['', '', 'vint', 'trenta', 'quaranta', 'cinquanta', 'seixanta', 'setanta', 'vuitanta', 'noranta'];

  function fins999(n) {
    if (n < 20) return U[n];
    if (n < 100) {
      var d = Math.floor(n / 10), u = n % 10;
      if (d === 2) return u ? 'vint-i-' + U[u] : 'vint';
      return u ? D[d] + '-' + U[u] : D[d];
    }
    var c = Math.floor(n / 100), r = n % 100;
    var cap = c === 1 ? 'cent' : U[c] + '-cents';
    return r ? cap + ' ' + fins999(r) : cap;
  }

  /* nombre -> paraules, en català, fins a 999 999 */
  function lletres(n) {
    if (n === 0) return 'zero';
    var m = Math.floor(n / 1000), r = n % 1000, s = '';
    if (m) s = (m === 1 ? 'mil' : fins999(m) + ' mil');
    if (r) s += (s ? ' ' : '') + fins999(r);
    return s;
  }

  /* 1234567 -> "1 234 567" ; decimals amb coma */
  function fmt(x, dec) {
    if (dec === undefined) dec = 0;
    var neg = x < 0;
    x = Math.abs(x);
    var s = x.toFixed(dec);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
    return (neg ? '\u2212' : '') + p.join(',');
  }

  function mcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

  function frac(n, d) {
    var g = mcd(n, d);
    return { n: n / g, d: d / g, txt: (n / g) + '/' + (d / g) };
  }

  /* nombre de k xifres sense zeros al final */
  function xifres(r, k) {
    var n = r.enter(Math.pow(10, k - 1), Math.pow(10, k) - 1);
    return n % 10 === 0 ? n + r.enter(1, 9) : n;
  }

  var G = [];
  function reg(o) { G.push(o); return o; }

  /* ================================================== PART 1 · càlcul */

  reg({
    id: 'xifres', part: 1, titol: 'Xifres i lletres', sentit: 'numeric',
    destresa: 'Valor posicional: llegir i escriure nombres',
    minSub: 1, maxSub: 4, defSub: 2, espai: 'linia',
    cap: function () { return 'Escriu cada nombre com toca.'; },
    sub: function (r, niv, i) {
      var n;
      if (niv === 1) n = r.enter(1001, 9999);
      else if (niv === 2) n = r.enter(10001, 999999);
      else n = r.tria([r.enter(1, 9) * 100000 + r.enter(1, 99), r.enter(10, 99) * 10000 + r.enter(1, 999)]);
      if (i % 2 === 0) {
        return { txt: 'Escriu amb lletres: <b>' + fmt(n) + '</b>', sol: lletres(n) };
      }
      return { txt: 'Escriu amb xifres: <b>' + lletres(n) + '</b>', sol: fmt(n) };
    }
  });

  reg({
    id: 'resta', part: 1, titol: 'Restes', sentit: 'numeric',
    destresa: 'Resta amb portada',
    minSub: 1, maxSub: 6, defSub: 2, espai: 'graella', alt: 30,
    cap: function () { return 'Col\u00b7loca i calcula.'; },
    sub: function (r, niv) {
      var a, b;
      if (niv === 1) { // sense portar-ne
        var d = [], e = [];
        for (var k = 0; k < 3; k++) { var x = r.enter(k === 0 ? 3 : 1, 9); d.push(x); e.push(r.enter(0, x)); }
        a = d[0] * 100 + d[1] * 10 + d[2];
        b = e[0] * 100 + e[1] * 10 + e[2];
        if (b < 100) b += 100;
      } else if (niv === 2) { // amb portada garantida a les unitats
        a = r.enter(320, 980);
        var ua = a % 10;
        var ub = r.enter(ua + 1, 9);
        b = r.enter(14, Math.floor(a / 10) - 6) * 10 + ub;
      } else { // zeros al mig
        a = r.tria([r.enter(1, 9) * 1000, r.enter(2, 9) * 100, r.enter(1, 9) * 1000 + r.enter(1, 9)]);
        b = r.enter(Math.floor(a / 3), a - 20);
      }
      return { txt: fmt(a) + ' \u2212 ' + fmt(b), sol: fmt(a - b) };
    }
  });

  reg({
    id: 'suma', part: 1, titol: 'Sumes', sentit: 'numeric',
    destresa: 'Suma; alinear la coma dels decimals',
    minSub: 1, maxSub: 6, defSub: 2, espai: 'graella', alt: 30,
    cap: function () { return 'Col\u00b7loca i calcula.'; },
    sub: function (r, niv) {
      if (niv === 1) {
        var a = r.enter(125, 899), b = r.enter(125, 899);
        return { txt: fmt(a) + ' + ' + fmt(b), sol: fmt(a + b) };
      }
      if (niv === 2) { // mateixos decimals
        var c = r.enter(125, 980), d = r.enter(125, 980);
        return { txt: fmt(c / 100, 2) + ' + ' + fmt(d / 100, 2), sol: fmt((c + d) / 100, 2) };
      }
      // decimals de longitud diferent + un enter
      var x = r.enter(5, 40) * 10, y = r.enter(105, 995), z = r.enter(2, 19);
      return {
        txt: fmt(x / 100, 1) + ' + ' + fmt(y / 100, 2) + ' + ' + fmt(z),
        sol: fmt((x + y + z * 100) / 100, 2)
      };
    }
  });

  reg({
    id: 'multiplicacio', part: 1, titol: 'Multiplicacions', sentit: 'numeric',
    destresa: 'Multiplicació amb portades',
    minSub: 1, maxSub: 6, defSub: 2, espai: 'graella', alt: 32,
    cap: function () { return 'Col\u00b7loca i calcula.'; },
    sub: function (r, niv) {
      if (niv === 1) { var a = r.enter(13, 49), b = r.enter(3, 9); return { txt: fmt(a) + ' \u00d7 ' + fmt(b), sol: fmt(a * b) }; }
      if (niv === 2) { var c = xifres(r, 3), d = r.enter(4, 9); return { txt: fmt(c) + ' \u00d7 ' + fmt(d), sol: fmt(c * d) }; }
      if (r.real() < 0.5) { var e = xifres(r, 3), f = r.enter(12, 49); return { txt: fmt(e) + ' \u00d7 ' + fmt(f), sol: fmt(e * f) }; }
      var g = r.enter(125, 985), h = r.enter(3, 9);
      return { txt: fmt(g / 100, 2) + ' \u00d7 ' + fmt(h), sol: fmt(g * h / 100, 2) };
    }
  });

  reg({
    id: 'divisio', part: 1, titol: 'Divisions', sentit: 'numeric',
    destresa: 'Divisió',
    minSub: 1, maxSub: 6, defSub: 2, espai: 'graella', alt: 34,
    cap: function () { return 'Calcula. Si la divisi\u00f3 no \u00e9s exacta, escriu el residu.'; },
    sub: function (r, niv) {
      if (niv === 1) { var q = r.enter(21, 98), d = r.enter(2, 9); return { txt: fmt(q * d) + ' : ' + fmt(d), sol: fmt(q) + ' (exacta)' }; }
      if (niv === 2) {
        var q2 = r.enter(31, 199), d2 = r.enter(3, 9), rr = r.enter(1, d2 - 1);
        return { txt: fmt(q2 * d2 + rr) + ' : ' + fmt(d2), sol: 'quocient ' + fmt(q2) + ', residu ' + fmt(rr) };
      }
      var q3 = r.enter(12, 89), d3 = r.enter(12, 39), r3 = r.enter(1, d3 - 1);
      return { txt: fmt(q3 * d3 + r3) + ' : ' + fmt(d3), sol: 'quocient ' + fmt(q3) + ', residu ' + fmt(r3) };
    }
  });

  reg({
    id: 'ordena', part: 1, titol: 'Ordenar nombres', sentit: 'numeric',
    destresa: 'Comparar i ordenar decimals',
    minSub: 1, maxSub: 3, defSub: 1, espai: 'caixes',
    cap: function () { return 'Ordena de m\u00e9s petit a m\u00e9s gran.'; },
    sub: function (r, niv) {
      var v = [], t = [];
      if (niv === 1) { // mateixa part entera, 1-2 decimals
        while (v.length < 4) { var a = r.enter(5, 95) / 100; if (v.indexOf(a) < 0) v.push(a); }
        t = v.map(function (x) { return fmt(x, 2).replace(/,?0+$/, function (m) { return m === ',00' ? '' : m; }); });
        t = v.map(function (x) { return fmt(x, x * 10 % 1 === 0 ? 1 : 2); });
      } else if (niv === 2) {
        while (v.length < 4) { var b = r.enter(5, 190) / 100; if (v.indexOf(b) < 0) v.push(b); }
        t = v.map(function (x) { return fmt(x, r.real() < 0.5 && x * 10 % 1 === 0 ? 1 : 2); });
      } else {
        var f = r.tria([[1, 2], [3, 4], [1, 4], [2, 5]]);
        v = [r.enter(5, 95) / 100, r.enter(105, 190) / 100, f[0] / f[1], r.enter(20, 80) / 100];
        t = [fmt(v[0], 2), fmt(v[1], 2), f[0] + '/' + f[1], fmt(v[3] * 100) + ' %'];
        v[3] = v[3];
      }
      var idx = v.map(function (x, i) { return i; }).sort(function (a, b) { return v[a] - v[b]; });
      return {
        txt: t.join('&nbsp;&nbsp;\u00b7&nbsp;&nbsp;'),
        sol: idx.map(function (i) { return t[i]; }).join(' < '),
        caixes: 4
      };
    }
  });

  reg({
    id: 'fraccio', part: 1, titol: 'Fraccions d\u2019una figura', sentit: 'numeric',
    destresa: 'Llegir una fracció en una representació',
    minSub: 1, maxSub: 3, defSub: 1, espai: 'figura',
    cap: function (niv) {
      return niv < 3 ? 'Quina fracci\u00f3 de la figura est\u00e0 pintada?'
        : 'Quina fracci\u00f3 est\u00e0 pintada? Escriu-la tamb\u00e9 simplificada i en tant per cent.';
    },
    sub: function (r, niv) {
      var n = niv === 1 ? r.tria([4, 8]) : niv === 2 ? r.tria([6, 10, 12]) : r.tria([8, 10, 12, 16]);
      var k = r.enter(1, n - 1);
      var f = frac(k, n);
      var sol = k + '/' + n;
      if (niv === 3) sol += ' = ' + f.txt + ' = ' + fmt(k * 100 / n, (k * 100 / n) % 1 ? 1 : 0) + ' %';
      return { txt: '', sol: sol, figura: { tipus: 'barra', parts: n, pintades: k } };
    }
  });

  reg({
    id: 'percentatges', part: 1, titol: 'C\u00e0lcul mental amb percentatges', sentit: 'numeric',
    destresa: 'Meitat, 10 %, 25 %, 50 %',
    minSub: 2, maxSub: 5, defSub: 3, espai: 'caixes',
    cap: function () { return 'Completa mentalment.'; },
    sub: function (r, niv, i) {
      var base, dem;
      if (niv === 1) { base = r.enter(4, 30) * 10; dem = ['la meitat de', 'el 10 % de', 'el 50 % de'][i % 3]; }
      else if (niv === 2) { base = r.enter(5, 40) * 4; dem = ['el 25 % de', 'el 10 % de', 'el 75 % de', 'la meitat de'][i % 4]; }
      else { base = r.enter(24, 480); dem = ['el 25 % de', 'el 20 % de', 'el 5 % de', 'el 75 % de'][i % 4]; }
      var f = { 'la meitat de': 0.5, 'el 10 % de': 0.1, 'el 50 % de': 0.5, 'el 25 % de': 0.25, 'el 75 % de': 0.75, 'el 20 % de': 0.2, 'el 5 % de': 0.05 }[dem];
      var v = base * f;
      return { txt: dem + ' <b>' + fmt(base) + '</b> \u00e9s', sol: fmt(v, v % 1 ? 2 : 0) };
    }
  });

  var NOMS = ['la Jana', 'en Pol', 'la N\u00faria', 'en Marc', 'la Laia', 'en Bilal', 'la Fatima', 'en Youssef', 'la Rita', 'en Genís'];

  reg({
    id: 'problema1', part: 1, titol: 'Problema d\u2019un pas', sentit: 'numeric',
    destresa: 'Triar l\u2019operació en un context',
    minSub: 1, maxSub: 2, defSub: 1, espai: 'graella', alt: 26,
    cap: function () { return 'Resol. Escriu l\u2019operaci\u00f3 que fas servir.'; },
    sub: function (r, niv) {
      var nom = r.tria(NOMS);
      var t = r.enter(0, 2);
      if (t === 0) {
        var k = r.tria([4, 6, 8, 10]), u = r.enter(35, 180);
        var tot = k * u;
        return {
          txt: 'Un paquet de ' + k + ' llapis costa ' + fmt(tot / 100, 2) + ' \u20ac. Quant costa <b>un</b> llapis?',
          sol: fmt(tot / 100, 2) + ' : ' + k + ' = ' + fmt(u / 100, 2) + ' \u20ac'
        };
      }
      if (t === 1) {
        var c = r.enter(niv === 1 ? 6 : 12, niv === 1 ? 15 : 48), m = r.enter(niv === 1 ? 6 : 12, 30);
        return {
          txt: 'A la biblioteca hi ha ' + c + ' prestatges amb ' + m + ' llibres cada un. Quants llibres hi ha?',
          sol: c + ' \u00d7 ' + m + ' = ' + fmt(c * m) + ' llibres'
        };
      }
      var tot2 = r.enter(niv === 1 ? 40 : 120, niv === 1 ? 96 : 400), g = r.tria([4, 5, 6, 8]);
      var q = Math.floor(tot2 / g), res = tot2 % g;
      return {
        txt: nom.charAt(0).toUpperCase() + nom.slice(1) + ' reparteix ' + tot2 + ' cromos entre ' + g +
          ' amics, a parts iguals. Quants en toquen a cada un? En sobra algun?',
        sol: fmt(tot2) + ' : ' + g + ' = ' + q + (res ? ', i en sobren ' + res : ', exacta')
      };
    }
  });

  reg({
    id: 'problema2', part: 1, titol: 'Problema de dos passos', sentit: 'numeric',
    destresa: 'Encadenar dues operacions',
    minSub: 1, maxSub: 2, defSub: 1, espai: 'graella', alt: 32,
    cap: function () { return 'Resol. Escriu totes les operacions.'; },
    sub: function (r, niv) {
      var t = r.enter(0, 2);
      if (t === 0) {
        var a = r.enter(2, 4), p = r.tria([50, 54, 55, 60]);
        var places = a * p, ins = places - r.enter(niv === 1 ? 10 : 3, niv === 1 ? 40 : 29);
        return {
          txt: 'En una excursi\u00f3 hi ha ' + a + ' autocars de ' + p + ' places cada un. S\u2019hi apunten ' +
            ins + ' alumnes. Quantes places queden lliures?',
          sol: a + ' \u00d7 ' + p + ' = ' + places + ' places; ' + places + ' \u2212 ' + ins + ' = ' + (places - ins) + ' lliures'
        };
      }
      if (t === 1) {
        var n1 = r.enter(2, 5), c1 = r.enter(120, 480), n2 = r.enter(2, 4), c2 = r.enter(150, 620);
        var tot = n1 * c1 + n2 * c2, bit = Math.ceil(tot / 500) * 500;
        return {
          txt: r.tria(NOMS) + ' compra ' + n1 + ' entrepans de ' + fmt(c1 / 100, 2) + ' \u20ac i ' + n2 +
            ' begudes de ' + fmt(c2 / 100, 2) + ' \u20ac. Paga amb ' + fmt(bit / 100, 2) + ' \u20ac. Quant li tornen?',
          sol: 'total ' + fmt(tot / 100, 2) + ' \u20ac; canvi ' + fmt((bit - tot) / 100, 2) + ' \u20ac'
        };
      }
      var L = r.enter(niv === 1 ? 20 : 40, niv === 1 ? 60 : 150), gasta = r.enter(5, Math.floor(L / 3));
      var k = r.tria([4, 5, 6]);
      var resta = L - gasta;
      return {
        txt: 'Tenim una cinta de ' + L + ' m. En fem servir ' + gasta + ' m i la resta la tallem en ' + k +
          ' trossos iguals. Quant fa cada tros?',
        sol: L + ' \u2212 ' + gasta + ' = ' + resta + ' m; ' + resta + ' : ' + k + ' = ' +
          fmt(resta / k, (resta % k) ? 2 : 0) + ' m'
      };
    }
  });

  reg({
    id: 'estimacio', part: 1, titol: 'Estimaci\u00f3', sentit: 'numeric',
    destresa: 'Arrodonir i estimar sense calcular',
    minSub: 1, maxSub: 3, defSub: 1, espai: 'caixes',
    cap: function () { return '<b>Sense calcular-ho exactament</b>, digues aproximadament quant fa.'; },
    sub: function (r, niv) {
      if (niv === 1) { var a = r.enter(180, 490), b = r.enter(180, 490); return { txt: fmt(a) + ' + ' + fmt(b), sol: '\u2248 ' + fmt(Math.round((a + b) / 100) * 100) }; }
      if (niv === 2) { var c = r.enter(1900, 4900), d = r.enter(900, 2900); return { txt: fmt(c) + ' + ' + fmt(d), sol: '\u2248 ' + fmt(Math.round((c + d) / 500) * 500) }; }
      var e = r.enter(19, 49), f = r.enter(19, 99);
      return { txt: fmt(e) + ' \u00d7 ' + fmt(f), sol: '\u2248 ' + fmt(Math.round(e / 10) * 10 * Math.round(f / 10) * 10) + ' (exacte: ' + fmt(e * f) + ')' };
    }
  });

  reg({
    id: 'escriptura', part: 1, titol: 'Explica-ho', sentit: 'lectora',
    destresa: 'Escriptura: explicar un procediment',
    minSub: 1, maxSub: 1, defSub: 1, espai: 'ratlles', alt: 4,
    cap: function () { return ''; },
    sub: function (r, niv) {
      return {
        txt: r.tria([
          'Explica amb les teves paraules com has resolt el problema anterior.',
          'Un company diu que no sap per on comen\u00e7ar el problema anterior. Escriu-li qu\u00e8 ha de fer, pas a pas.',
          'Explica com ho has fet per estar segur o segura que el resultat del problema anterior est\u00e0 b\u00e9.'
        ]),
        sol: 'Es valora: que hi hagi frases completes, que expliqui l\u2019ordre dels passos i que faci servir '
          + 'les paraules de l\u2019enunciat. Fixa\u2019t tamb\u00e9 en la lletra, les maj\u00fascules i l\u2019ortografia.'
      };
    }
  });

  /* ==================================================== PART 3 · reptes */

  reg({
    id: 'patro', part: 3, titol: 'Patr\u00f3 de figures', sentit: 'algebraic',
    destresa: 'Generalitzar un patró lineal',
    minSub: 2, maxSub: 4, defSub: 3, espai: 'ratlles', alt: 3,
    cap: function () { return 'Amb escuradents fem la seq\u00fc\u00e8ncia de figures seg\u00fcent:'; },
    figuraCap: true,
    sub: function (r, niv, i, ctx) {
      var f = ctx.fam, a = f.a, b = f.b;
      var demandes = [
        function () { var k = r.enter(5, 8); return { txt: 'Quants escuradents necessitem per fer <b>' + k + ' ' + f.plural + '</b>?', sol: a + '\u00b7' + k + ' + ' + b + ' = ' + (a * k + b) }; },
        function () { var k = r.tria([20, 25, 30, 50]); return { txt: 'I per fer <b>' + k + ' ' + f.plural + '</b>? Explica com ho has pensat <b>sense dibuixar-los tots</b>.', sol: a + '\u00b7' + k + ' + ' + b + ' = ' + (a * k + b) }; },
        function () { return { txt: 'Si en fem <b>n</b>, quants escuradents necessitem? Escriu-ho amb una expressi\u00f3.', sol: a + '\u00b7n + ' + b + ' (o equivalent)' }; },
        function () { var k = r.enter(8, 20), tot = a * k + b; return { txt: 'Tenim <b>' + tot + '</b> escuradents i els fem servir tots. Quantes figures surten?', sol: '(' + tot + ' \u2212 ' + b + ') : ' + a + ' = ' + k }; }
      ];
      var ordre = niv === 1 ? [0, 0, 1, 3] : niv === 2 ? [0, 1, 2, 3] : [1, 2, 3, 2];
      return demandes[ordre[i % 4]]();
    },
    context: function (r, niv) {
      var fams = [
        { id: 'quadrats', a: 3, b: 1, plural: 'quadrats' },
        { id: 'triangles', a: 2, b: 1, plural: 'triangles' }
      ];
      return { fam: niv === 1 ? fams[0] : r.tria(fams) };
    }
  });

  reg({
    id: 'tarifes', part: 3, titol: 'Dues tarifes', sentit: 'numeric',
    destresa: 'Comparar dues opcions i trobar el llindar',
    minSub: 1, maxSub: 3, defSub: 2, espai: 'graella', alt: 26,
    cap: function (niv, ctx) {
      return 'A la piscina municipal, l\u2019entrada val <b>' + fmt(ctx.p / 100, 2) + ' \u20ac</b>. Tamb\u00e9 hi ha un ' +
        '<b>abonament de ' + ctx.k + ' banys per ' + fmt(ctx.q / 100, 2) + ' \u20ac</b>.';
    },
    context: function (r, niv) {
      var p = r.tria([350, 375, 400, 450, 500]);
      var k = r.tria([8, 10, 12]);
      var q = Math.round((p * k * r.enter(72, 88) / 100) / 50) * 50;
      if (q % p === 0) q += 25;            // que el llindar mai no quedi just a la vora
      var llindar = Math.floor(q / p) + 1;
      var m = Math.max(2, llindar - r.enter(1, 3));
      return { p: p, k: k, q: q, llindar: llindar, m: m };
    },
    sub: function (r, niv, i, ctx) {
      var nom = r.tria(NOMS);
      if (i === 0) {
        return {
          txt: nom.charAt(0).toUpperCase() + nom.slice(1) + ' hi anir\u00e0 <b>' + ctx.m + '</b> vegades. Qu\u00e8 li conv\u00e9 m\u00e9s, ' +
            'pagar cada entrada o comprar l\u2019abonament? Escriu els c\u00e0lculs.',
          sol: ctx.m + ' \u00d7 ' + fmt(ctx.p / 100, 2) + ' = ' + fmt(ctx.m * ctx.p / 100, 2) + ' \u20ac, ' +
            (ctx.m * ctx.p < ctx.q ? 'menys que ' : 'm\u00e9s que ') + fmt(ctx.q / 100, 2) + ' \u20ac \u2192 ' +
            (ctx.m * ctx.p < ctx.q ? 'li conv\u00e9 pagar entrades' : 'li conv\u00e9 l\u2019abonament')
        };
      }
      if (i === 1) {
        return {
          txt: 'A partir de quantes vegades li conv\u00e9 l\u2019abonament? Explica-ho.',
          sol: 'a partir de ' + ctx.llindar + ' vegades (' + (ctx.llindar - 1) + ' \u00d7 ' + fmt(ctx.p / 100, 2) + ' = ' +
            fmt((ctx.llindar - 1) * ctx.p / 100, 2) + ' \u20ac < ' + fmt(ctx.q / 100, 2) + ' \u20ac \u2264 ' +
            fmt(ctx.llindar * ctx.p / 100, 2) + ' \u20ac)'
        };
      }
      return {
        txt: 'Si l\u2019abonament valgu\u00e9s ' + fmt((ctx.q + 400) / 100, 2) + ' \u20ac, a partir de quantes vegades convindria?',
        sol: 'a partir de ' + (Math.floor((ctx.q + 400) / ctx.p) + 1) + ' vegades'
      };
    }
  });

  reg({
    id: 'coincidencies', part: 3, titol: 'Coincid\u00e8ncies', sentit: 'numeric',
    destresa: 'Múltiples comuns en context',
    minSub: 1, maxSub: 2, defSub: 1, espai: 'graella', alt: 26,
    cap: function () { return ''; },
    sub: function (r, niv, i) {
      var a = r.tria([4, 6, 8]), b = r.tria([9, 10, 12, 15]);
      if (niv === 1) { a = r.tria([2, 3, 4]); b = r.tria([5, 6]); }
      var m = a * b / mcd(a, b);
      if (i === 0) {
        return {
          txt: 'D\u2019una parada surt un autob\u00fas cap al centre cada <b>' + a + ' minuts</b> i un altre cap a l\u2019estaci\u00f3 cada ' +
            '<b>' + b + ' minuts</b>. A les 8:00 surten tots dos alhora. A quina hora tornaran a coincidir? ' +
            'Explica com ho has trobat.',
          sol: 'cada ' + m + ' minuts \u2192 a les ' + (8 + Math.floor(m / 60)) + ':' + ('0' + (m % 60)).slice(-2)
        };
      }
      return { txt: 'Quantes vegades coincidiran entre les 8:00 i les 10:00?', sol: Math.floor(120 / m) + ' vegades' };
    }
  });

  reg({
    id: 'probabilitat', part: 3, titol: 'Atzar', sentit: 'estocastic',
    destresa: 'Probabilitat senzilla i raonament',
    minSub: 1, maxSub: 3, defSub: 2, espai: 'ratlles', alt: 3,
    cap: function (niv, ctx) {
      return 'En una bossa hi ha <b>' + ctx.v + ' boles verdes</b>, <b>' + ctx.b + ' de blaves</b> i <b>' + ctx.g + ' de grogues</b>. ' +
        'En traiem una sense mirar.';
    },
    context: function (r, niv) {
      var v = r.enter(2, 6), b = r.enter(2, 6), g = r.enter(1, 5);
      return { v: v, b: b, g: g, t: v + b + g };
    },
    sub: function (r, niv, i, ctx) {
      if (i === 0) return { txt: 'Quina probabilitat hi ha que sigui verda? Escriu-ho com a fracci\u00f3.', sol: frac(ctx.v, ctx.t).txt };
      if (i === 1) return { txt: 'Quin color \u00e9s m\u00e9s prob{able} de treure? Per qu\u00e8?'.replace('{able}', 'able'), sol: (ctx.v >= ctx.b && ctx.v >= ctx.g ? 'verda' : (ctx.b >= ctx.g ? 'blava' : 'groga')) + ' (n\u2019hi ha m\u00e9s)' };
      return {
        txt: 'Quantes boles grogues hi hauríem d\u2019afegir perqu\u00e8 la meitat de les boles fossin grogues?',
        sol: (ctx.v + ctx.b - ctx.g) + ' boles grogues'
      };
    }
  });

  w.GENERADORS = G;
  w.gUtils = { lletres: lletres, fmt: fmt, frac: frac, mcd: mcd };
})(window);
