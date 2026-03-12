Ez a dokumentum a **Multi-Tree Visualizer & Comparator** webalkalmazás részletes technikai és funkcionális specifikációja. A projekt célja egy oktatási és elemzési eszköz létrehozása, amely lehetővé teszi különböző fa alapú adatszerkezetek szimultán vizsgálatát, teljesítményük összehasonlítását és belső működésük (algoritmikus lépések) mélyreható elemzését.

---

## 1. Technológiai Stack

A projekt modern, komponens-alapú webes technológiákra épül, különös tekintettel a típusbiztonságra és a performáns DOM manipulációra.

* **Keretrendszer:** **React (v18+)**
* *Build eszköz:* **Vite** (a gyors fejlesztési környezet és optimalizált build érdekében).
* *Nyelv:* **TypeScript** (szigorú típusosság az algoritmikus hibák elkerülésére).


* **Állapotkezelés:** React Hooks (`useReducer`, `useContext`) a komplex alkalmazásállapot vezérlésére.
* **Vizualizáció és Animáció:**
* **SVG (Scalable Vector Graphics):** A fák csomópontjainak és éleinek precíz kirajzolásához.
* **Framer Motion:** A deklaratív animációkhoz (pl. csomópontok mozgása átrendeződéskor, node-ok megjelenése/eltűnése).


* **Stílusok:** CSS Modules vagy Tailwind CSS (a layout rugalmassága érdekében).

---

## 2. Rendszerarchitektúra

A szoftver szigorúan szétválasztja az üzleti logikát (algoritmusok) és a megjelenítést (UI), biztosítva a tesztelhetőséget és a kód átláthatóságát.

### A. Logikai Réteg (Business Logic Layer)

Ez a réteg **független a React-tól**. Tiszta TypeScript osztályokat tartalmaz, amelyek az adatszerkezetek működését implementálják.

* **Core entitások:**
* `TreeNode`: Generikus csomópont definíció (érték, id, szülő, gyerekek, metaadatok pl. szín, magasság).
* `TreeAlgorithm`: Absztrakt ősosztály vagy interfész, amelyet minden specifikus fa (BST, AVL, stb.) implementál.


* **Működési elv (Command & Snapshot Pattern):**
* Az algoritmusok metódusai (pl. `insert`, `delete`) nem csak módosítják a fa belső állapotát, hanem egy **Eseménynaplót (Operation Log)** generálnak.
* Minden log bejegyzés tartalmaz egy "Snapshot"-ot (vagy az előző állapothoz képesti Deltát), ami lehetővé teszi az állapot visszaállítást vizualizáció céljából.


* **Implementálandó adatszerkezetek:**
1. **Bináris Keresőfa (BST):** Alapimplementáció, kontrollcsoport.
2. **AVL Fa:** Szigorúan kiegyensúlyozott fa (forgatások demonstrálása).
3. **Piros-Fekete Fa (Red-Black Tree):** Színezési és forgatási szabályok.
4. **Splay Fa:** Hozzáférés-alapú átrendezés (splaying).
5. **B-Fa (B-Tree):** Több kulcs csomópontonként, hasadás (split) és összevonás (merge).



### B. Megjelenítési Réteg (Presentation Layer)

A React komponensek feladata kizárólag a kapott adatok (fa struktúra és log) vizuális reprezentációja.

* **Fő komponensek:**
* `TreeCanvas`: A "végtelen" vízszintes görgetőfelület kezelője.
* `TreeCard`: Egy adott algoritmus konténere (Fejléc + SVG Vászon + Mini-Log).
* `NodeRenderer`: Rekurzív komponens, amely SVG köröket és szövegeket rajzol, Framer Motion `layout` prop-pal ellátva a sima mozgásért.
* `ConnectorRenderer`: A csomópontok közötti vonalak (élek) dinamikus számítása és rajzolása.



---

## 3. Funkcionális Követelmények

### 3.1. Vezérlés (Global Controls)

A felület tetején található központi vezérlő, amely minden aktív fára egyszerre küld parancsot.

* **Input:** Numerikus érték megadása.
* **Műveletek:**
* *Beszúrás (Insert):* Új elem hozzáadása.
* *Keresés (Search):* Útvonal vizualizációja a találatig.
* *Törlés (Delete):* Elem eltávolítása és a struktúra helyreállítása.


* **Konfiguráció:** Checkbox lista az aktív fák kiválasztásához (pl. "BST vs AVL").

### 3.2. Vizualizáció és Összehasonlítás

* **Szimultán nézet:** A kiválasztott fák egymás mellett jelennek meg.
* **Teljesítménymérés (Metrics):** Minden fánál számláló mutatja az adott művelet "költségét" (hasonlítások száma, forgatások száma, érintett csomópontok).
* **Állapotkövetés:** A fák vizuálisan jelzik az állapotukat (pl. piros keret törlés alatt, sárga kitöltés keresés közben).

### 3.3. Interaktív Előzmények (Time-Travel & Debugging)

* **Mini-Log (Sticky):** Minden fa alatt látható az utolsó 3-4 algoritmikus al-lépés (pl. "Balra forgatás a 30-as csomóponton").
* **Fókusz mód (Focus Mode):** Részletes nézet egy adott fáról.
* **Hover Preview (Szellem-mód):** A log bejegyzései fölé víve az egeret, a fa vizualizációja ideiglenesen átvált az akkori állapotra ("Ghost State"), vizuális megkülönböztetéssel (pl. szürkeárnyalatos vagy áttetsző megjelenítés), anélkül, hogy a perzisztens állapot megváltozna.

---

## 4. Felhasználói Felület (UI/UX) és Layout

A felület reszponzív, de elsődlegesen desktop környezetre optimalizált a nagy mennyiségű vizuális adat miatt.

### 4.1. Főnézet: "Vízszintes Úszósávok" (Horizontal Swimlanes)

Ez a nézet oldja meg a fák eltérő növekedési sebességét és méretét.

```text
[ HEADER: Globális Input és Vezérlők ]
---------------------------------------------------------
[ KONTÉNER (Vízszintes görgetés engedélyezve, Y-tengelyen fix start) ]

   |-- OSZLOP 1 (BST) --|    |-- OSZLOP 2 (AVL) --|    |-- OSZLOP 3 (B-Fa) --|
   |                    |    |                    |    |                     |
   | [Stat: 12 lépés]   |    | [Stat: 4 lépés]    |    | [Stat: 3 lépés]     |
   |                    |    |                    |    |                     |
   |       (50)         |    |        (50)        |    |      [20|50]        |
   |      /    \        |    |       /    \       |    |     /   |   \       |
   |    (20)   (70)     |    |     (20)   (70)    |    |   [10] [30] [90]    |
   |      \             |    |                    |    |                     |
   |      (30)          |    |                    |    |                     |
   |        \           |    |                    |    |                     |
   |        (40)        |    |                    |    |                     |
   |                    |    |                    |    |                     |
   |   (Üres tér,       |    |   (Üres tér)       |    |   (Üres tér)        |
   |    a fa nőhet      |    |                    |    |                     |
   |    lefelé)         |    |                    |    |                     |
   |                    |    |                    |    |                     |
   |--------------------|    |--------------------|    |--------------------|
   | STICKY FOOTER LOG  |    | STICKY FOOTER LOG  |    | STICKY FOOTER LOG  |
   | > Jobbra forgat    |    | > Balance OK       |    | > Node split       |
   | [⤢ Nagyítás]       |    | [⤢ Nagyítás]       |    | [⤢ Nagyítás]       |
   |--------------------|    |--------------------|    |--------------------|

```

### 4.2. Fókusz Nézet: "Debug Split-Screen"

A `[⤢ Nagyítás]` gombra kattintva megnyíló modális ablak.

```text
+---------------------------------------------------------------+
| [X] Bezárás  |  Fókuszban: AVL Fa - Részletes elemzés         |
+--------------------------+------------------------------------+
| BAL PANEL: TELJES LOG    | JOBB PANEL: VIZUALIZÁCIÓ (PREVIEW) |
| (Görgethető lista)       | (Pan & Zoom támogatással)          |
|                          |                                    |
| 1. Init: 50              |             (50)                   |
| 2. Beszúr: 20            |            /    \                  |
| 3. Beszúr: 10            |          (20)   (70)               |
| 4. Balance faktor: -2    |          /                         |
| 5. Jobbra forgatás start |        (10)                        |
|    [HOVER: KURZOR ITT]   |                                    |
| 6. Új gyökér: 20         |      (A fa pontos állapota az      |
| 7. Kész                  |       5. lépés pillanatában)       |
|                          |                                    |
+--------------------------+------------------------------------+

```

## 5. Fejlesztési Ütemterv (Javasolt sorrend)

1. **Core:** TypeScript osztályok létrehozása (TreeNode) és egy egyszerű BST algoritmus implementálása konzolos logolással.
2. **UI Váz:** React projekt setup, Layout kialakítása (vízszintes scroll konténer).
3. **Renderer V1:** Egy statikus fa kirajzolása SVG-ben rekuzívan.
4. **Interakció:** Az Input mező összekötése a BST osztállyal, állapotfrissítés.
5. **Animáció:** Framer Motion integrálása a pozícióváltásokhoz.
6. **Több fa:** AVL és egyéb fák logikájának implementálása.
7. **Log & Preview:** A log rendszer UI bekötése és a "Hover Time-Travel" funkció (Ghost state) lefejlesztése.

Ez a specifikáció biztosítja, hogy a végeredmény egy oktatási szempontból értékes, technikailag pedig magas színvonalú, portfólióba illő alkalmazás legyen.