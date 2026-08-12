import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Activity, CheckCircle, Clock, ArrowUpRight } from "lucide-react";
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
          .slice(0, 6);

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

  const statsDisplay = [
    { label: "Total users", value: stats.totalUsers, icon: Users },
    { label: "Pending", value: stats.pendingVerifications, icon: Clock },
    { label: "Verified today", value: stats.verifiedToday, icon: CheckCircle },
    { label: "Active (24h)", value: stats.activeSessions, icon: Activity },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-200/70" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 font-normal">
          Welcome back. Here’s what’s happening on the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[12px] text-slate-500 font-normal">{stat.label}</span>
                <Icon className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        activity.type === "success" ? "bg-green-500" : "bg-blue-500"
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
              <p className="px-4 py-10 text-center text-sm text-slate-400">No recent activity</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
          </div>
          <div className="p-2 space-y-1">
            {[
              {
                title: "Open Verification",
                desc: `${stats.pendingVerifications} pending`,
                to: "/admin/verify",
              },
              {
                title: "Incomplete Documents",
                desc: "Ask doctors to upload missing files",
                to: "/admin/incomplete-documents",
              },
              {
                title: "Open User Management",
                desc: `${stats.totalUsers} accounts`,
                to: "/admin/users",
              },
            ].map((action) => (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.to)}
                className="w-full flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-900">{action.title}</p>
                  <p className="text-[11px] text-slate-400 font-normal">{action.desc}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
