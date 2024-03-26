// Skript för att bygga en fil som innehåller miljövariabler för serviceworker
// Körs automatiskt vid npm run build och npm run dev

require("dotenv").config(); // make sure you have '.env' file in pwd
const fs = require("node:fs");

fs.writeFileSync(
	"./public/swenv.js",
	`const process = {
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: '${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: '${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}',
      NEXT_PUBLIC_FIREBASE_APP_ID: '${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}',
    }
  }`,
);

fs.writeFileSync(
	"./google_secrets.json",
	`${process.env.GOOGLE_SERVICE_ACCOUNT}`,
);
