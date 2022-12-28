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

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy:a på Vercel

Sidan hostas på Vercel. Vercel kommer automatiskt bygga den nya versionen när den finns tillgänglig på github. DVS allt du behöver göra är att merge:a med main.
