# cl-sektionen.se

Detta är ett [Next.js](https://nextjs.org/) projekt skapat med [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Hämta hem alla dependencies innan du kör igång:

```bash
npm install
```

Starta live-servern genom att köra kommandon:

```bash
npm run dev
# eller
yarn dev
```

Öppna sedan [http://localhost:3000](http://localhost:3000) genom webbläsaren för att se sidan. Du kommer åt sidan från andra enheter (exempelvis telefonen) genom din dators `ipv4` adress. om den är tex `194.168.0.001` skriver du `194.168.0.001:3000` i telefonens webbläsare.

Börja redigera någon av sidorna i mappen pages. Tex `pages/index.js`. Sidan auto-uppdateras såfort du sparar filen.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Bygga

Innan du pushar kan det finnas en poäng i att testa att bygga lokalt först. För att göra detta kör du följande kommandon:

```bash
npm run build
```

## Formatering och linting

Projektet använder Biome för att hålla koden enhetlig och felfri. Det handlar både om formatering med radbryt och liknande, men också om små standarder för olika kod-specifika lösningar. Vill du veta mer om Biome och vad den gör så kan du läsa [här](https://biomejs.dev/). Suffixet :apply gör att det som du utfört faktiskt sparas i koden, annars får du bara en lista med problemen. Du kan använda ett kommando med :apply direkt. Biome körs också automatiskt som ett litet test när du pushar eller gör en pull request. Kan vara bra att kika där innan du går vidare.

(GitHub actions väljer en specifik version av Biome via en fil i `.github/workflows`, se till att den och `package.json` stämmer överens)

```bash
# Letar efter kod som inte är formaterad rätt
npm run format

# Formaterar koden
npm run format:apply
```

```bash
# Letar efter kod som inte har fel i standarder
npm run lint

# Fixar det som kan fixas automatiskt
npm run lint:apply
```

```bash
# Testar bägge ovan och lite till
npm run biome

# Utför biome
npm run biome:apply
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy:a på Vercel

Sidan hostas på Vercel. Vercel kommer automatiskt bygga den nya versionen när den finns tillgänglig på github. DVS allt du behöver göra är att merge:a med main. Kan du inte se ändringar efter din merge? Då har Vercel misslyckats med att build:a den nya versionen... Testa att nuild:a lokalt och fixa errors som uppstår!

## Environment variables

Du behöver även ha vissa environment variables. Skapa en fil som heter `.env.local`. Kopiera sedan i följande mall:

```python
# Firebase - du kan skapa din egna databas gratis kopiera därefter alla värden
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
# Behövs för notiser, finns i Project Settings > Cloud Messaging > Web configuration > Generate Key Pair
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Fråga Webbansvariga efter denna - används i api rotes
# Finns i Project Settings > Service Account > Generate New Private Key
FIREBASE_SERVICE_ACCOUNT=

# Väljs fritt för att verifiera att revalidation request är från en betrodd källa
NEXT_PUBLIC_REVALIDATE_TOKEN=
# Kommer från SL - går att få en egen gratis
SL_API_KEY=
# En random nyckel som används av TV:n för att inte spamma sönder vår api route
CL_API_KEY=
# Länk till sektionskalendern kalender id för att publicera automatiskt
NEXT_PUBLIC_CL_CALENDAR=

MOTTAGNING_PASSWORD=

# Används bara i getServerSideProps eller api-routes, ska inte exponeras
MOTTAGNING_KEY=

# För att getStaticProps ska komma åt lokala filer (Protokoll innan men inget snedstreck i slutet)
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# Denna behövs för att kunna använda google api:er för att komma åt ex spreadsheets
# Du hittar den i Google Console för ditt projekt > APIs & Services > Credentials >
# Under Service Account tryck på den som heter "App Engine default service account" >
# Keys > Add key > Då borde en json fil laddas ned. Gör den till en sträng och kopiera in här.
GOOGLE_SERVICE_ACCOUNT= #OBS Håll väldigt hemlig

# Behövs för reCaptcha - skapas från GOOGLE_SERVICE_ACCOUNT i swEnvBuild
GOOGLE_APPLICATION_CREDENTIALS="./google_secrets.json"

# ID till spreadsheet med alla förtroendevalda
# Denna filen behöver delas med @appspot.gserviceaccount.com adressen som är länkad till service account
COMMITTEES_SHEET_ID=

# Stänger bla av PWA build när dev körs
NODE_ENV=development
```

_Firebase_ variablerna hämtas från ett firebase projekt under project settings.  
_Domain_ är den domän som webbplatsen kommer gå att nås på. Under utveckling exempelvis [http://localhost:3000](http://localhost:3000).

## Uppdatera och lägga till textinnehåll - Statiskt innehåll

För att ändra i en text går du bara in på en fil som du vill ändra på i mappen `/content`.

All längre sammanhängande text ska vara skriven i markdown. [Här](https://www.markdownguide.org/cheat-sheet/) hittar du en guide på hur du formatera texten, du kan även kolla på andra texter i mappen `/content`. Tips som inte står där:

- För att göra en ny rad utan mellanrum gör två mellanslag på raden ovan.

För att kolla på en förhandsvisning av formateringen kan du använda [markdownlivepreview.com](https://markdownlivepreview.com/). Kom ihåg att spara filen med .md formatet.

För att lägga till texten på en sida ska du använda `<MarkdownRender source={"./content/filnamn.md"} />`. Om det är en längre text lägg texten i ett artikel block `<article><MarkdownRender .../></article>`.

### Lägga till alumniblogg inlägg eller reseberättelser

Gör en markdown fil och spara den i `/content/` i någon av mapparna alumniberattelser eller reseberättelser. För att lägga till en länk till sidan kan du gå till `/pages/{alumniblogg | reseberattelser}/index.js` kopiera in följande i `<ul>` tagen:

```html
<li>
    <Link href="/mapp/filnamn">
        Namn på på personen
    </Link>
</li>
```

#### Bilder

I markdown filen kan du lägga in vanlig HTML kod och med vanliga `<img src="path">` taggar kan du lägga in bilder i texten. Det finns tre olika standard styles: _rese-top, rese-mid och rese-right_. _Top_ används för bilden högst upp på sidan (det går bara att använda en bild i toppen med den taggen). Om du vill ha flera bilder på en rad kan dui lägga dem i en "container" med följande tagg: `<div class="rese-img-container">`. För exempel se `/content/reseberattelser/camilla-björn-irland.md`.
Bilderna ska laddas upp i `public/media/reseberattelse` eller motsvarande. Då blir "path": `media/reseberattelse/namn-på-bild.webp`.

## Struktur på aktuellt sidan - Dynamiskt innehåll

I databasen sparas varje inlägg likt strukturen på JSON. De olika attributen är: _Title, Subtitle, Bild, Body, Tags, Date, PublicationDate och Author_. Body sparas i Rich Text Format dvs html format.  
`<PostFeed>` komponenten visar en lista med inlägg som kan fetchas på valfritt sätt.
På aktuelltsidan (`pages/aktuellt/index.js`) finns två feed ett för nyheter och ett för event. Det är i `pages/aktuellt/index.js` som inläggen fetchas. Varje feed kan få olika listor dvs nyhetsinlägg fetchas och skickas separat till nyhets-feedet.

Varje inlägg har ett unikt ID. För att komma åt ett inlägg används adressen `/aktuellt/[id]`. Inläggssidan ligger i `pages/aktuellt/[pageId].js`.
