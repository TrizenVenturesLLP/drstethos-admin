/**
 * Seed default email templates into Firestore.
 *
 * Usage (from functions/):
 *   npm run seed:templates
 *
 * Requires one of:
 *   1. functions/service-account-key.json (recommended)
 *   2. gcloud auth application-default login (with gcloud installed)
 *
 * Or paste documents manually in Firebase Console → Firestore → emailTemplates
 * using functions/emailTemplates.seed.json
 */

const { documentRequestTemplate } = require("../email/documentRequestTemplate");

const templates = {
  documentRequest: documentRequestTemplate,
};

function getProjectId(fs, path) {
  const fromEnv =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT;
  if (fromEnv) return fromEnv;

  const firebasercPath = path.join(__dirname, "..", "..", ".firebaserc");
  if (fs.existsSync(firebasercPath)) {
    const rc = JSON.parse(fs.readFileSync(firebasercPath, "utf8"));
    if (rc.projects?.default) return rc.projects.default;
  }

  return undefined;
}

function printCredentialHelp(keyPath) {
  console.error("No Firebase Admin credentials found.\n");
  console.error("Option A — service account key (recommended):");
  console.error("  1. Open https://console.firebase.google.com/project/drstethos-app/settings/serviceaccounts/adminsdk");
  console.error("  2. Generate new private key");
  console.error(`  3. Save the file as: ${keyPath}`);
  console.error("  4. Run: npm run seed:templates\n");
  console.error("Option B — Firebase Console (no key file):");
  console.error("  Create collection emailTemplates → document documentRequest");
  console.error("  Paste fields from functions/emailTemplates.seed.json\n");
  console.error("If GOOGLE_APPLICATION_CREDENTIALS points to a missing file, run:");
  console.error("  unset GOOGLE_APPLICATION_CREDENTIALS");
}

function initAdmin(admin, fs, path) {
  const keyPath = path.join(__dirname, "..", "service-account-key.json");
  const projectId = getProjectId(fs, path);
  const credEnvPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credEnvPath && !fs.existsSync(path.resolve(credEnvPath))) {
    console.error(
      `GOOGLE_APPLICATION_CREDENTIALS points to a missing file: ${credEnvPath}\n`
    );
    printCredentialHelp(keyPath);
    process.exit(1);
  }

  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    });
    return;
  }

  if (!credEnvPath) {
    printCredentialHelp(keyPath);
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

async function main() {
  // Lazy-require so `npm install` without admin SDK credentials still works for build
  const admin = require("firebase-admin");
  const path = require("path");
  const fs = require("fs");

  if (!admin.apps.length) {
    initAdmin(admin, fs, path);
  }

  const db = admin.firestore();

  for (const [id, data] of Object.entries(templates)) {
    await db.collection("emailTemplates").doc(id).set(
      {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Seeded emailTemplates/${id}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
