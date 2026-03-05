import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_w6oztfn";
const APPROVAL_TEMPLATE_ID = "template_sw8dute";
const REJECTION_TEMPLATE_ID = "template_r659bp8";
const PUBLIC_KEY = "25mYPFciSU8myaCQI";

export const sendApprovalEmail = async ({
  toEmail,
  profileName,
  profileType = "Hospital",
  dashboardLink,
}) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      APPROVAL_TEMPLATE_ID,
      {
        profile_name: profileName,
        profile_type: profileType,
        to_email: toEmail,
        dashboard_link: dashboardLink,
      },
      PUBLIC_KEY
    );

    // console.log("Approval Email Sent:", response);
    return true;
  } catch (error) {
    console.error("Approval Email Error:", error);
    return false;
  }
};

export const sendRejectionEmail = async ({
  toEmail,
  profileName,
  profileType = "Hospital",
  rejectionReason,
}) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      REJECTION_TEMPLATE_ID,
      {
        profile_name: profileName,
        profile_type: profileType,
        rejection_reason: rejectionReason,
        to_email: toEmail,
      },
      PUBLIC_KEY
    );

    // console.log("Rejection Email Sent:", response);
    return true;
  } catch (error) {
    console.error("Rejection Email Error:", error);
    return false;
  }
};
