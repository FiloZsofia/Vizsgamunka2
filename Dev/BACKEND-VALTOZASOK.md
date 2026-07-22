# Backend változások

> Ez a jegyzet a `webshop-project-main` projektben elvégzett módosításokat írja
> le. Két fájl változott, mindkettő az `art` funkcióhoz tartozik. Minden
> módosítás futó backenden, valódi adatbázison ellenőrizve.

## Mit érintett

| Fájl | Mi változott |
|---|---|
| `service/ArtService.java` | `saveProduct` most a tokenből állítja be a tulajdonost; új `updateProduct`; technika/téma bekötése; egy Integer-összehasonlítás javítása |
| `controller/ArtController.java` | `/add` megkapja az Authorization fejlécet; új `POST /update` |

Semmi más nem változott — sem az entitások, sem az adatbázis szerkezete, sem a
`application.properties`.

---

## 1. A feltöltés nem rendelte a terméket felhasználóhoz

`saveProduct(ArtDto)` nem kapta meg az Authorization fejlécet, ezért minden
feltöltött termék **`user_id = NULL`** értékkel jött létre, és a
`getOwnedProducts` senkinek nem adott vissza semmit.

Most a controller átadja a fejlécet, a service pedig a tokenből tölti ki a
tulajdonost — ugyanaz a minta, ami a `delete()`-ben már megvolt.

**Ellenőrizve:** feltöltés után `user_id = 26` (a bejelentkezett felhasználó).

## 2. A méret nem került be az adatbázisba

Ez **frontend hiba** volt, de itt érdemes rögzíteni. A Jackson az `ArtDto.xCm`
mezőt `xcm` néven teszi ki a drótra (a GET válasz is így adja vissza), a
frontend viszont `xCm` néven küldte — így nem kötött be, és `0` került a
`x_cm` / `y_cm` oszlopba. A frontend most `xcm` / `ycm` néven küldi.

**Ellenőrizve:** `40 × 60` méret feltöltése után az adatbázisban `x_cm=40`,
`y_cm=60`.

## 3. A technika és a téma nem mentődött

A `POST /product/add` korábban nem küldte ezeket (a frontendben ki volt
kommentelve). Most `[{id, name}]` alakban megy, és a service **az adatbázisból
tölti be** a `Material` / `Style` sorokat az id alapján — így nem próbál új
sorokat beszúrni a törzsadat-táblákba.

**Ellenőrizve:** feltöltés után az `art_material` és `art_style` kapcsolótáblába
is bekerült a sor.

## 4. Új végpont: `POST /product/update`

```
POST /product/update
Content-Type: application/json
Authorization: <token>

{ "id": 30, "title": "…", "artist": "…", "price": 99999,
  "description": "…", "imgUrl": "…", "createdYear": 2020,
  "xcm": 30, "ycm": 45,
  "material": [{ "id": 2, "name": "Akril" }],
  "style":    [{ "id": 2, "name": "Portré" }] }
```

- Csak a **saját** termék módosítható (ugyanaz az ellenőrzés, mint a
  `delete()`-ben). Idegen termékre `nem a sajat termeked` hibát ad.
- A képet csak akkor írja felül, ha ténylegesen érkezett új érték — így a
  szerkesztés nem törli le a meglévő hivatkozást.

**Ellenőrizve:** saját termékre HTTP 200 és az adatbázisban is átment;
idegen termékre elutasítás.

## 5. Apró javítás a `delete()`-ben

Az ellenőrzés `art.getUser().getId() != userId` volt, ami `Integer`-eket
**referencia szerint** hasonlít. A Java csak a −128…127 tartományt gyorsítótárazza,
ezért 127 fölötti felhasználó-azonosítónál ez hibásan működött volna: a
tulajdonos sem tudta volna törölni a saját termékét. Most `.equals()`.

---

## Amit a kép feltöltése nem tud

Nincs fájlfeltöltő végpont, és az `img_url` oszlop `varchar(255)` — vagyis a
szerver **hivatkozást tárol, nem fájlt**. A böngésző `blob:` URL-je csak az
adott munkamenetben él, ezért használhatatlan mentésre (a korábbi feltöltéseknél
pont ez történt).

A frontend ezért most egy **„Kép útvonala"** mezőt is kínál, amit fájlválasztáskor
automatikusan kitölt `../Assets/images/<fájlnév>` alakban. A képet magát az
`Assets/images` mappába kell bemásolni.

Ha később valódi képfeltöltés kell, az külön feladat: egy
`POST /product/upload-image` végpont, ami lemezre (vagy tárolóba) írja a fájlt,
és visszaadja az elérési útját.

---

## Futtatás

Lásd `Dev/BACKEND-TEENDOK.md` 6. pont — a lényeg, hogy Java 21 alatt kell a
`-Dlombok.version=1.18.34` kapcsoló, különben a Lombok miatt nem fordul.
