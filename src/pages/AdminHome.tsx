import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock, ArrowRight, FileWarning } from "lucide-react";
import { collection, query, where, getDocs, Timestamp, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Stats {
  totalUsers: number;
  pendingVerifications: number;
  verifiedToday: number;
  activeSessions: number;
}

interface ActivityItem {
  action: string;
  time: string;
  type: "info" | "success";
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingVerifications: 0,
    verifiedToday: 0,
    activeSessions: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRef = collection(db, "users");

        const totalUsersSnapshot = await getCountFromServer(usersRef);
        const totalUsers = totalUsersSnapshot.data().count;

        let pendingVerifications = 0;
        try {
          const onboardedQuery = query(usersRef, where("profileId", "!=", null));
          const onboardedSnapshot = await getCountFromServer(onboardedQuery);
          const onboardedCount = onboardedSnapshot.data().count;

          const onboardedAndVerifiedQuery = query(
            usersRef,
            where("profileId", "!=", null),
            where("isVerified", "==", true)
          );
          const onboardedAndVerifiedSnapshot = await getCountFromServer(onboardedAndVerifiedQuery);
          pendingVerifications = onboardedCount - onboardedAndVerifiedSnapshot.data().count;
        } catch (err) {
          console.log("Error calculating pending verifications:", err);
        }

        let verifiedToday = 0;
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const verifiedTodayQuery = query(
            usersRef,
            where("verifiedAt", ">=", Timestamp.fromDate(today))
          );
          verifiedToday = (await getCountFromServer(verifiedTodayQuery)).data().count;
        } catch (err) {
          console.log("No users verified today:", err);
        }

        let activeSessions = 0;
        try {
          const yesterday = new Date();
          yesterday.setHours(yesterday.getHours() - 24);
          const activeQuery = query(
            usersRef,
            where("lastSeenAt", ">=", Timestamp.fromDate(yesterday))
          );
          activeSessions = (await getCountFromServer(activeQuery)).data().count;
        } catch (err) {
          console.log("No active sessions:", err);
        }

        setStats({ totalUsers, pendingVerifications, verifiedToday, activeSessions });

        const recentUsersSnapshot = await getDocs(
          query(usersRef, where("profileId", "!=", null))
        );

        const recentUsers = recentUsersSnapshot.docs
          .sort((a, b) => {
            const aTime = a.data().createdAt?.toDate() || new Date(0);
            const bTime = b.data().createdAt?.toDate() || new Date(0);
            return bTime.getTime() - aTime.getTime();
          })
          .slice(0, 8);

        setActivities(
          recentUsers.map((docSnap) => {
            const data = docSnap.data();
            const timeDiff = Date.now() - (data.createdAt?.toDate().getTime() || 0);
            return {
              action: data.isVerified
                ? `${data.role === "doctor" ? "Doctor" : "Hospital"} verified — ${data.name}`
                : `New registration — ${data.name}`,
              time: formatTimeAgo(timeDiff),
              type: data.isVerified ? "success" : "info",
            };
          })
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTimeAgo = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-28 rounded-lg bg-slate-100" />
        <div className="h-48 rounded-lg bg-slate-100" />
      </div>
    );
  }

  const queues = [
    {
      title: "Pending verification",
      count: stats.pendingVerifications,
      desc: "Profiles waiting for admin review",
      to: "/admin/verify",
      icon: Clock,
      primary: true,
    },
    {
      title: "Incomplete documents",
      count: null as number | null,
      desc: "Doctors missing required uploads",
      to: "/admin/incomplete-documents",
      icon: FileWarning,
      primary: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {queues.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.to)}
              className={`group flex items-start justify-between gap-3 rounded-lg border px-4 py-4 text-left transition-colors ${
                item.primary
                  ? "border-blue-200 bg-blue-50/60 hover:bg-blue-50"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${item.primary ? "text-blue-600" : "text-slate-500"}`} />
                  <p className="text-[13px] font-semibold text-slate-900">{item.title}</p>
                </div>
                <p className="text-[12px] text-slate-500 font-normal">{item.desc}</p>
                {item.count !== null && (
                  <p className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">
                    {item.count}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 flex-shrink-0 mt-0.5" />
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-slate-100 py-3 text-[12px] text-slate-500">
        <span>
          <span className="font-semibold text-slate-900">{stats.totalUsers}</span> total users
        </span>
        <span>
          <span className="font-semibold text-slate-900">{stats.verifiedToday}</span> verified today
        </span>
        <span>
          <span className="font-semibold text-slate-900">{stats.activeSessions}</span> active (24h)
        </span>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Users className="h-3.5 w-3.5" />
          Manage users
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[13px] font-semibold text-slate-900">Recent activity</h2>
          <button
            type="button"
            onClick={() => navigate("/admin/verify")}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Open verification
          </button>
        </div>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      activity.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                  />
                  <span className="text-[13px] text-slate-700 truncate font-normal">
                    {activity.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
