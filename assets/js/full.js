/* full.js — construeix els dos documents imprimibles: la prova i la clau. */
(function (w) {
  'use strict';

  var LL = 'abcd';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function barra(parts, pintades) {
    var amp = 300, h = 34, p = amp / parts, s = '';
    for (var i = 0; i < parts; i++) {
      s += '<rect x="' + (i * p) + '" y="0" width="' + p + '" height="' + h + '" fill="' +
        (i < pintades ? '#9fc7de' : '#fff') + '" stroke="#33546b" stroke-width="1.2"/>';
    }
    return '<svg class="fig" viewBox="0 -2 ' + amp + ' ' + (h + 4) + '" width="330">' + s + '</svg>';
  }

  function seqQuadrats(a) {
    var s = '', L = 26, x = 0;
    for (var t = 1; t <= 3; t++) {
      for (var i = 0; i < t; i++) {
        s += '<rect x="' + (x + i * L) + '" y="6" width="' + L + '" height="' + L + '" fill="none" stroke="#33546b" stroke-width="2"/>';
      }
      s += '<text x="' + x + '" y="' + (L + 22) + '" font-size="11" fill="#5a5a5a">' + t + ' \u2192 ' + (a * t + 1) + '</text>';
      x += t * L + 46;
    }
    return '<svg class="fig" viewBox="0 0 ' + x + ' 56" width="420">' + s + '</svg>';
  }

  function seqTriangles() {
    var s = '', L = 30, H = 26, dalt = 6, baix = 6 + H, x = 0;
    for (var t = 1; t <= 3; t++) {
      for (var i = 0; i < t; i++) {
        var pt = [];
        for (var j = i; j < i + 3; j++) pt.push([x + j * L / 2, (j % 2 === 0) ? baix : dalt]);
        s += '<polygon points="' + pt.map(function (p) { return p.join(','); }).join(' ') +
          '" fill="none" stroke="#33546b" stroke-width="2"/>';
      }
      s += '<text x="' + x + '" y="' + (baix + 14) + '" font-size="11" fill="#5a5a5a">' + t + ' \u2192 ' + (2 * t + 1) + '</text>';
      x += (t + 1) * (L / 2) + 46;
    }
    return '<svg class="fig" viewBox="0 0 ' + x + ' 62" width="430">' + s + '</svg>';
  }

  function espai(it) {
    var e = it.espai;
    if (e === 'graella') return '<div class="graella" style="height:' + (it.alt || 26) + 'mm"></div>';
    if (e === 'ratlles') {
      var n = it.alt || 3, s = '';
      for (var i = 0; i < n; i++) s += '<div class="ratlla"></div>';
      return '<div class="ratlles">' + s + '</div>';
    }
    return '';
  }

  function subHTML(it, s, i) {
    var lletra = '<span class="ap">' + LL[i] + ')</span> ';
    if (it.id === 'fraccio') {
      return '<div class="sub fig-sub">' + lletra + barra(s.figura.parts, s.figura.pintades) +
        '<span class="caixa"></span></div>';
    }
    if (it.espai === 'caixes') {
      var caixes = s.caixes || 1, c = '';
      for (var k = 0; k < caixes; k++) c += '<span class="caixa"></span>' + (k < caixes - 1 ? '<span class="op">&lt;</span>' : '');
      return '<div class="sub">' + lletra + s.txt + ' &nbsp; ' + c + '</div>';
    }
    if (it.espai === 'linia') {
      return '<div class="sub">' + lletra + s.txt + ' <span class="linia"></span></div>';
    }
    if (it.espai === 'graella') {
      var t = s.txt.length < 40 ? '<b>' + s.txt + '</b>' : s.txt;
      return '<div class="sub sub-graella">' + lletra + t + espai(it) + '</div>';
    }
    return '<div class="sub">' + lletra + s.txt + espai(it) + '</div>';
  }

  function itemHTML(it, num) {
    var h = '<div class="item"><div class="enun"><span class="num">' + num + '.</span> ';
    h += it.cap || it.subs[0].txt;
    h += '</div>';
    if (it.figuraCap) h += (it.ctx.fam && it.ctx.fam.id === 'triangles' ? seqTriangles() : seqQuadrats(it.ctx.fam ? it.ctx.fam.a : 3));
    var multi = it.subs.length > 1 || it.cap;
    if (!multi) {
      h += espai(it);
    } else {
      h += '<div class="subs' + (it.espai === 'graella' && it.subs.length >= 2 ? ' cols' : '') + '">';
      it.subs.forEach(function (s, i) { h += subHTML(it, s, i); });
      h += '</div>';
    }
    return h + '</div>';
  }

  /* ------------------------------------------------------------- la prova */
  function prova(estat, doc) {
    var h = '';
    var nPart1 = doc.part1.length, nPart2 = doc.nPreg2, nPart3 = doc.part3.length;

    if (estat.opcions.portada) {
      h += '<section class="pagina portada">';
      h += '<h1>Prova inicial de Matem\u00e0tiques</h1>';
      h += '<p class="sub">' + esc(estat.curs) + ' \u00b7 ' + esc(estat.data) + '</p>';
      h += '<div class="dades"><label>Nom i cognoms<span></span></label>' +
        '<label class="mig">Grup<span></span></label><label class="mig">Escola de prim\u00e0ria<span></span></label></div>';
      h += '<h2>Abans de comen\u00e7ar, llegeix aix\u00f2</h2><ul class="avisos">' +
        '<li><b>Aquesta prova no t\u00e9 nota.</b> Serveix perqu\u00e8 el professorat s\u00e0piga qu\u00e8 ja saps fer i qu\u00e8 t\u2019hem d\u2019ensenyar. Ning\u00fa no aprova ni suspèn.</li>' +
        '<li>Hi ha preguntes f\u00e0cils i preguntes dif\u00edcils. <b>\u00c9s normal que no ho s\u00e0piguis tot</b>.</li>' +
        '<li>Si una pregunta se\u2019t fa molt dif\u00edcil, <b>deixa-la i passa a la seg\u00fcent</b>.</li>' +
        '<li>\u00c9s millor <b>provar-ho i escriure el que penses</b> que deixar-ho en blanc.</li>' +
        (estat.opcions.calculadora ? '' : '<li>No es pot fer servir la calculadora.</li>') +
        '</ul>';
      h += '<h2>Com est\u00e0 organitzada</h2><table class="parts">';
      if (nPart1) h += '<tr><td class="p">PART 1</td><td>C\u00e0lcul i escriptura</td><td>' + nPart1 + ' preguntes</td><td class="t">' + estat.opcions.min1 + ' min</td></tr>';
      if (nPart2) h += '<tr><td class="p">PART 2</td><td>Situacions (una sola resposta correcta)</td><td>' + nPart2 + ' preguntes</td><td class="t">' + estat.opcions.min2 + ' min</td></tr>';
      if (nPart3) h += '<tr><td class="p">PART 3</td><td>Repte \u2014 <i>no cal acabar-lo</i></td><td>' + nPart3 + ' preguntes</td><td class="t">' + estat.opcions.min3 + ' min</td></tr>';
      h += '</table>';
      h += '<p class="codi-peu">codi ' + estat.codi + ' \u00b7 model ' + estat.model + '</p>';
      h += '</section>';
    }

    if (nPart1) {
      h += '<section class="pagina"><h2 class="tit-part">PART 1 \u00b7 C\u00e0lcul i escriptura</h2>' +
        '<p class="sub">Sense calculadora. Deixa veure les operacions: ens interessa <b>com</b> ho fas, no nom\u00e9s el resultat.</p>';
      doc.part1.forEach(function (it, i) { h += itemHTML(it, i + 1); });
      h += '</section>';
    }

    if (nPart2) {
      h += '<section class="pagina"><h2 class="tit-part">PART 2 \u00b7 Situacions</h2>' +
        '<p class="sub">A cada pregunta hi ha <b>una sola</b> resposta correcta. Encercla la lletra o marca-la a la fitxa final. ' +
        'Les preguntes conserven el n\u00famero que porten impr\u00e8s a cada full.</p>';
      doc.part2.forEach(function (x) {
        h += '<div class="cb"><div class="cb-cap"><span class="tag">FULL ' + x.num + '</span>' +
          '<span class="act">' + esc(x.full.act) + '</span>' +
          (x.full.preg.length ? '' : '<span class="ctx">nom\u00e9s per llegir</span>') + '</div>' +
          '<img src="' + x.full.img + '" alt="Full ' + x.num + '" style="width:' + (estat.opcions.mida || 100) + '%"></div>';
      });
      h += '</section>';
    }

    if (nPart3) {
      h += '<section class="pagina"><h2 class="tit-part">PART 3 \u00b7 Repte</h2>' +
        '<p class="sub">Aqu\u00ed no cal que ho acabis tot. El que ens interessa \u00e9s <b>com ho penses</b>: escriu-ho, encara que no arribis al final.</p>';
      doc.part3.forEach(function (it, i) { h += itemHTML(it, i + 1); });
      h += '</section>';
    }

    if (estat.opcions.fitxa && nPart2) {
      h += '<section class="pagina"><h2 class="tit-part">Fitxa de respostes \u00b7 PART 2</h2>' +
        '<div class="dades"><label>Nom i cognoms<span></span></label><label class="mig">Grup<span></span></label></div>' +
        '<table class="fitxa"><thead><tr><th>Full</th><th>Pregunta</th>' +
        '<th>a</th><th>b</th><th>c</th><th>d</th></tr></thead><tbody>';
      doc.part2.forEach(function (x) {
        x.full.preg.forEach(function (q) {
          h += '<tr><td>' + x.num + '</td><td>' + q.n + '</td>' +
            '<td class="q"></td><td class="q"></td><td class="q"></td><td class="q"></td></tr>';
        });
      });
      h += '</tbody></table><p class="sub">Si has deixat alguna pregunta en blanc, no passa res: deixa la fila buida.</p></section>';
    }
    return h;
  }

  /* -------------------------------------------------------------- la clau */
  function clau(estat, doc) {
    var h = '<section class="pagina"><h1>Clau de correcci\u00f3 i diagn\u00f2stic</h1>' +
      '<p class="sub">' + esc(estat.curs) + ' \u00b7 ' + esc(estat.data) + ' \u00b7 codi <b>' + estat.codi + '</b> \u00b7 model ' + estat.model +
      ' \u2014 <b>document del professorat</b></p>';

    if (doc.part1.length) {
      h += '<h2 class="tit-part">PART 1 \u00b7 solucions i qu\u00e8 mira cada pregunta</h2>' +
        '<table class="clau"><thead><tr><th>#</th><th>Destresa</th><th>Solucions</th></tr></thead><tbody>';
      doc.part1.forEach(function (it, i) {
        var sols = it.subs.map(function (s, k) { return '<b>' + LL[k] + ')</b> ' + s.sol; }).join(' &nbsp;\u00b7&nbsp; ');
        h += '<tr><td>' + (i + 1) + '</td><td>' + esc(it.destresa) + ' <span class="niv">N' + it.nivell + '</span></td><td>' + sols + '</td></tr>';
      });
      h += '</tbody></table>';
    }

    if (doc.part2.length) {
      h += '<h2 class="tit-part">PART 2 \u00b7 clau i diagn\u00f2stic per distractor</h2>' +
        '<table class="clau"><thead><tr><th>Full</th><th>Preg.</th><th>Sentit</th><th>Correcta</th>' +
        '<th>Qu\u00e8 avalua i qu\u00e8 vol dir cada error</th></tr></thead><tbody>';
      doc.part2.forEach(function (x) {
        if (!x.full.preg.length) return;
        x.full.preg.forEach(function (q) {
          var fb = Object.keys(q.fb || {}).map(function (k) {
            return '<b>' + k + '</b> ' + esc(q.fb[k]);
          }).join('<br>');
          h += '<tr><td>' + x.num + '</td><td>' + q.n + '</td><td>' +
            x.full.sentits.map(function (s) { return w.CB.sentits[s]; }).join(', ') + '</td>' +
            '<td class="sol">' + q.sol + '</td><td><i>' + esc(q.destresa) + '</i><br>' + fb + '</td></tr>';
        });
      });
      h += '</tbody></table>';

      var perSentit = {};
      doc.part2.forEach(function (x) {
        x.full.preg.forEach(function (q) {
          x.full.sentits.forEach(function (s) { perSentit[s] = (perSentit[s] || 0) + 1 / x.full.sentits.length; });
        });
      });
      h += '<p class="sub">Repartiment de la Part 2: ' + Object.keys(perSentit).map(function (s) {
        return w.CB.sentits[s] + ' ' + Math.round(perSentit[s] * 10) / 10;
      }).join(' \u00b7 ') + ' (total ' + doc.nPreg2 + ' preguntes)</p>';
    }

    if (doc.part3.length) {
      h += '<h2 class="tit-part">PART 3 \u00b7 solucions i nivells de resposta</h2>' +
        '<table class="clau"><thead><tr><th>#</th><th>Repte</th><th>Solucions</th></tr></thead><tbody>';
      doc.part3.forEach(function (it, i) {
        var sols = it.subs.map(function (s, k) { return '<b>' + LL[k] + ')</b> ' + s.sol; }).join('<br>');
        h += '<tr><td>' + (i + 1) + '</td><td>' + esc(it.titol) + ' <span class="niv">N' + it.nivell + '</span><br><i>' + esc(it.destresa) + '</i></td><td>' + sols + '</td></tr>';
      });
      h += '</tbody></table>';
      h += '<p class="sub"><b>Com llegir el repte del patr\u00f3:</b> 1 dibuixa i compta \u00b7 2 veu el \u201c+3 cada vegada\u201d i itera \u00b7 ' +
        '3 escriu el c\u00e0lcul directe \u00b7 4 el generalitza amb una lletra. Nivell 3 o 4 el primer dia = candidat a ampliaci\u00f3.</p>';
    }

    h += '<h2 class="tit-part">Buidatge</h2><ul class="avisos">' +
      '<li><b>Falla la Part 1 (restes, decimals)</b> \u2192 prioritat absoluta, digui el que digui la Part 2. Aqu\u00ed no serveix el banc del <i>repas</i>: cal c\u00e0lcul b\u00e0sic.</li>' +
      '<li><b>Part 1 b\u00e9 + Part 2 fluixa</b> \u2192 \u00e9s lectura i context, no c\u00e0lcul. Enlla\u00e7a-ho amb <i>Comprensi\u00f3 lectora matem\u00e0tica</i> (12 h a 1r).</li>' +
      '<li><b>Part 2 alta + repte generalitzat</b> \u2192 ampliaci\u00f3 des del primer dia.</li>' +
      '</ul></section>';
    return h;
  }

  w.FULL = { prova: prova, clau: clau };
})(window);
