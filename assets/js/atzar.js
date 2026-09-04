/* atzar.js — atzar amb llavor. Mateix codi, mateixa prova, sempre. */
(function (w) {
  'use strict';

  var ALFABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sense I, O, 0, 1

  function codiNou() {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += ALFABET[Math.floor(Math.random() * ALFABET.length)];
    }
    return s;
  }

  function netejaCodi(txt) {
    txt = String(txt || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    var s = '';
    for (var i = 0; i < txt.length && s.length < 5; i++) {
      if (ALFABET.indexOf(txt[i]) >= 0) s += txt[i];
    }
    while (s.length < 5) s += 'A';
    return s;
  }

  // hash determinista d'una cadena -> enter de 32 bits
  function hash(txt) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < txt.length; i++) {
      h ^= txt.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  // mulberry32
  function Atzar(llavor) {
    this.s = (typeof llavor === 'string' ? hash(llavor) : llavor >>> 0) || 1;
  }

  Atzar.prototype.real = function () {
    this.s = (this.s + 0x6D2B79F5) >>> 0;
    var t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* enter dins [a, b], tots dos inclosos */
  Atzar.prototype.enter = function (a, b) {
    return a + Math.floor(this.real() * (b - a + 1));
  };

  Atzar.prototype.tria = function (arr) {
    return arr[Math.floor(this.real() * arr.length)];
  };

  /* Fisher-Yates sobre una còpia */
  Atzar.prototype.barreja = function (arr) {
    var c = arr.slice();
    for (var i = c.length - 1; i > 0; i--) {
      var j = Math.floor(this.real() * (i + 1));
      var t = c[i]; c[i] = c[j]; c[j] = t;
    }
    return c;
  };

  /* n elements diferents de arr */
  Atzar.prototype.mostra = function (arr, n) {
    return this.barreja(arr).slice(0, n);
  };

  w.Atzar = Atzar;
  w.codiNou = codiNou;
  w.netejaCodi = netejaCodi;
  w.hashCadena = hash;
})(window);
