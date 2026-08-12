import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "verified">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "hospital">("all");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

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
            createdAt: data.createdAt?.toDate() || new Date(),
            profileId: data.profileId,
          });
        }
      });

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
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-lg bg-slate-200/70" />
        <div className="h-64 rounded-lg bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="text-slate-500">
          Total <span className="font-semibold text-slate-900">{verifications.length}</span>
        </div>
        <div className="text-slate-500">
          Pending <span className="font-semibold text-orange-600">{pendingCount}</span>
        </div>
        <div className="text-slate-500">
          Verified <span className="font-semibold text-green-600">{verifiedCount}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 text-sm border-slate-200 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["all", "pending", "verified"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-8 rounded-md px-3 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
            {(["all", "doctor", "hospital"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`h-8 rounded-md px-3 text-xs capitalize transition-colors ${
                  roleFilter === role
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {role === "all" ? "All roles" : role + "s"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Registered</th>
                <th className="px-4 py-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-[12px] text-slate-500 truncate">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] capitalize text-slate-600">{item.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.isVerified
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
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
                      className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        const route =
                          item.role?.toLowerCase() === "hospital"
                            ? `/admin/hospital/${item.profileId}`
                            : `/admin/doctor/${item.profileId}`;
                        navigate(route);
                      }}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;
