/**
 * Seed default email templates into Firestore.
 *
 * Usage (from functions/):
 *   set GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
 *   npm run seed:templates
 *
 * Or paste these documents manually in Firebase Console → Firestore → emailTemplates
 */

const templates = {
  doctorApproval: {
    enabled: true,
    description: "Sent when a doctor profile is approved",
    subject: "Your DrStethos doctor profile has been approved",
    text:
      "Hi {{profileName}},\n\n" +
      "Your {{profileType}} profile on DrStethos has been approved.\n" +
      "You can access your dashboard here: {{dashboardLink}}\n\n" +
      "Regards,\nDrStethos Team",
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">' +
      "<p>Hi {{profileName}},</p>" +
      "<p>Your <strong>{{profileType}}</strong> profile on DrStethos has been approved.</p>" +
      '<p><a href="{{dashboardLink}}">Open your dashboard</a></p>' +
      "<p>Regards,<br/>DrStethos Team</p></div>",
  },
  hospitalApproval: {
    enabled: true,
    description: "Sent when a hospital profile is approved",
    subject: "Your DrStethos hospital profile has been approved",
    text:
      "Hi {{profileName}},\n\n" +
      "Your {{profileType}} profile on DrStethos has been approved.\n" +
      "You can access your dashboard here: {{dashboardLink}}\n\n" +
      "Regards,\nDrStethos Team",
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">' +
      "<p>Hi {{profileName}},</p>" +
      "<p>Your <strong>{{profileType}}</strong> profile on DrStethos has been approved.</p>" +
      '<p><a href="{{dashboardLink}}">Open your dashboard</a></p>' +
      "<p>Regards,<br/>DrStethos Team</p></div>",
  },
  doctorRejection: {
    enabled: true,
    description: "Sent when a doctor profile is rejected",
    subject: "Update on your DrStethos doctor profile verification",
    text:
      "Hi {{profileName}},\n\n" +
      "Your {{profileType}} profile verification on DrStethos was not approved.\n" +
      "Reason: {{rejectionReason}}\n\n" +
      "Please update your profile and try again.\n\n" +
      "Regards,\nDrStethos Team",
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">' +
      "<p>Hi {{profileName}},</p>" +
      "<p>Your <strong>{{profileType}}</strong> profile verification on DrStethos was not approved.</p>" +
      "<p><strong>Reason:</strong> {{rejectionReason}}</p>" +
      "<p>Please update your profile and try again.</p>" +
      "<p>Regards,<br/>DrStethos Team</p></div>",
  },
  hospitalRejection: {
    enabled: true,
    description: "Sent when a hospital profile is rejected",
    subject: "Update on your DrStethos hospital profile verification",
    text:
      "Hi {{profileName}},\n\n" +
      "Your {{profileType}} profile verification on DrStethos was not approved.\n" +
      "Reason: {{rejectionReason}}\n\n" +
      "Please update your profile and try again.\n\n" +
      "Regards,\nDrStethos Team",
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">' +
      "<p>Hi {{profileName}},</p>" +
      "<p>Your <strong>{{profileType}}</strong> profile verification on DrStethos was not approved.</p>" +
      "<p><strong>Reason:</strong> {{rejectionReason}}</p>" +
      "<p>Please update your profile and try again.</p>" +
      "<p>Regards,<br/>DrStethos Team</p></div>",
  },
  documentRequest: {
    enabled: true,
    description: "Reminder to upload missing documents",
    subject: "Action required: Upload missing documents on DrStethos",
    text: "{{message}}",
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">' +
      "<p>{{messageHtml}}</p></div>",
  },
};

async function main() {
  // Lazy-require so `npm install` without admin SDK credentials still works for build
  const admin = require("firebase-admin");
  const path = require("path");
  const fs = require("fs");

  if (!admin.apps.length) {
    const keyPath = path.join(__dirname, "..", "service-account-key.json");
    if (fs.existsSync(keyPath)) {
      const serviceAccount = require(keyPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
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
