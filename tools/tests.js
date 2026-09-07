/* tests.js — comprova la lògica sense navegador:  node tools/tests.js
   Mira les tres coses que fan mal en paper: que les solucions siguin correctes,
   que la tria de fulls arrossegui els contextos, i que el mateix codi doni sempre
   la mateixa prova. */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');

var arrel = path.join(__dirname, '..');
var w = {};
var ctx = vm.createContext({ window: w, Math: Math, Object: Object, Option: function () {}, console: console });
['atzar', 'generadors', 'cb', 'composa', 'full'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(arrel, 'assets/js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
});

var ok = 0, ko = 0;
function comprova(nom, cond) {
  if (cond) { ok++; } else { ko++; console.log('  FALLA: ' + nom); }
}

function estatBase() {
  return {
    codi: 'K7M2P', model: 'A', curs: '1r ESO', data: '10-09-2026', nivell: 2,
    part1: w.GENERADORS.filter(function (g) { return g.part === 1; })
      .map(function (g) { return { id: g.id, on: true, subs: g.defSub, nivell: 0, varia: [], variaCap: 0 }; }),
    part2: { on: true, mode: 'auto', objectiu: 19, difMax: 2, sentits: ['numeric', 'algebraic', 'espacial', 'mesura', 'estocastic'], tria: [] },
    part3: w.GENERADORS.filter(function (g) { return g.part === 3; })
      .map(function (g, i) { return { id: g.id, on: i < 2, subs: g.defSub, nivell: 0, varia: [], variaCap: 0 }; }),
    opcions: { portada: true, fitxa: true, pagBlanca: false, mida: 85, base: 'https://exemple.net/' },
    portada: w.FULL.portadaPerDefecte()
  };
}

/* 1. tots els generadors funcionen als tres nivells i donen solució */
console.log('generadors');
w.GENERADORS.forEach(function (g) {
  [1, 2, 3].forEach(function (niv) {
    var r = new w.Atzar('PROVA|' + g.id + '|' + niv);
    var c = g.context ? g.context(r, niv) : {};
    for (var i = 0; i < g.maxSub; i++) {
      var s = g.sub(r, niv, i, c);
      comprova(g.id + ' N' + niv + ' sub' + i + ' t\u00e9 enunciat', typeof s.txt === 'string');
      comprova(g.id + ' N' + niv + ' sub' + i + ' t\u00e9 soluci\u00f3', s.sol !== undefined && s.sol !== '' && !/NaN|undefined/.test(String(s.sol)));
    }
  });
});

/* 2. l'aritmètica de les solucions quadra */
console.log('aritm\u00e8tica');
function valor(t) { return parseFloat(String(t).replace(/\u202f/g, '').replace(/\u2212/g, '-').replace(',', '.')); }
['resta', 'suma', 'multiplicacio'].forEach(function (id) {
  var g = w.GENERADORS.filter(function (x) { return x.id === id; })[0];
  for (var k = 0; k < 300; k++) {
    var r = new w.Atzar('X' + k);
    var niv = (k % 3) + 1;
    var s = g.sub(r, niv, 0, {});
    var m = s.txt.split(/\s[+\u2212\u00d7]\s/).map(valor);
    var esperat = id === 'resta' ? m[0] - m[1]
      : id === 'suma' ? m.reduce(function (a, b) { return a + b; }, 0)
        : m[0] * m[1];
    comprova(id + ' k=' + k + ' (' + s.txt + ' = ' + s.sol + ')', Math.abs(valor(s.sol) - esperat) < 0.005);
  }
});

/* 3. lletres */
console.log('nombres en lletres');
var L = w.gUtils.lletres;
[[7, 'set'], [16, 'setze'], [21, 'vint-i-un'], [35, 'trenta-cinc'], [100, 'cent'], [101, 'cent un'],
 [207, 'dos-cents set'], [1000, 'mil'], [3207, 'tres mil dos-cents set'], [4050, 'quatre mil cinquanta'],
 [21000, 'vint-i-un mil'], [234567, 'dos-cents trenta-quatre mil cinc-cents seixanta-set']]
  .forEach(function (p) { comprova('lletres(' + p[0] + ') = ' + L(p[0]), L(p[0]) === p[1]); });

/* 4. el catàleg de CB */
console.log('cat\u00e0leg CB');
var nPreg = 0;
w.CB.fulls.forEach(function (f) {
  nPreg += f.preg.length;
  comprova('full ' + f.p + ' t\u00e9 imatge', /^cb-img\/p\d\d\.png$/.test(f.img));
  f.preg.forEach(function (q) {
    comprova('full ' + f.p + ' preg ' + q.n + ': soluci\u00f3 a-d', 'abcd'.indexOf(q.sol) >= 0);
    comprova('full ' + f.p + ' preg ' + q.n + ': 3 distractors amb retroacci\u00f3', Object.keys(q.fb).length === 3);
    comprova('full ' + f.p + ' preg ' + q.n + ': la correcta no t\u00e9 retroacci\u00f3', !q.fb[q.sol]);
  });
  f.req.forEach(function (p) { comprova('full ' + f.p + ' requereix un full que existeix', !!w.fullPerPagina(p)); });
});
comprova('37 preguntes al cat\u00e0leg (n\'hi ha ' + nPreg + ')', nPreg === 37);
comprova('28 fulls', w.CB.fulls.length === 28);

/* 5. composició */
console.log('composici\u00f3');
var e = estatBase();
var doc = w.composa(e);
comprova('surten preguntes de CB', doc.nPreg2 >= 15 && doc.nPreg2 <= 24);
comprova('cap full repetit', doc.part2.length === new Set(doc.part2.map(function (x) { return x.full.p; })).size);
doc.part2.forEach(function (x, i) {
  x.full.req.forEach(function (p) {
    var j = doc.part2.findIndex(function (y) { return y.full.p === p; });
    comprova('el context (full ' + p + ') va abans del full ' + x.full.p, j >= 0 && j < i);
  });
});
comprova('numeraci\u00f3 correlativa', doc.part2.every(function (x, i) { return x.num === i + 1; }));

/* mateix codi -> mateixa prova */
var a = JSON.stringify(w.composa(estatBase()));
var b = JSON.stringify(w.composa(estatBase()));
comprova('determinista', a === b);
var e2 = estatBase(); e2.codi = 'ZZZZZ';
comprova('un altre codi dona una altra prova', JSON.stringify(w.composa(e2)) !== a);

/* tria manual amb un full que necessita context */
var e3 = estatBase();
e3.part2.mode = 'manual'; e3.part2.tria = [20];
var d3 = w.composa(e3);
comprova('triar el full 20 arrossega el 19', d3.part2.map(function (x) { return x.full.p; }).join() === '19,20');

/* 6. els documents es construeixen */
console.log('documents');
var html = w.FULL.prova(e, doc);
var clau = w.FULL.clau(e, doc);
comprova('la prova t\u00e9 contingut', html.length > 3000 && html.indexOf('undefined') < 0);
comprova('la clau t\u00e9 contingut', clau.length > 2000 && clau.indexOf('undefined') < 0);
comprova('la fitxa t\u00e9 una fila per pregunta', (html.match(/<td class="q">/g) || []).length === doc.nPreg2 * 4);
comprova('totes les imatges referenciades existeixen', doc.part2.every(function (x) {
  return fs.existsSync(path.join(arrel, x.full.img));
}));

/* 7. la portada editable */
console.log('portada');
var P = w.FULL.portadaPerDefecte();
comprova('hi ha t\u00edtol, avisos i camps', !!P.titol && P.avisos.length >= 3 && P.camps.length >= 1);
comprova('{curs} i {data} al subt\u00edtol', /\{curs\}/.test(P.subtitol) && /\{data\}/.test(P.subtitol));
comprova('substituci\u00f3 de marcadors', w.FULL.subst('{curs} \u00b7 {data}', { curs: '1r', data: 'avui' }) === '1r \u00b7 avui');
comprova('un marcador desconegut es queda tal qual', w.FULL.subst('{aixo_no_existeix}', {}) === '{aixo_no_existeix}');
// la nota groga d'ajuda ensenya els marcadors a posta, i no s'imprimeix: la traiem
// tallem pel títol de la Part 1, no per les lletres "PART 1" (que ja surten al quadre de parts)
var portadaImpresa = html.split('tit-part')[0].replace(/<p class="ed-nota">[\s\S]*?<\/p>/, '');
comprova('cap marcador sense resoldre a la portada impresa',
  !/\{(codi|model|curs|data|n1|n2|n3|preg1|preg2|preg3|min1|min2|min3|minuts)\}/.test(portadaImpresa));
comprova('tot el text de la portada \u00e9s editable',
  (html.match(/data-camp="portada\./g) || []).length >= 10);
var e4 = estatBase();
e4.portada.titol = 'Prova de setembre'; e4.portada.avisos = ['Nom\u00e9s un av\u00eds.'];
var h4 = w.FULL.prova(e4, w.composa(e4));
comprova('el text reescrit surt al full', h4.indexOf('Prova de setembre') > 0 && h4.indexOf('Nom\u00e9s un av\u00eds.') > 0);
comprova('el plural es resol', /\d+ preguntes|1 pregunta/.test(portadaImpresa));
comprova('cap rastre dels minuts per part', !/\{min[123]\}|\{minuts\}/.test(html));

/* 8. cap apartat repetit dins d'un mateix exercici */
console.log('sense repeticions');
['fraccio', 'resta', 'suma', 'multiplicacio', 'divisio', 'percentatges', 'ordena', 'problema1', 'problema2']
  .forEach(function (id) {
    for (var k = 0; k < 120; k++) {
      var ee = estatBase();
      ee.codi = 'C' + ('0000' + k).slice(-4);
      ee.nivell = (k % 3) + 1;
      ee.part1.forEach(function (c) {
        c.on = (c.id === id);
        var g = w.GENERADORS.filter(function (x) { return x.id === id; })[0];
        c.subs = Math.min(g.maxSub, 3);
      });
      ee.part2.on = false;
      ee.part3.forEach(function (c) { c.on = false; });
      var it = w.composa(ee).part1[0];
      var vistos = it.subs.map(function (s) {
        return String(s.txt).replace(/<[^>]*>/g, '') + JSON.stringify(s.figura || null);
      });
      comprova(id + ' k=' + k + ': ' + it.subs.length + ' apartats diferents',
        new Set(vistos).size === vistos.length);
    }
  });

/* 9. regenerar un apartat no en toca cap altre */
console.log('regenerar');
var e5 = estatBase();
e5.part1.forEach(function (c) { c.on = (c.id === 'divisio' || c.id === 'fraccio'); c.subs = 3; });
e5.part2.on = false; e5.part3.forEach(function (c) { c.on = false; });
var abans = w.composa(e5).part1.map(function (it) { return it.subs.map(function (s) { return s.txt; }); });
e5.part1.forEach(function (c) { if (c.id === 'divisio') c.varia = [0, 1, 0]; });
var despres = w.composa(e5).part1.map(function (it) { return it.subs.map(function (s) { return s.txt; }); });
comprova('l\u2019apartat regenerat canvia', abans[0][1] !== despres[0][1]);
comprova('els altres apartats del mateix exercici es queden',
  abans[0][0] === despres[0][0] && abans[0][2] === despres[0][2]);
comprova('les fraccions de l\u2019exercici del costat no es mouen',
  JSON.stringify(abans[1]) === JSON.stringify(despres[1]));

/* 10. full en blanc i pregunta d'actitud */
console.log('portada: opcions noves');
var e6 = estatBase();
comprova('sense full en blanc per defecte', w.FULL.prova(e6, w.composa(e6)).indexOf('pagina blanca') < 0);
e6.opcions.pagBlanca = true;
comprova('amb el full en blanc activat', w.FULL.prova(e6, w.composa(e6)).indexOf('pagina blanca') > 0);
var e7 = estatBase();
comprova('actitud apagada per defecte', !e7.portada.actitud.on &&
  w.FULL.prova(e7, w.composa(e7)).indexOf('ul class="actitud"') < 0);
e7.portada.actitud.on = true;
var h7 = w.FULL.prova(e7, w.composa(e7));
comprova('actitud amb 3 caselles de veritat', (h7.match(/<span class="casella">/g) || []).length === 3);
comprova('actitud editable', h7.indexOf('data-camp="portada.actitud.opcions.0"') > 0);
comprova('la resta de la portada segueix', h7.indexOf('data-camp="portada.titol"') > 0);

console.log('\n' + ok + ' comprovacions correctes, ' + ko + ' errors');
process.exit(ko ? 1 : 0);
