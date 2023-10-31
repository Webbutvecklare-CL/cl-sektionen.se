import admin from "../../firebase/firebaseAdmin";

import rateLimit from "../../utils/rate-limit";

import { verifyUser } from "../../utils/apiUtils";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "send.one.com",
  port: 465,
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
  // Kollar om användaren försöker mer än 10 gånger per minut
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await limiter.check(res, 10, ip); // 10 requests per minute per ip
  } catch {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  if (!req.body.data) {
    console.error("Received mail request with message:", req.body);
    return res.status(400).send({ message: "Felaktiga attribut i body." });
  }

  let data = req.body.data;
  try {
    var { uid, permission } = await verifyUser(req, res);
  } catch (error) {
    console.error("Error validating user authentication:", error);
    return res.status(401).json({ error: error.error });
  }

  console.log("User verified");
  try {
    let validated = await createAssessment(data.validation.token, data.validation.action);
    return res.send({ message: "Mail sent", validated: validated });

    let mail_response = await transporter.sendMail({
      from: '"Fred Foo 👻" <webbsvar@cl-sektionen.se>', // sender address
      to: "webbunderhallare@cl-sektionen.se", // list of receivers
      subject: data.title, // Subject line
      text: data.body, // plain text body
    });
    console.log(mail_response);
    return res.send({ message: "Mail sent" });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({ error: error.error });
  }
}

import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
// Ska vra utanför för att inte behöva skapa en ny varje gång
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
