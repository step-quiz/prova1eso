/* cb.js — el catàleg de la Part 2.
   Cada FULL és una pàgina del PDF de CB del departament, amb la seva imatge a cb-img/.
   La unitat de tria és el full sencer: la imatge no es pot partir, i per tant les
   preguntes que comparteixen pàgina entren o surten juntes.
   dif: 1 accessible en acabar 6è · 2 exigeix un pas més · 3 contingut de 2n d'ESO. */
(function (w) {
  'use strict';

  var SENTITS = {
    numeric: 'Num\u00e8ric',
    algebraic: 'Algebraic',
    espacial: 'Espacial',
    mesura: 'Mesura',
    estocastic: 'Estoc\u00e0stic'
  };

  var FULLS = [
    { p: 1, bloc: 1, any: 2024, act: 'L\u2019aparcament de l\u2019institut', sentits: ['estocastic'], preg: [
      { n: 1, sol: 'a', dif: 1, destresa: 'Llegir un gr\u00e0fic de barres i sumar', fb: {
        b: 'Revisa la suma: has de sumar 4 nombres.',
        c: 'Revisa la suma: has de sumar 4 nombres.',
        d: 'Has sumat el total d\u2019alumnes de cada curs, no els que han contestat.' } }
    ] },
    { p: 2, bloc: 1, any: 2024, act: 'L\u2019aparcament de l\u2019institut', req: [1], sentits: ['estocastic'], preg: [
      { n: 2, sol: 'd', dif: 2, destresa: 'Proporcions en un diagrama de sectors', fb: {
        a: 'Gaireb\u00e9: la majoria s\u00ed que han contestat l\u2019enquesta.',
        b: 'Impossible: la majoria s\u00ed que han contestat.',
        c: 'Les proporcions no hi s\u00f3n. Gaireb\u00e9 el 80 % han contestat.' } }
    ] },
    { p: 3, bloc: 2, any: 2024, act: 'L\u2019aparcament de l\u2019institut', sentits: ['numeric'], preg: [
      { n: 4, sol: 'c', dif: 1, destresa: 'Sumar percentatges d\u2019un diagrama de sectors', fb: {
        a: 'Nom\u00e9s has comptat els que van a peu.',
        b: 'Els que van en transport p\u00fablic aqu\u00ed no compten.',
        d: 'Hi has sumat el percentatge de cotxe o moto.' } }
    ] },
    { p: 4, bloc: 3, any: 2024, act: 'El bus escolar', sentits: ['mesura'], preg: [
      { n: 7, sol: 'b', dif: 2, destresa: 'Completar dist\u00e0ncies en un mapa', fb: {
        a: 'Les dist\u00e0ncies del senyal sumen 5 km.',
        c: 'La carretera entre VilaA i VilaB fa 5,5 km.',
        d: 'Entre VilaA i VilaB hi ha 5,5 km de carretera.' } },
      { n: 8, sol: 'c', dif: 3, destresa: 'Velocitat mitjana amb canvi d\u2019unitats', fb: {
        a: 'Has dividit km entre minuts; la velocitat va en km/h.',
        b: 'Converteix els 10 minuts a hores.',
        d: 'La velocitat es calcula dividint dist\u00e0ncia entre temps.' } }
    ] },
    { p: 5, bloc: 3, any: 2024, act: 'El bus escolar', req: [4], sentits: ['mesura'], preg: [
      { n: 9, sol: 'a', dif: 3, destresa: 'Comparar recorreguts', fb: {
        b: 'No \u00e9s el trajecte m\u00e9s curt.',
        c: 'N\u2019hi ha un amb menys quil\u00f2metres.',
        d: 'El bus passa dues vegades per Vilagran.' } }
    ] },
    { p: 6, bloc: 4, any: 2024, act: 'El bus escolar', sentits: ['numeric', 'algebraic'], preg: [
      { n: 10, sol: 'c', dif: 2, destresa: 'Multiplicar i raonar amb un interval', fb: {
        a: 'El m\u00ednim no \u00e9s 100.',
        b: 'Revisa els c\u00e0lculs.',
        d: 'Cada viatge dura com a m\u00e0xim 15 minuts.' } },
      { n: 11, sol: 'c', dif: 2, destresa: 'Passar un patr\u00f3 a expressi\u00f3 algebraica', fb: {
        a: 'Has comptat com si fes 1 viatge cada dia.',
        b: 'Has comptat 7 dies; el cap de setmana no agafa el bus.',
        d: 'Has comptat 7 dies.' } }
    ] },
    { p: 7, bloc: 4, any: 2024, act: 'El bus escolar', req: [6], sentits: ['algebraic'], preg: [
      { n: 12, sol: 'b', dif: 2, destresa: 'Raonar amb un cicle que es repeteix', fb: {
        a: 'Cada dia fa 2 viatges.',
        c: 'Cada dia fa dos viatges: un al mat\u00ed i un a la tarda.',
        d: 'Cada dia fa 2 viatges.' } }
    ] },
    { p: 8, bloc: 5, any: 2024, act: 'El barri de la L\u00eddia i el Marc', sentits: ['mesura'], preg: [
      { n: 13, sol: 'a', dif: 2, destresa: 'Estimar dist\u00e0ncies amb l\u2019escala d\u2019un pl\u00e0nol', fb: {
        b: 'Has triat un cam\u00ed massa llarg.',
        c: 'Busca el cam\u00ed m\u00e9s curt possible.',
        d: 'Aquesta dist\u00e0ncia \u00e9s massa gran.' } }
    ] },
    { p: 9, bloc: 6, any: 2024, act: 'El barri de la L\u00eddia i el Marc', sentits: ['espacial'], preg: [
      { n: 15, sol: 'd', dif: 1, destresa: 'Codificar un recorregut amb punts cardinals', fb: {
        a: 'Ha de comen\u00e7ar per E: comen\u00e7a anant cap a l\u2019est.',
        b: 'Un dels moviments no \u00e9s correcte.',
        c: 'L\u2019\u00faltim moviment ha de ser O.' } }
    ] },
    { p: 10, bloc: 7, any: 2024, act: 'El parc del barri', sentits: ['mesura', 'espacial'], preg: [
      { n: 18, sol: 'd', dif: 3, destresa: 'Per\u00edmetre deduint costats no marcats', fb: {
        a: 'Has de sumar moltes vegades el costat de 60 m.',
        b: 'Revisa b\u00e9 la forma del parc.',
        c: 'Et falten trams: potser t\u2019oblides algunes cantonades.' } },
      { n: 19, sol: 'c', dif: 3, destresa: 'Dividir una figura en dues parts iguals', fb: {
        a: 'Aquesta s\u00ed que funciona; en busquem una que NO.',
        b: 'Aquesta divisi\u00f3 s\u00ed que dona dues parts iguals.',
        d: 'Aquesta divisi\u00f3 s\u00ed que dona dues parts iguals.' } }
    ] },
    { p: 11, bloc: 8, any: 2024, act: 'Bitllets de metro', sentits: ['numeric'], preg: [
      { n: 20, sol: 'b', dif: 1, destresa: 'Multiplicar un preu', fb: {
        a: 'Revisa els c\u00e0lculs.', c: 'Revisa els c\u00e0lculs.', d: 'Revisa els c\u00e0lculs.' } },
      { n: 21, sol: 'b', dif: 2, destresa: 'Comparar dues opcions de compra', fb: {
        a: 'Aix\u00f2 \u00e9s l\u2019estalvi per viatge; et demanen el total.',
        c: 'Revisa la resta.',
        d: 'Has fet com si nom\u00e9s comprés 1 bitllet.' } }
    ] },
    { p: 12, bloc: 8, any: 2024, act: 'Bitllets de metro', req: [11], sentits: ['numeric'], preg: [
      { n: 22, sol: 'c', dif: 2, destresa: 'Calcular un descompte del 25 %', fb: {
        a: 'Seria aix\u00ed si el bitllet costés 1 euro.',
        b: 'Repassa els c\u00e0lculs.',
        d: 'Has restat 0,25 \u20ac en lloc del 25 % de 2 \u20ac.' } }
    ] },
    { p: 13, bloc: 9, any: 2025, act: 'El projecte del pati', sentits: ['estocastic', 'numeric'], preg: [
      { n: 1, sol: 'd', dif: 1, destresa: 'Llegir una taula i sumar', fb: {
        a: 'Nom\u00e9s els vots del projecte A.',
        b: 'Nom\u00e9s els vots del projecte B.',
        c: 'Has comptat els alumnes de 2n en lloc dels de 1r.' } }
    ] },
    { p: 14, bloc: 9, any: 2025, act: 'El projecte del pati', req: [13], sentits: ['numeric', 'estocastic'], preg: [
      { n: 2, sol: 'b', dif: 2, destresa: 'Percentatge a partir d\u2019un gr\u00e0fic de barres', fb: {
        a: 'Has de comparar el 24 amb el total de vots.',
        c: 'Aquests s\u00f3n els vots del projecte B.',
        d: 'Revisa els c\u00e0lculs.' } },
      { n: 3, sol: 'c', dif: 2, destresa: 'Passar un percentatge a fracci\u00f3', fb: {
        a: 'Quants de 3r han votat B? Quants n\u2019hi ha en total?',
        b: 'Revisa els c\u00e0lculs.',
        d: 'Aquesta correspon al projecte A.' } },
      { n: 4, sol: 'd', dif: 2, destresa: 'Interpretar \u201c1 de cada n\u201d', fb: {
        a: 'Els percentatges de 4t diuen que ha de ser 1 de cada 4.',
        b: 'Els percentatges de 4t diuen que ha de ser 1 de cada 4.',
        c: 'T\u2019has confós de projecte: \u00e9s el B.' } }
    ] },
    { p: 15, bloc: 10, any: 2025, act: 'L\u2019espai del pati', sentits: ['mesura'], preg: [
      { n: 6, sol: 'b', dif: 2, destresa: '\u00c0rea d\u2019una figura irregular sobre quadr\u00edcula', fb: {
        a: 'Error de c\u00e0lcul: revisa les operacions.',
        c: 'L\u2019espai no \u00e9s un rectangle complet.',
        d: '80 m\u00b2 \u00e9s el rectangle sencer.' } }
    ] },
    { p: 16, bloc: 10, any: 2025, act: 'L\u2019espai del pati', req: [15], sentits: ['mesura'], preg: [
      { n: 7, sol: 'a', dif: 3, destresa: 'Longitud amb el teorema de Pit\u00e0gores', fb: {
        b: 'La part inferior no \u00e9s verda, i cal aplicar Pit\u00e0gores.',
        c: 'La part inferior no \u00e9s verda, i cal aplicar Pit\u00e0gores.',
        d: 'La part inferior no \u00e9s verda, i cal aplicar Pit\u00e0gores.' } }
    ] },
    { p: 17, bloc: 11, any: 2025, act: 'El joc de la diana', sentits: ['numeric'], preg: [
      { n: 10, sol: 'c', dif: 2, destresa: 'Maximitzar amb una regla de doble', fb: {
        a: 'Al cercle central la puntuaci\u00f3 es dobla.',
        b: 'La puntuaci\u00f3 pot ser m\u00e9s alta.',
        d: '\u00c9s impossible treure una puntuaci\u00f3 tan alta.' } }
    ] },
    { p: 18, bloc: 12, any: 2025, act: 'El joc de la diana', req: [17], sentits: ['numeric', 'estocastic'], preg: [
      { n: 14, sol: 'c', dif: 2, destresa: 'Percentatge sobre un total petit', fb: {
        a: 'Quantes partides ha guanyat realment?',
        b: 'Revisa quantes en guanya, de les 5.',
        d: 'El 50 % \u00e9s la meitat, i hi ha 5 partides.' } },
      { n: 15, sol: 'd', dif: 3, destresa: 'Mitjana amb nombres negatius', fb: {
        a: 'Aquesta \u00e9s la mitjana del Leo.',
        b: 'Revisa la suma total de punts del Nil.',
        c: 'La mitjana pot ser un nombre decimal.' } }
    ] },
    { p: 19, bloc: 13, any: 2025, act: 'Programem un robot', context: true, sentits: ['algebraic'], preg: [] },
    { p: 20, bloc: 13, any: 2025, act: 'Programem un robot', req: [19], sentits: ['algebraic', 'espacial'], preg: [
      { n: 17, sol: 'd', dif: 2, destresa: 'Executar un programa de girs i avan\u00e7os', fb: {
        a: 'Girar a l\u2019esquerra \u00e9s en sentit antihorari.',
        b: 'Revisa la direcci\u00f3 despr\u00e9s de cada gir i compta les caselles.',
        c: 'Girar a la dreta \u00e9s en sentit horari.' } }
    ] },
    { p: 21, bloc: 14, any: 2025, act: 'Programem un robot', req: [19], sentits: ['algebraic'], preg: [
      { n: 19, sol: 'a', dif: 3, destresa: 'Interpretar un bucle REPETEIX', fb: {
        b: 'Has repetit 3 vegades i n\u2019hi ha 4.',
        c: 'Revisa els passos.',
        d: 'Has repetit 2 vegades i n\u2019hi ha 4.' } }
    ] },
    { p: 22, bloc: 15, any: 2025, act: 'Programem un robot', req: [19], sentits: ['algebraic'], preg: [
      { n: 21, sol: 'd', dif: 2, destresa: 'Comptar consum a partir d\u2019una taula', fb: {
        a: 'Potser t\u2019has oblidat del consum dels girs.',
        b: 'Cada gir consumeix 2 UC, no 1.',
        c: 'Revisa el nombre de caselles i de girs.' } }
    ] },
    { p: 23, bloc: 15, any: 2025, act: 'Programem un robot', req: [19, 22], sentits: ['algebraic'], preg: [
      { n: 22, sol: 'c', dif: 3, destresa: 'Escriure una expressi\u00f3 amb dues variables', fb: {
        a: 'Cada gir consumeix 2 UC.',
        b: 'Has intercanviat els coeficients.',
        d: 'Cada casella consumeix 1 UC, no 2.' } }
    ] },
    { p: 24, bloc: 16, any: 2025, act: 'Programem un robot', req: [19], sentits: ['algebraic'], preg: [
      { n: 23, sol: 'a', dif: 2, destresa: 'Llegir el final d\u2019un recorregut en un gr\u00e0fic', fb: {
        b: 'Busca en quin segon s\u2019atura.',
        c: 'Busca en quin segon s\u2019atura.',
        d: 'Has confós els eixos.' } },
      { n: 24, sol: 'b', dif: 3, destresa: 'Interpretar pendents amb una taula de consum', fb: {
        a: 'Busca els moments en qu\u00e8 la bateria baixa de cop 2 UC.',
        c: 'Un gir consumeix 2 UC en un segon.',
        d: 'Un gir consumeix 2 UC en un segon.' } }
    ] },
    { p: 25, bloc: 16, any: 2025, act: 'Programem un robot', req: [19, 24], sentits: ['algebraic', 'espacial'], preg: [
      { n: 25, sol: 'd', dif: 3, destresa: 'Relacionar un gr\u00e0fic amb un recorregut', fb: {
        a: 'No coincideix amb el gr\u00e0fic.',
        b: 'No quadra amb el gr\u00e0fic.',
        c: 'Revisa els passos i els girs.' } }
    ] },
    { p: 26, bloc: 17, any: 2025, act: 'Capses de cart\u00f3', sentits: ['espacial'], preg: [
      { n: 26, sol: 'a', dif: 1, destresa: 'Reconèixer el desenvolupament d\u2019un cub', fb: {
        b: 'No en surt un cub.',
        c: 'Li falta la tapa.',
        d: 'T\u00e9 massa cares.' } }
    ] },
    { p: 27, bloc: 17, any: 2025, act: 'Capses de cart\u00f3', req: [26], sentits: ['espacial', 'estocastic'], preg: [
      { n: 27, sol: 'c', dif: 2, destresa: 'Com creix el volum en doblar el costat', fb: {
        a: '4 n\u2019omplen la meitat de sota: encara queda un pis.',
        b: 'Pensa b\u00e9 quantes n\u2019hi caben.',
        d: 'No hi caben 10 capses petites.' } },
      { n: 28, sol: 'b', dif: 1, destresa: 'Probabilitat senzilla', fb: {
        a: 'No ha omplert la meitat de les capses.',
        c: 'Seria aix\u00ed si nom\u00e9s hi hagués una capsa amb joguina.',
        d: 'Aquesta \u00e9s la probabilitat d\u2019agafar-ne una sense joguina.' } }
    ] },
    { p: 28, bloc: 17, any: 2025, act: 'Capses de cart\u00f3', req: [26], sentits: ['espacial'], preg: [
      { n: 29, sol: 'd', dif: 3, destresa: 'Comptar cares d\u2019un cos fet de cubs', fb: {
        a: 'Hi ha m\u00e9s cares per pintar.',
        b: 'Revisa davant, darrere, dalt i els laterals.',
        c: 'Mira tamb\u00e9 la part de darrere i la de sota.' } },
      { n: 30, sol: 'c', dif: 2, destresa: 'Comptar cubs amagats', fb: {
        a: 'Algunes estan amagades darrere d\u2019altres.',
        b: 'Et falta comptar alguna capsa oculta.',
        d: 'Has obtingut massa capses.' } }
    ] }
  ];

  FULLS.forEach(function (f) {
    f.img = 'cb-img/p' + ('0' + f.p).slice(-2) + '.png';
    f.difs = f.preg.map(function (q) { return q.dif; });
    f.difMin = f.preg.length ? Math.min.apply(null, f.difs) : 1;
    f.difMax = f.preg.length ? Math.max.apply(null, f.difs) : 1;
    f.req = f.req || [];
  });

  w.CB = { fulls: FULLS, sentits: SENTITS };
})(window);
