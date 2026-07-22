# Backend teendők a frontend átalakítás után

> Ez a jegyzet a backend forrásának átnézése után készült
> (`webshop-project-main`, Spring Boot 2.7.5, Java 18, MySQL `project_db`).
> A korábbi verzió több ponton tévedett — az alábbi már a tényleges kód alapján
> készült.

## Összefoglaló

A backend **többet tud, mint amennyit a frontend eddig használt**. Emiatt a
teendők listája rövidebb lett, mint gondoltuk:

| Amit hittünk | Valóság |
|---|---|
| Nincs „saját termékek" végpont | **Van**: `GET /product/get-owned-products` |
| Az `Art` nem tud a feltöltőről | **Tud**: `Art.user` → `user_id` oszlop |
| Nincs törlés | **Van**: `DELETE /product/delete/{id}`, tulajdonos-ellenőrzéssel |
| Nincs módosítás | **Ez igaz** — `/product/update` valóban hiányzik |

A frontend időközben átállt a `get-owned-products` végpontra, tehát az
„artist mező alapján találgatunk" megoldás megszűnt.

---

## 1. A feltöltés nem tölti ki a `user` mezőt

Ez az egyetlen igazi hiba a meglévő kódban.

`ArtService.saveProduct()` így néz ki:

```java
public ResponseDto saveProduct(ArtDto artDto) {
    Art art = artMapper.fromDtoToEntity(artDto);
    Art save = artRepository.save(art);      // a user mező üresen marad
    return new ResponseDto(save.getId());
}
```

Az `ArtDto`-ban nincs `user` mező, és a metódus nem kapja meg az
`Authorization` fejlécet sem — így **minden feltöltött termék `user_id`-ja
NULL marad**. Emiatt a `get-owned-products` mindenkinek üres listát ad.

**Javítás:** a controller adja át a fejlécet, a service pedig a tokenből
állítsa be a felhasználót — pontosan úgy, ahogy a `delete()` már most csinálja:

```java
// ArtController
@PostMapping("/add")
@RolesAllowed({RoleEnum.Types.ADMIN, RoleEnum.Types.USER})
public ResponseDto addProduct(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
                              @RequestBody ArtDto artDto) {
    return artService.saveProduct(authHeader, artDto);
}

// ArtService
public ResponseDto saveProduct(String authHeader, ArtDto artDto) {
    Integer userId = jwtUtil.getIdFromAuthHeader(authHeader);
    Art art = artMapper.fromDtoToEntity(artDto);
    art.setUser(userRepository.findById(userId).orElseThrow());
    return new ResponseDto(artRepository.save(art).getId());
}
```

---

## 2. Hiányzó végpont: `POST /product/update`

A **Termékeim → Szerkesztés** ide küldi a mentést.

```
POST /product/update
Content-Type: application/json
Authorization: <token>

{
  "id": 12,
  "title": "Hajnali kikötő",
  "artist": "Kovács Anna",
  "createdYear": 2021,
  "price": 60000,
  "description": "…",
  "imgUrl": "…",
  "xCm": 80,
  "yCm": 60,
  "material": [{ "id": 1, "name": "Olaj" }],
  "style":    [{ "id": 1, "name": "Tájkép" }]
}
```

Elvárt válasz: bármilyen 2xx JSON — a frontend csak a HTTP státuszt nézi.

Érdemes ugyanazt a tulajdonos-ellenőrzést beletenni, ami a `delete()`-ben már
megvan (`art.getUser().getId() != userId` → hiba).

---

## 3. A gazdátlan termékek hozzárendelése

Az adatbázisban a 12 termékből **7-nek már van gazdája** (`eper` 6 művet,
`admin` 1-et), tehát a Termékeim ezekkel azonnal működik. Öt termék viszont
`user_id IS NULL`, ezek most senkinél nem jelennek meg:

| id | cím |
|----|-----|
| 3  | Holdfény |
| 4  | Az erdő mélyén |
| 19 | A bánat súlya |
| 22 | A parton |
| 26 | Mediterráneum |

Ha ezeket is `eper` alá kell tenni:

```sql
UPDATE art
SET user_id = (SELECT id FROM user WHERE username = 'eper')
WHERE user_id IS NULL;
```

(Az oszlop neve `username`, nem `user_name`.)

---

## 4. Amit a frontend most már küld — érdemes ellenőrizni

A `POST /product/add` korábban **nem küldte** a technikát és a témát (a kód ki
volt kommentelve), a méretet pedig fixen `40 × 20`-nak írta, függetlenül attól,
mit választott a felhasználó. Ez javítva lett:

```json
{ "xCm": 60, "yCm": 80,
  "material": [{ "id": 1, "name": "Olaj" }],
  "style":    [{ "id": 1, "name": "Tájkép" }] }
```

A `material` / `style` abban a formában megy vissza, ahogy a
`/material/get-all` és a `/style/get-all` adja. Mivel az `Art`-ban ezek
`@ManyToMany List<Material>` / `List<Style>`, ennek jónak kell lennie — de
első feltöltésnél érdemes megnézni, tényleg bekerül-e a kapcsolótáblába.

---

## 5. Ami NEM igényel backend munkát

- Kosár — kijelentkezve a böngészőben tárolódik, belépve a meglévő
  `/basket/*` végpontokon. Változatlan.
- Bejelentkezés, regisztráció, token-ellenőrzés — változatlan.
- Terméklista, szűrés, rendezés, termékoldal, egyedi rendelés — változatlan.

A `Dev/` mappa csak fejlesztői segédlet (kitalált adatok a felület
teszteléséhez, `?mock=1`-gyel kapcsolható). Éles működésre nincs hatással:
bekapcsolás nélkül a fájl az első pár sor után kilép.

---

## 6. A backend helyi futtatása

Kipróbálva, működik. Három dolog kell hozzá:

1. **JDK 18 vagy újabb** — a `pom.xml`-ben `<java.version>18</java.version>`,
   ezért a 17-es kevés.
2. **Futó MySQL**, a `project_db` adatbázissal.
3. **Az adatbázis tartalma** — `ddl-auto=none`, tehát a Hibernate **nem hozza
   létre a táblákat**, és a repóban nincs `.sql` dump. A sémát + adatot a
   projekt gazdájától kell elkérni (`mysqldump -u root -p project_db`).

### Java 21 + Lombok ütközés

A projekt Lombokot használ, és a Spring Boot 2.7.5 az **1.18.24**-es verziót
húzza be, ami **nem működik Java 21-gyel**. A fordítás így hasal el:

```
Fatal error compiling: java.lang.NoSuchFieldError:
Class com.sun.tools.javac.tree.JCTree$JCImport does not have member field
'com.sun.tools.javac.tree.JCTree qualid'
```

Két megoldás:

- **Fájlmódosítás nélkül** — a Lombok verzióját a parancssorban felülírjuk:

  ```
  mvnw.cmd -Dlombok.version=1.18.34 spring-boot:run
  ```

- **Tartósan** (ezt a gazda döntse el) — a `pom.xml` `<properties>` blokkjába:

  ```xml
  <lombok.version>1.18.34</lombok.version>
  ```

  Ez visszafelé is biztonságos: az 1.18.34 a régebbi JDK-kat is támogatja.

### Indítás

```
cd webshop-project-main
mvnw.cmd -Dlombok.version=1.18.34 spring-boot:run
```

Ha nem a rendszer alapértelmezett Java-ja a 18+, előtte:

```
set JAVA_HOME=C:\Users\admin\Downloads\jdk-21.0.12
```

Sikeres indulás jele a logban:
`Tomcat started on port(s): 8080` és `Started WebshopApplication`.

### Tesztfelhasználók

Az adatbázisban 15 felhasználó van, de termék csak kettőhöz tartozik:
`eper` (6 mű) és `admin` (1 mű). A Termékeim oldal tehát ezekkel mutat
tartalmat — a többi fiókkal üres, ami helyes viselkedés.
