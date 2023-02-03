Detta är ett [Next.js](https://nextjs.org/) projekt skapat med [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy:a på Vercel

Sidan hostas på Vercel. Vercel kommer automatiskt bygga den nya versionen när den finns tillgänglig på github. DVS allt du behöver göra är att merge:a med main.

## Uppdatera och lägga till textinnehåll - Statiskt innehåll

För att ändra i en text går du bara in på en fil som du vill ändra på i mappen `public/content/`.

All längre sammanhängande text ska vara skriven i markdown. [Här](https://www.markdownguide.org/cheat-sheet/) hittar du en guide på hur du formatera texten, du kan även kolla på andra texter i mappen `public/content/`. Tips som inte står där:

-   För att göra en ny rad utan mellanrum gör två mellanslag på raden ovan.

För att kolla på en förhandsvisning av formateringen kan du använda https://markdownlivepreview.com/. Kom ihåg att spara filen med .md formatet.

För att lägga till texten på en sida ska du använda `<MarkdownRender source={"./content/filnamn.md"} />`. Om det är en längre text lägg texten i ett artikel block `<article><MarkdownRender .../></article>`.

### Lägga till alumniblogg inlägg eller reseberättelser

Gör en markdown fil och spara den i `public/content/` i någon av mapparna alumniberattelser eller reseberättelser. För att lägga till en länk till sidan kan du gå till `/pages/{alumniblogg | reseberattelser}/index.js` kopiera in följande i `<ul>` tagen:

```
<li>
    <Link href="/mapp/filnamn">
        Namn på på personen
    </Link>
</li>
```

#### Bilder

I markdown filen kan du lägga in vanlig HTML kod och med vanliga `<img src="path">` taggar kan du lägga in bilder i texten. Det finns tre olika standard styles: _rese-top, rese-mid och rese-right_. _Top_ används för bilden högst upp på sidan (det går bara att använda en bild i toppen med den taggen). Om du vill ha flera bilder på en rad kan dui lägga dem i en "container" med följande tagg: `<div class="rese-img-container">`. För exempel se `public\content\reseberattelser\camilla-björn-irland.md`.

## Struktur på aktuellt sidan - Dynamiskt innehåll

I databasen sparas varje inlägg likt strukturen på JSON. De olika attributen är: _Title, Subtitle, Bild, Body, Tags, Date, PublicationDate och Author_. Body sparas i Rich Text Format dvs html format.  
`<PostFeed>` komponenten visar en lista med inlägg som kan fetchas på valfritt sätt.
På aktuelltsidan (`pages/aktuellt/index.js`) finns två feed ett för nyheter och ett för event. Det är i `pages/aktuellt/index.js` som inläggen fetchas. Varje feed kan få olika listor dvs nyhetsinlägg fetchas och skickas separat till nyhets-feedet.

Varje inlägg har ett unikt ID. För att komma åt ett inlägg används adressen /aktuellt/[id]. Inläggssidan ligger i `pages/aktuellt/[pageId].js`.
