/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 */
export async function getValues(spreadsheetId, range) {
  const { google } = require("googleapis");
  const { JWT } = require("google-auth-library");

  // Load your credentials from the environment variable
  const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT;

  // Parse the credentials JSON string
  const credentials = JSON.parse(credentialsString);

  // Create a JWT client using the credentials
  const jwtClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  // Initialize the client with your credentials
  await jwtClient.authorize();

  const sheets = google.sheets({ version: "v4", auth: jwtClient });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
