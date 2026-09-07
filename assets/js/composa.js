/* composa.js — de la configuració a la prova. Funció pura i determinista:
   mateix codi + mateixa configuració = mateixa prova, sempre. */
(function (w) {
  'use strict';

  function generador(id) {
    for (var i = 0; i < w.GENERADORS.length; i++) if (w.GENERADORS[i].id === id) return w.GENERADORS[i];
    return null;
  }

  function fullPerPagina(p) {
    var f = w.CB.fulls;
    for (var i = 0; i < f.length; i++) if (f[i].p === p) return f[i];
    return null;
  }

  /* afegeix els fulls de context que calen (mapes, taules, regles del robot...) */
  function ambRequisits(pagines) {
    var out = [], vist = {};
    function posa(p) {
      if (vist[p]) return;
      vist[p] = 1;
      var f = fullPerPagina(p);
      if (!f) return;
      f.req.forEach(posa);
      out.push(p);
    }
    pagines.forEach(posa);
    return out;
  }

  /* Cada subapartat té la seva pròpia llavor. Així, regenerar-ne un no en toca cap
     altre: si t'agrada la fracció que ha sortit, es queda tal com està encara que
     canviïs la divisió del costat. El comptador que fa de "torna-ho a tirar" és
     cfg.varia[i]; el del context compartit (tarifes, boles, família de figures)
     és cfg.variaCap. */
  function firma(s) {
    return JSON.stringify([String(s.txt).replace(/<[^>]*>/g, ''), s.figura || null, s.sol]);
  }

  function obertes(estat, part) {
    var res = [];
    (part === 1 ? estat.part1 : estat.part3).forEach(function (cfg, idx) {
      if (!cfg.on) return;
      var g = generador(cfg.id);
      if (!g) return;
      var niv = cfg.nivell || estat.nivell;
      var arrel = estat.codi + '|' + estat.model + '|' + g.id + '|' + niv + '|' + idx;
      var ctx = g.context
        ? g.context(new w.Atzar(arrel + '|ctx|' + (cfg.variaCap || 0)), niv)
        : {};
      var n = Math.max(g.minSub, Math.min(g.maxSub, cfg.subs || g.defSub));
      var subs = [], firmes = [];

      for (var i = 0; i < n; i++) {
        var v = (cfg.varia && cfg.varia[i]) || 0;
        var s = null, f = null;
        /* si surt igual que un apartat anterior (dues fraccions iguals, la mateixa
           divisió dos cops...), es torna a tirar fins que sigui diferent */
        for (var t = 0; t < 30; t++) {
          s = g.sub(new w.Atzar(arrel + '|s' + i + '|' + (v + t)), niv, i, ctx);
          f = firma(s);
          if (firmes.indexOf(f) < 0) break;
        }
        firmes.push(f);
        s.varia = v;
        subs.push(s);
      }

      res.push({
        id: g.id, part: part, titol: g.titol, destresa: g.destresa, sentit: g.sentit,
        nivell: niv, espai: g.espai, alt: g.alt || 0,
        cap: g.cap ? g.cap(niv, ctx) : '',
        ctx: ctx, ambCtx: !!g.context, subs: subs,
        figuraCap: !!g.figuraCap
      });
    });
    return res;
  }

  function triaCB(estat) {
    var cfg = estat.part2;
    if (!cfg.on) return [];
    var pagines;

    if (cfg.mode === 'manual') {
      pagines = (cfg.tria || []).slice();
    } else {
      var r = new w.Atzar(estat.codi + '|' + estat.model + '|cb');
      var cand = w.CB.fulls.filter(function (f) {
        if (!f.preg.length) return false;
        if (f.difMax > cfg.difMax) return false;
        return f.sentits.some(function (s) { return cfg.sentits.indexOf(s) >= 0; });
      });
      // ordre estable: primer els fàcils; dins del mateix nivell, ordre barrejat pel codi
      var pes = {};
      cand.forEach(function (f) { pes[f.p] = f.difMin * 100 + r.enter(0, 99); });
      cand.sort(function (a, b) { return pes[a.p] - pes[b.p]; });
      pagines = [];
      for (var i = 0; i < cand.length; i++) {
        var prova = ambRequisits(pagines.concat([cand[i].p]));
        var n = prova.reduce(function (a, p) { var f = fullPerPagina(p); return a + (f ? f.preg.length : 0); }, 0);
        pagines.push(cand[i].p);
        if (n >= cfg.objectiu) break;
      }
    }

    pagines = ambRequisits(pagines);
    var fulls = pagines.map(fullPerPagina).filter(Boolean);

    // ordenem només els fulls que tenen preguntes, de més fàcil a més difícil
    var amb = fulls.filter(function (f) { return f.preg.length; });
    amb.sort(function (a, b) {
      if (a.difMin !== b.difMin) return a.difMin - b.difMin;
      return a.p - b.p;
    });

    // i cada full de context (mapa, regles del robot, taula de consum) s'insereix
    // just abans del primer full que el necessita, no al principi de tot
    var ordre = [];
    function posa(f) {
      if (ordre.indexOf(f) >= 0) return;
      f.req.forEach(function (p) {
        var c = fullPerPagina(p);
        if (c && fulls.indexOf(c) >= 0) posa(c);
      });
      ordre.push(f);
    }
    amb.forEach(posa);
    return ordre.map(function (f, i) { return { full: f, num: i + 1 }; });
  }

  function composa(estat) {
    var p2 = triaCB(estat);
    return {
      part1: estat.part1.some(function (c) { return c.on; }) ? obertes(estat, 1) : [],
      part2: p2,
      part3: estat.part3.some(function (c) { return c.on; }) ? obertes(estat, 3) : [],
      nPreg2: p2.reduce(function (a, x) { return a + x.full.preg.length; }, 0)
    };
  }

  w.composa = composa;
  w.fullPerPagina = fullPerPagina;
})(window);
