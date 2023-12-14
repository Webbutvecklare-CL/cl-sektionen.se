import rateLimit from "../../utils/rate-limit";

import { IncomingForm } from "formidable";
import fs from "fs";
import nodemailer from "nodemailer";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const transporter = nodemailer.createTransport({
  host: "send.one.com",
  port: 587,
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_EMAIL_PASS,
  },
});

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(req, res) {
  // Kollar om användaren försöker mer än 4 gånger per minut
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await limiter.check(res, 4, ip); // 4 requests per minute per ip
  } catch {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const data = {
      type: fields.type,
      email: fields.email,
      token: fields.token,
      name: fields.name,
      title: fields.title,
      body: fields.body,
      subtitle: fields.subtitle,
      other: fields.other,
      startDate: fields.startDate,
      endDate: fields.endDate,
      image: files.image[0],
    };

    // console.log(data.image);
    // const imageContent = fs.readFileSync(data.file.filepath);
    let message = {};
    const imageFile = files.image[0];
    const fileBuffer = fs.readFileSync(imageFile.filepath);
    console.log(fileBuffer); // Log the buffer
    console.log(fileBuffer.length);
    return res.status(200).send({ message: "Mail sent" });
    const mail_response = transporter.sendMail({
      from: '"Kontaktformulär" <webbsvar@cl-sektionen.se>', // sender address
      to: "webbunderhallare@cl-sektionen.se", // list of receivers
      subject: data.title, // Subject line
      text: data.body, // plain text body
      attachments: [
        {
          filename: imageFile.originalFilename,
          content: fileBuffer, // Attach the buffer
          contentType: imageFile.mimetype,
        },
      ],
    });
  });

  return res.status(200).send({ message: "Mail sent" });

  let validationScore = 0;
  try {
    validationScore = await createAssessment(data.validation.token, data.validation.action);

    console.log(validationScore);
  } catch (error) {
    console.error("Error validating:", error);
    return res
      .status(500)
      .json({ message: "Det gick inte att skicka mejlet!", error: "Could not validate" });
  }

  // Kollar om validation score är under 0.7, vilket är gränsen för att vara en bot
  const threshold = 0.7;
  if (validationScore < threshold) {
    return res
      .status(403)
      .json({ message: "Fel vid verifiering: Försök igen senare.", error: error.error });
  }

  try {
    const mail_response = await transporter.sendMail({
      from: '"Kontaktformulär" <webbsvar@cl-sektionen.se>', // sender address
      to: "webbunderhallare@cl-sektionen.se", // list of receivers
      subject: data.title, // Subject line
      text: data.body, // plain text body
    });

    console.log(mail_response);

    return res.send({ message: "Mail sent" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Det gick inte att skicka mejlet!", error: error.error });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disables the default Next.js body parser
  },
};

// Ska vara utanför för att inte behöva skapa en ny varje gång
const client = new RecaptchaEnterpriseServiceClient();

/**
 * Create an assessment to analyze the risk of a UI action. Note that
 * this example does set error boundaries and returns `null` for
 * exceptions.
 *
 * projectID: Google Cloud project ID
 * recaptchaKey: reCAPTCHA key obtained by registering a domain or an app to use the services of reCAPTCHA Enterprise.
 * token: The token obtained from the client on passing the recaptchaKey.
 * recaptchaAction: Action name corresponding to the token.
 */
async function createAssessment(token, action) {
  const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const recaptchaAction = action;

  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  // client.createAssessment() can return a Promise or take a Callback
  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(
      "The CreateAssessment call failed because the token was: " +
        response.tokenProperties.invalidReason
    );

    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the
  // grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment,
    // see: https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });
    return response.riskAnalysis.score;
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag " +
        "does not match the action you are expecting to score"
    );
    return null;
  }
}
