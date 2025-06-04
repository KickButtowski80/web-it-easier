const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");

admin.initializeApp();

const GOOGLE_CLIENT_EMAIL = functions.config().google.client_email;
const GOOGLE_PRIVATE_KEY =
 functions.config().google.private_key.replace(/\\n/g, "\n");

const DAILY_INDEXING_LIMIT = 190; // Stay well below Google's 200 limit
const USAGE_DOC_PATH = "usage/googleIndexing";

exports.notifyGoogleIndexing = functions.https.onCall(async (data, context) => {
  const {url, type} = data;

  if (!url || !type) {
    throw new functions.
        https.
        HttpsError("invalid-argument", "URL and type are required.");
  }

  const db = admin.firestore();
  const usageRef = db.doc(USAGE_DOC_PATH);

  try {
    // --- Rate Limiting Logic ---
    await db.runTransaction(async (transaction) => {
      const usageDoc = await transaction.get(usageRef);
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      let dailyCalls = 0;
      let lastResetDate = "";

      if (usageDoc.exists) {
        const data = usageDoc.data();
        dailyCalls = data.dailyCalls || 0;
        lastResetDate = data.lastResetDate || "";

        if (lastResetDate !== today) {
          functions.
              logger.
              info(`New day detected. Resetting daily calls from
                 ${dailyCalls} to 0.`);
          dailyCalls = 0;
          lastResetDate = today;
        }
      } else {
        functions.logger.info("Usage document not found. Initializing.");
        lastResetDate = today;
      }

      if (dailyCalls >= DAILY_INDEXING_LIMIT) {
        functions.logger.warn(`Daily indexing limit
             (${DAILY_INDEXING_LIMIT}) exceeded.
             Skipping API call for ${url}.`);
        throw new functions.https.HttpsError("resource-exhausted",
            "Daily Google Indexing API limit reached.");
      }

      dailyCalls++;
      transaction.set(usageRef, {
        dailyCalls: dailyCalls,
        lastResetDate: lastResetDate,
      }, {merge: true});

      functions.logger
          .info(`Google Indexing API call count for today: ${dailyCalls}`);
    });

    // --- Original Google Indexing API Call Logic ---
    const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY,
        ["https://www.googleapis.com/auth/indexing"],
        null,
    );

    await jwtClient.authorize();

    const indexing = google.indexing({
      version: "v3",
      auth: jwtClient,
    });

    const requestBody = {
      url: url,
      type: type,
    };

    const response = await indexing.urlNotifications.publish({
      requestBody: requestBody,
    });

    functions.logger
        .info(`Google Indexing API response for ${url} (${type}):`
            , response.data);
    return {success: true, data: response.data};
  } catch (error) {
    if (error.code === "resource-exhausted") {
      return {success: false, message: error.message};
    }
    functions.logger.error(`Error notifying Google for
         ${url} (${type}):`, error);
    throw new functions.https
        .HttpsError("internal",
            "Failed to notify Google Indexing API.", error.message);
  }
});
