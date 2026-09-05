# Prova de nivell inicial · 1r d'ESO

Eina estàtica per **muntar-te la prova inicial** i imprimir-la. HTML, CSS i JS vainilla:
sense build, sense dependències, sense servidor. Doble clic a `index.html` i funciona.

Pensada per al primer dia de curs amb un grup molt divers: sòl baix de veritat
(saber restar) i sostre alt (generalitzar un patró), tot al mateix full.

---

## Com funciona

Tres parts, i cadascuna es configura per separat:

| Part | Què és | D'on surt |
|---|---|---|
| **1 · Càlcul i escriptura** | preguntes obertes | **generades**: tries quants apartats i quin nivell de nombres |
| **2 · Situacions** | opció múltiple amb context | els **fulls de CB** del departament (`cb-img/`), triats a mà o automàticament |
| **3 · Repte** | obertes, per al sostre | **generades** |

Els **tres nivells** de la Part 1 i la Part 3 canvien els nombres, no el tipus de pregunta:

- **nivell 1** — nombres amables: restes sense portar-ne, divisions exactes, percentatges de múltiples de 10.
- **nivell 2** — el nivell de sortida de 6è: portada garantida, decimals, residus, 25 % i 75 %.
- **nivell 3** — zeros intercalats, decimals de longitud diferent, divisor de dues xifres, i al repte es demana la fórmula general.

Cada generador pot portar el seu propi nivell o seguir el **nivell general**.

### El codi de 5 lletres

Tota la prova surt d'un codi (`K7M2P`) més el model (A/B/C). **Mateix codi = mateixos nombres, sempre.**
Canvia el model i tens la mateixa prova amb nombres diferents, per seure de costat.
El botó *Altres nombres* tira un codi nou.

La configuració sencera es desa a l'adreça (després del `#`). Desa-la als preferits o
enganxa-la en un correu i qui l'obri veurà exactament la mateixa prova.

### El repte del patró

La seqüència es dibuixa amb les tres primeres figures i **la quarta puntejada amb un «? pals» a sota**:
així s'entén sense haver d'explicar la notació.

Els quatre apartats van en ordre de dificultat, i el nombre d'apartats decideix fins on s'arriba:

1. quants pals per fer la figura que està puntejada (comptar);
2. tenim *N* pals i els gastem tots: quantes figures surten (desfer el patró);
3. quants pals per fer-ne moltes, *per lògica*, sense dibuixar-les;
4. «creus que en necessites 4 × n, o més, o menys?» — la resposta és *menys*, i és la porta d'entrada a `3n + 1`.

El nivell només mou els nombres i pot canviar la família (quadrats o triangles); l'escala de preguntes
és sempre la mateixa.

### La portada s'escriu sobre el full

Tot el text de la portada és editable **directament a la pàgina**: clica-hi a sobre i reescriu-lo.
Títol, subtítol, els camps per emplenar, el titular dels avisos, cada avís, el titular del quadre,
cada cel·la del quadre de parts, el paràgraf lliure del final i el peu. Els botons `×` treuen una
línia o un camp i `+ línia` / `+ camp` n'afegeixen.

Es desa tot sol a l'adreça, com la resta de la configuració. *Portada → Recupera el text original*
torna al text de sèrie.

El que escriguis entre claus se substitueix en imprimir:

| | | | |
|---|---|---|---|
| `{codi}` `{model}` | `{curs}` `{data}` | `{n1}` `{n2}` `{n3}` nombre de preguntes | `{min1}` `{min2}` `{min3}` `{minuts}` |

`{preg1}` `{preg2}` `{preg3}` ja porten el nom i el plural resolts: *9 preguntes*, *1 repte*.

En enganxar text només se'n conserven la negreta i la cursiva; la resta de format es descarta.
Els botons i la nota groga d'ajuda no s'imprimeixen mai.

### Imprimir

Dos botons: **la prova** (alumnat) i **la clau** (professorat, amb el diagnòstic per distractor).
Al diàleg del navegador, desmarca *Capçaleres i peus de pàgina*. Els marges els posa `@page`.

Amb la configuració que ve de sèrie: 9 obertes + 20 de CB + 2 reptes ≈ **20 pàgines** (10 fulls a doble cara)
i uns 52 minuts. Si vas just de fotocòpies, a *El document → Fulls de CB* baixa'ls al 70 %.

---

## La Part 2: per què la unitat és el full

Els ítems de CB són **imatges de pàgina**, no text. No es pot partir una pàgina per agafar-ne
mitja pregunta. Per tant la unitat de tria és el **full sencer**: si un full porta dues preguntes,
entren totes dues.

Alguns fulls **necessiten un context** (el mapa de la vall, les regles del robot, la taula de consum
de la bateria). Al catàleg això és `req: [...]`: si tries el full 20, l'eina hi posa el 19 al davant
tota sola, i el col·loca just abans del full que el necessita.

`dif` de cada pregunta: **1** accessible en acabar 6è · **2** demana un pas més · **3** és contingut de 2n d'ESO
(Pitàgores, mitjana amb negatius, km/h). Amb *Dificultat: fins a nivell 2* els de nivell 3 no surten.

---

## Estructura

```
prova-inicial/
  index.html
  assets/css/eina.css        pantalla i aspecte del full
  assets/css/imprimir.css    @page A4, salts de pàgina
  assets/js/atzar.js         atzar amb llavor (mulberry32) i codi de 5 caràcters
  assets/js/generadors.js    les preguntes obertes: 12 de la Part 1 i 4 reptes
  assets/js/cb.js            catàleg: 28 fulls, 37 preguntes, clau i retroacció
  assets/js/composa.js       de la configuració a la prova (funció pura)
  assets/js/full.js          construeix la prova i la clau en HTML
  assets/js/app.js           panell, estat a l'URL, render
  cb-img/p01.png … p28.png   els fulls de CB retallats (150 dpi)
  tools/tests.js             proves: node tools/tests.js
  exemple/                   una prova i una clau ja impreses, per mirar
```

**Res de `fetch()`**: obert amb `file://` el navegador el bloqueja. Per això les dades són
fitxers `.js` que assignen a `window`, com a `eina/`.

---

## Provar-ho

```
node tools/tests.js
```

Comprova 1439 coses, i les tres que fan mal en paper:

- que **cada solució quadri** (es recalcula l'aritmètica de restes, sumes i multiplicacions a partir de l'enunciat imprès, 300 casos);
- que els nombres en lletres estiguin bé (`3207` → *tres mil dos-cents set*);
- que la tria **arrossegui els contextos** i els posi davant;
- que el mateix codi doni sempre la mateixa prova;
- que totes les imatges referenciades **existeixin** al disc.

Si toques `generadors.js` o `cb.js`, torna-ho a passar abans d'imprimir 30 còpies.

---

## Afegir-hi coses

**Un generador nou** a `generadors.js`:

```js
reg({
  id: 'arees', part: 1, titol: 'Àrees', sentit: 'mesura',
  destresa: 'Àrea del rectangle',
  minSub: 1, maxSub: 4, defSub: 2, espai: 'graella', alt: 26,
  cap: function (niv) { return 'Calcula l\u2019àrea.'; },
  sub: function (r, niv, i, ctx) {
    var b = r.enter(niv === 1 ? 3 : 12, niv === 1 ? 9 : 48);
    var h = r.enter(niv === 1 ? 3 : 7, niv === 1 ? 9 : 25);
    return { txt: 'Un rectangle de ' + b + ' cm per ' + h + ' cm', sol: (b * h) + ' cm\u00b2' };
  }
});
```

Apareix sol al panell. `espai` pot ser `graella`, `ratlles`, `caixes`, `linia` o `figura`.
Si el generador necessita un context compartit entre apartats (una tarifa, una bossa de boles),
afegeix-hi `context: function (r, niv) { return {...}; }` i el rebràs com a quart argument.

**Un full de CB nou**: posa la imatge a `cb-img/` i una entrada a `cb.js` amb `p`, `bloc`, `act`,
`sentits`, `req` i les `preg` amb `sol`, `dif`, `destresa` i `fb` (la retroacció dels tres
distractors). El test verifica que la resposta correcta **no** tingui retroacció i que n'hi hagi
exactament tres.

---

## El que aquesta eina no fa

No corregeix. No guarda respostes de l'alumnat. No fa estadística de grup.
Si això et fa falta, el pas natural és exportar un CSV amb la clau (`full.js` ja la té muntada)
i buidar-lo al full de càlcul que ja facis servir.
