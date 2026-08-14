import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/helpers/emailHelper";
import { sendApprovalNotification } from "@/helpers/notificationHelper";
import { ProfileApprovalConfirmDialog } from "@/components/email/ProfileApprovalConfirmDialog";
import { ProfileRejectionConfirmDialog } from "@/components/email/ProfileRejectionConfirmDialog";

interface HospitalProfile {
  id: string;
  userId: string;
  name: string;
  hospitalType: string;
  customHospitalType?: string;
  licenseNumber: string;
  profilePhotoUrl?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
  contactNumber: string;
  website?: string;
  specialization: string;
  licenseCertificateUrl?: string;
  aboutHospital?: string;
  profileViewsCount: number;
  lastViewsReset: any;
  createdAt: any;
  updatedAt: any;
  isVerified: boolean;
  isActive: boolean;
}

interface UserData {
  verifiedAt?: any;
  verifiedByAdminUid?: string;
  verifiedByAdminEmail?: string;
  rejectedAt?: any;
  rejectedByAdminUid?: string;
  rejectedByAdminEmail?: string;
  rejectionReason?: string;
}

const HospitalProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (profileId) {
      fetchHospitalProfile();
    }
  }, [profileId]);

  const fetchHospitalProfile = async () => {
    try {
      if (!profileId) return;

      const hospitalRef = doc(db, "hospitals", profileId);
      const hospitalDoc = await getDoc(hospitalRef);

      if (hospitalDoc.exists()) {
        const hospitalData = {
          id: hospitalDoc.id,
          ...hospitalDoc.data(),
        } as HospitalProfile;
        setHospital(hospitalData);

        // Fetch user data to get admin verification/rejection details
        const userRef = doc(db, "users", hospitalData.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        toast.error("Hospital profile not found");
        navigate("/admin/verify");
      }
    } catch (error) {
      console.error("Error fetching hospital profile:", error);
      toast.error("Failed to load hospital profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!hospital || !profileId) return;

    setIsProcessing(true);
    try {
      const currentAdmin = auth.currentUser;
      if (!currentAdmin) {
        toast.error("Admin authentication required");
        setIsProcessing(false);
        return;
      }

      const verifiedAt = new Date();

      // Update hospital document (without admin info)
      const hospitalRef = doc(db, "hospitals", profileId);
      await updateDoc(hospitalRef, {
        isVerified: true,
        verifiedAt: verifiedAt,
        updatedAt: new Date(),
      });

      // Update user document with admin information
      const userRef = doc(db, "users", hospital.userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as any;

      await updateDoc(userRef, {
        isVerified: true,
        verifiedAt: verifiedAt,
        verifiedByAdminUid: currentAdmin.uid,
        verifiedByAdminEmail: currentAdmin.email || "N/A",
        rejectedAt: null,
        rejectionReason: null,
        rejectedByAdminUid: null,
        rejectedByAdminEmail: null,
      });

      // Update local state
      setHospital({
        ...hospital,
        isVerified: true,
      });

      setUserData({
        ...userData,
        verifiedAt: verifiedAt,
        verifiedByAdminUid: currentAdmin.uid,
        verifiedByAdminEmail: currentAdmin.email || "N/A",
        rejectedAt: null,
        rejectionReason: null,
        rejectedByAdminUid: null,
        rejectedByAdminEmail: null,
      });
      console.log("Hospital approved:", hospital.name);

      // Send FCM notification via Cloud Function
      if (userData?.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: hospital.userId,
            fcmToken: userData.fcmToken,
            name: hospital.name,
            status: "APPROVED",
            profileType: "HOSPITAL",
            profileId,
          });
          toast.success("Notification sent to hospital");
        } catch (notifError) {
          console.error("FCM notification error:", notifError);
          toast.warning("Profile verified, but notification failed");
        }
      }

      // Send approval email
      await sendApprovalEmail({
        toEmail: hospital.email,
        profileName: hospital.name,
        profileType: "Hospital",
        dashboardLink: "https://drstethos.com",
      });

      toast.success("Hospital verified successfully");
      setShowApproveDialog(false);
    } catch (error) {
      console.error("Error approving hospital:", error);
      toast.error("Failed to verify hospital");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!hospital || !profileId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      const currentAdmin = auth.currentUser;
      if (!currentAdmin) {
        toast.error("Admin authentication required");
        setIsProcessing(false);
        return;
      }

      const rejectedAt = new Date();

      // Update hospital document
      const hospitalRef = doc(db, "hospitals", profileId);
      await updateDoc(hospitalRef, {
        isVerified: false,
        updatedAt: rejectedAt,
      });

      // Update user document with rejection reason and admin info
      const userRef = doc(db, "users", hospital.userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as any;

      await updateDoc(userRef, {
        isVerified: false,
        rejectionReason: rejectionReason.trim(),
        rejectedAt: rejectedAt,
        rejectedByAdminUid: currentAdmin.uid,
        rejectedByAdminEmail: currentAdmin.email || "N/A",
      });

      // Update local state
      setHospital({
        ...hospital,
        isVerified: false,
      });

      setUserData({
        ...userData,
        rejectedAt: rejectedAt,
        rejectionReason: rejectionReason.trim(),
        rejectedByAdminUid: currentAdmin.uid,
        rejectedByAdminEmail: currentAdmin.email || "N/A",
      });

      setShowRejectDialog(false);

      // Send FCM notification via Cloud Function
      if (userData?.fcmToken) {
        try {
          await sendApprovalNotification({
            userId: hospital.userId,
            fcmToken: userData.fcmToken,
            name: hospital.name,
            status: "REJECTED",
            rejectionReason: rejectionReason.trim(),
            profileType: "HOSPITAL",
            profileId,
          });
          toast.success("Rejection notification sent to hospital");
        } catch (notifError) {
          console.error("FCM notification error:", notifError);
          toast.warning("Profile rejected, but notification failed");
        }
      }

      // Send rejection email
      await sendRejectionEmail({
        toEmail: hospital.email,
        profileName: hospital.name,
        profileType: "Hospital",
        rejectionReason: rejectionReason,
      });

      setRejectionReason("");
      toast.error("Hospital verification rejected");
    } catch (error) {
      console.error("Error rejecting hospital:", error);
      toast.error("Failed to reject verification");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-500">Hospital profile not found</p>
        </CardContent>
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {hospital.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Hospital Profile Verification</p>
          </div>
          <Badge
            variant={hospital.isVerified ? "default" : "secondary"}
            className={
              hospital.isVerified
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-orange-50 text-orange-700 border border-orange-200"
            }
          >
            {hospital.isVerified ? "Verified" : "Pending Verification"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Photo */}
          {hospital.profilePhotoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={hospital.profilePhotoUrl}
                  alt={hospital.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Hospital Type</p>
                  <p className="font-medium">
                    {hospital.hospitalType === "other"
                      ? hospital.customHospitalType
                      : hospital.hospitalType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">License Number</p>
                  <p className="font-medium">{hospital.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Specialization</p>
                  <p className="font-medium">{hospital.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Status</p>
                  <Badge variant={hospital.isActive ? "default" : "secondary"}>
                    {hospital.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{hospital.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Contact Number</p>
                  <p className="font-medium">{hospital.contactNumber}</p>
                </div>
              </div>
              {hospital.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Website</p>
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {hospital.website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{hospital.address}</p>
              <p className="text-slate-600">
                {hospital.city}, {hospital.state} - {hospital.pinCode}
              </p>
            </CardContent>
          </Card>

          {/* About Hospital */}
          {hospital.aboutHospital && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  About Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {hospital.aboutHospital}
                </p>
              </CardContent>
            </Card>
          )}

          {/* License Certificate */}
          {hospital.licenseCertificateUrl && (
            <Card>
              <CardHeader>
                <CardTitle>License Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={hospital.licenseCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View License Certificate
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Actions</CardTitle>
              <CardDescription>
                Review and approve or reject this application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowApproveDialog(true)}
                disabled={isProcessing || hospital.isVerified}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {hospital.isVerified
                  ? "Already Approved"
                  : "Approve Application"}
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {hospital.isVerified
                  ? "Revoke Verification"
                  : "Reject Application"}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Action History */}
          {userData && (userData.rejectionReason || userData.rejectedAt) && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-sm">Rejection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border border-red-200">
                  <p className="font-semibold text-red-700 mb-1">
                    ✗ Application Rejected
                  </p>
                  {userData.rejectedByAdminEmail && (
                    <p className="text-slate-600">
                      By: {userData.rejectedByAdminEmail}
                    </p>
                  )}
                  {userData.rejectedAt && (
                    <p className="text-slate-500">
                      {typeof userData.rejectedAt?.toDate === "function"
                        ? userData.rejectedAt.toDate().toLocaleString()
                        : new Date(userData.rejectedAt).toLocaleString()}
                    </p>
                  )}
                  {userData.rejectionReason && (
                    <p className="text-slate-700 mt-2 p-2 bg-red-50 rounded italic">
                      <span className="font-semibold not-italic">Reason:</span>{" "}
                      {userData.rejectionReason}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Created At</p>
                <p className="font-medium">
                  {hospital.createdAt?.toDate().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="font-medium">
                  {hospital.updatedAt?.toDate().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">User ID</p>
                <p className="font-mono text-xs">{hospital.userId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileApprovalConfirmDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        profileName={hospital.name}
        profileType="Hospital"
        recipientEmail={hospital.email}
        isProcessing={isProcessing}
        onConfirm={handleApprove}
      />

      <ProfileRejectionConfirmDialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) setRejectionReason("");
        }}
        profileName={hospital.name}
        profileType="Hospital"
        recipientEmail={hospital.email}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        isProcessing={isProcessing}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default HospitalProfile;
