import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Building2, Stethoscope, Clock, BadgeCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface VerificationItem {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  profileId?: string;
}

const AdminVerify = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "verified">("pending");
  const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "hospital">("all");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const usersRef = collection(db, "users");
      let querySnapshot;
      try {
        querySnapshot = await getDocs(query(usersRef, orderBy("createdAt", "desc")));
      } catch {
        querySnapshot = await getDocs(usersRef);
      }

      const users: VerificationItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.profileId) {
          users.push({
            id: docSnap.id,
            uid: data.uid,
            name: data.name || "N/A",
            email: data.email || "N/A",
            role: data.role || "N/A",
            isVerified: data.isVerified || false,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            profileId: data.profileId,
          });
        }
      });

      users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setVerifications(users);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = verifications.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && !item.isVerified) ||
      (activeTab === "verified" && item.isVerified);

    const matchesRole =
      roleFilter === "all" || item.role?.toLowerCase() === roleFilter;

    return matchesSearch && matchesTab && matchesRole;
  });

  const pendingCount = verifications.filter((v) => !v.isVerified).length;
  const verifiedCount = verifications.filter((v) => v.isVerified).length;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const openProfile = (item: VerificationItem) => {
    const route =
      item.role?.toLowerCase() === "hospital"
        ? `/admin/hospital/${item.profileId}`
        : `/admin/doctor/${item.profileId}`;
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 rounded-xl bg-slate-200/70" />
          <div className="h-20 rounded-xl bg-slate-200/70" />
          <div className="h-20 rounded-xl bg-slate-200/70" />
        </div>
        <div className="h-72 rounded-xl bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total profiles",
            value: verifications.length,
            icon: Users,
            cardClass: "border-slate-200 bg-slate-50",
            valueClass: "text-slate-900",
            iconClass: "text-slate-500",
          },
          {
            label: "Pending review",
            value: pendingCount,
            icon: Clock,
            cardClass: "border-orange-200 bg-orange-50",
            valueClass: "text-orange-700",
            iconClass: "text-orange-600",
          },
          {
            label: "Verified",
            value: verifiedCount,
            icon: BadgeCheck,
            cardClass: "border-green-200 bg-green-50",
            valueClass: "text-green-700",
            iconClass: "text-green-600",
          },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-xl border px-4 py-3.5", stat.cardClass)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className={cn("mt-1 text-2xl font-semibold tabular-nums", stat.valueClass)}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={cn("h-5 w-5", stat.iconClass)} />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 border-slate-200 bg-slate-50/50 pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["all", "pending", "verified"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-8 rounded-md px-3 text-xs capitalize transition-colors",
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {tab}
                {tab === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
              </button>
            ))}
            <span className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
            {(["all", "doctor", "hospital"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "h-8 rounded-md px-3 text-xs capitalize transition-colors",
                  roleFilter === role
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {role === "all" ? "All roles" : `${role}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Applicant</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Registered</th>
                <th className="px-4 py-2.5 font-medium text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isHospital = item.role?.toLowerCase() === "hospital";
                const RoleIcon = isHospital ? Building2 : Stethoscope;

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-slate-50/80",
                      !item.isVerified && "bg-orange-50/20"
                    )}
                    onClick={() => openProfile(item)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-700">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-slate-900">{item.name}</p>
                          <p className="truncate text-[12px] text-slate-500">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium capitalize text-slate-700">
                        <RoleIcon className="h-3 w-3" />
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          item.isVerified
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        )}
                      >
                        {item.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProfile(item);
                        }}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Clock className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No profiles match your filters</p>
              <p className="mt-1 text-xs text-slate-400">Try changing the status or role filter</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
          Showing {filtered.length} of {verifications.length}
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;
