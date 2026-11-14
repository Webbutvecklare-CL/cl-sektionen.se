## cl-sektionen.se/public/media/fortroendevalda

I denna mapp kan man lägga till bilder som ska visas under fliken **Förtroendevalda**.

### Format
Bilder bör i första hand vara WebP-filer (`.webp`), men `.png`, `.jpg`, `.jpeg` och `.avif` stöds också.

---

### Enskild bild för en nämnd
Namnge filen efter dess [förtroendevalda-ID](../../../constants/committees-data.js):
- Exempel: `ctyrelsen.webp`, `studienamnden.webp`

---

### Flera bilder för en nämnd
Om en nämnd har flera bilder (t.ex. för att alla inte kunde närvara samtidigt) kan man göra på något av följande sätt:

**Alternativ 1: Filer med suffix i rotmappen**
- Exempel: `ctyrelsen_1.webp`, `ctyrelsen_2.webp`
- Eller med beskrivande text: `ctyrelsen_del-1.webp`, `ctyrelsen_del-2.webp`

**Alternativ 2: En undermapp döpt efter ID:t**
- Skapa mappen `public/media/fortroendevalda/<id>/` (t.ex. `ctyrelsen/`)
- Lägg bilderna där: `ctyrelsen/1.webp`, `ctyrelsen/2.webp`

---

### Bilder för Enskilda poster
Poster under "Enskilda" (t.ex. Talman, Vice talman, Balgeneral, Idrottsansvarig) kan ha separata bilder:

**Alternativ 1: Filer med prefix `enskilda_`**
- `enskilda_balgeneral.webp`
- `enskilda_talman.webp`

**Alternativ 2: I undermappen `enskilda/`**
- `enskilda/balgeneral.webp`
- `enskilda/talman.webp`

Systemet känner automatiskt av rollen eller namnet i filnamnet och skapar en snygg bildtext med personens namn, årskurs och roll.

**Alternativ 3: Explicit i datafilen**
I `constants/fortroendevaldaData.js` kan man vid behov ange ett `image`-fält direkt på personen i listan:
```javascript
{
  role: "Balgeneral ❄️",
  name: "Frida Andersson",
  mail: "bal@cl-sektionen.se",
  year: "CL20",
  image: "balgeneral.webp"
}
```
