import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/helpers/emailHelper";
import {
  sendApprovalNotification,
} from "@/helpers/notificationHelper";

interface Certificate {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: any;
}

interface DoctorProfileType {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  age?: number;
  gender?: string;
  mcaNumber?: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications?: string;
  bio?: string;
  location?: string;
  createdAt: any;
  updatedAt: any;
  isVerified: boolean;
  isActive: boolean;
}

const DoctorProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // rejection dialog
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch doctor profile
  useEffect(() => {
    if (!profileId) return;
    fetchDoctorProfile();
    fetchCertificates();
  }, [profileId]);

  const fetchDoctorProfile = async () => {
    try {
      const ref = doc(db, "doctors", profileId!);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("Doctor profile not found");
        navigate("/admin/verify");
        return;
      }

      setDoctor({ id: snap.id, ...(snap.data() as any) });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load doctor profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const certRef = collection(db, "doctors", profileId!, "certificates");
      const certSnap = await getDocs(certRef);
      const list: Certificate[] = [];
      certSnap.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as any) }));
      setCertificates(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load certificates");

    }
  };

  // Firestore queue utility
  const enqueueNotifications = async (
    userId: string,
    name: string,
    email: string | undefined,
    fcmToken: string | undefined,
    applicationId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const subject =
        status === "APPROVED"
          ? "Your Application Has Been Approved 🎉"
          : "Update on Your Application";

      const text =
        status === "APPROVED"
          ? `Hi ${name}, your profile (ID ${applicationId}) has been approved.`
          : `Hi ${name}, your profile (ID ${applicationId}) was not approved.`;

      const html =
        status === "APPROVED"
          ? `<p>Hi ${name},</p><p>Your profile has been approved.</p>`
          : `<p>Hi ${name},</p><p>Your profile was not approved.</p>`;

      if (email) {
        await addDoc(collection(db, "mail"), {
          to: email,
          message: { subject, text, html },
          createdAt: serverTimestamp(),
        });
      }

      if (fcmToken) {
        await addDoc(collection(db, "fcm_messages"), {
          token: fcmToken,
          notification: {
            title: subject,
            body: text,
          },
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Notification enqueue error:", err);
    }
  };

  // Approve doctor
  const handleApprove = async () => {
    if (!doctor || !profileId) return;
    setIsProcessing(true);

    try {
      const admin = auth.currentUser;
      if (!admin) {
        toast.error("Admin authentication required");
        return;
      }

      const doctorRef = doc(db, "doctors", profileId);
      await updateDoc(doctorRef, {
        isVerified: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      });

      const userRef = doc(db, "users", doctor.userId);
      await updateDoc(userRef, {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedByAdminUid: admin.uid,
        verifiedByAdminEmail: admin.email || "N/A",
      });

      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as any;

      console.log("User data:" + userData);

      await enqueueNotifications(
        doctor.userId,
        doctor.name,
        userData?.email,
        userData?.fcmToken,
        profileId,
        "APPROVED"
      );

      // Send FCM notification via Cloud Function
      if (userData?.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: doctor.userId,
            fcmToken: userData.fcmToken,
            name: doctor.name,
            status: "APPROVED",
            profileType: "DOCTOR",
            profileId,
          });
          toast.success("Notification sent to doctor");
        } catch (notifError) {
          console.error("FCM notification error:", notifError);
          toast.warning("Profile verified, but notification failed");
        }
      }

      // Send approval email
      await sendApprovalEmail({
        toEmail: doctor.email,
        profileName: doctor.name,
        profileType: "Doctor",
        dashboardLink: "https://drstethos.com",
      });

      setDoctor({ ...doctor, isVerified: true });
      toast.success("Doctor verified successfully");
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject doctor
  const confirmReject = async () => {
    if (!doctor || !profileId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    setIsProcessing(true);

    try {
      const admin = auth.currentUser;
      if (!admin) {
        toast.error("Admin authentication required");
        setIsProcessing(false);
        return;
      }

      const doctorRef = doc(db, "doctors", profileId);
      await updateDoc(doctorRef, {
        isVerified: false,
        updatedAt: new Date(),
      });

      const userRef = doc(db, "users", doctor.userId);
      await updateDoc(userRef, {
        isVerified: false,
        rejectionReason,
        rejectedAt: new Date(),
        rejectedByAdminUid: admin.uid,
        rejectedByAdminEmail: admin.email || "N/A",
      });

      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as any;

      await enqueueNotifications(
        doctor.userId,
        doctor.name,
        userData?.email,
        userData?.fcmToken,
        profileId,
        "REJECTED"
      );

      // Send FCM notification via Cloud Function
      if (userData?.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: doctor.userId,
            fcmToken: userData.fcmToken,
            name: doctor.name,
            status: "REJECTED",
            rejectionReason: rejectionReason.trim(),
            profileType: "DOCTOR",
            profileId,
          });
          toast.success("Rejection notification sent to doctor");
        } catch (notifError) {
          console.error("FCM notification error:", notifError);
          toast.warning("Profile rejected, but notification failed");
        }
      }

      // Send rejection email
      await sendRejectionEmail({
        toEmail: doctor.email,
        profileName: doctor.name,
        profileType: "Doctor",
        rejectionReason,
      });

      setDoctor({ ...doctor, isVerified: false });
      toast.error("Doctor verification rejected");
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed");
    } finally {
      setIsProcessing(false);
      setShowRejectDialog(false);
      setRejectionReason("");
    }
  };

  const handleRejectClick = () => setShowRejectDialog(true);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading…</div>;
  }

  if (!doctor) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">Doctor not found</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/verify")}
          className="h-9 px-2 -ml-2 mb-3 text-slate-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Verifications
        </Button>

        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{doctor.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Doctor Profile Verification</p>
          </div>
          <Badge
            className={
              doctor.isVerified
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-orange-50 text-orange-700 border border-orange-200"
            }
          >
            {doctor.isVerified ? "Verified" : "Pending Verification"}
          </Badge>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-2">
          {doctor.profilePhotoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={doctor.profilePhotoUrl}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Email: {doctor.email}</p>
              {doctor.phoneNumber && (
                <p className="text-sm text-slate-600">
                  Phone: {doctor.phoneNumber}
                </p>
              )}
              {doctor.gender && (
                <p className="text-sm text-slate-600 capitalize">
                  Gender: {doctor.gender}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Specialization: {doctor.specialization}</p>
              <p>Experience: {doctor.yearsOfExperience} years</p>
              {doctor.qualifications && (
                <p>Qualifications: {doctor.qualifications}</p>
              )}
            </CardContent>
          </Card>

          {doctor.bio && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText className="h-5 w-5" /> Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{doctor.bio}</p>
              </CardContent>
            </Card>
          )}

          {certificates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Award className="h-5 w-5" /> Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.map((c) => (
                  <div key={c.id} className="border p-3 rounded mb-2 flex justify-between">
                    <div>
                      <p>{c.fileName}</p>
                    </div>
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              <Button
                className="w-full bg-green-600"
                disabled={doctor.isVerified || isProcessing}
                onClick={handleApprove}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Application
              </Button>

              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200"
                onClick={handleRejectClick}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Calendar className="h-5 w-5" /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Created: {doctor.createdAt?.toDate?.().toLocaleString()}</p>
              <p>Updated: {doctor.updatedAt?.toDate?.().toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* REJECTION DIALOG */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Provide a reason for rejection.</DialogDescription>
          </DialogHeader>

          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={5}
            placeholder="Enter rejection reason..."
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>

              <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || isProcessing}
              onClick={confirmReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorProfile;
