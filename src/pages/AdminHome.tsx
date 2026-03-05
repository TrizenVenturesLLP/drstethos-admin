import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, CheckCircle, Clock } from "lucide-react";
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

        // Get total users count using server-side aggregation
        const totalUsersSnapshot = await getCountFromServer(usersRef);
        const totalUsers = totalUsersSnapshot.data().count;

        // Get verified users count
        let verifiedCount = 0;
        try {
          const verifiedQuery = query(usersRef, where("isVerified", "==", true));
          const verifiedSnapshot = await getCountFromServer(verifiedQuery);
          verifiedCount = verifiedSnapshot.data().count;
        } catch (err) {
          console.log("No verified users yet:", err);
        }

        // Get pending verifications count (users with profileId but not verified)
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

        // Calculate verified today
        let verifiedToday = 0;
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTimestamp = Timestamp.fromDate(today);

          const verifiedTodayQuery = query(
            usersRef,
            where("verifiedAt", ">=", todayTimestamp)
          );
          const verifiedTodaySnapshot = await getCountFromServer(verifiedTodayQuery);
          verifiedToday = verifiedTodaySnapshot.data().count;
        } catch (err) {
          console.log("No users verified today:", err);
        }

        // Get active sessions (users active in last 24 hours)
        let activeSessions = 0;
        try {
          const yesterday = new Date();
          yesterday.setHours(yesterday.getHours() - 24);
          const yesterdayTimestamp = Timestamp.fromDate(yesterday);

          const activeQuery = query(
            usersRef,
            where("lastSeenAt", ">=", yesterdayTimestamp)
          );
          const activeSnapshot = await getCountFromServer(activeQuery);
          activeSessions = activeSnapshot.data().count;
        } catch (err) {
          console.log("No active sessions:", err);
        }

        setStats({
          totalUsers,
          pendingVerifications,
          verifiedToday,
          activeSessions,
        });

        // Fetch recent activities - only get limited recent users
        const recentActivities: ActivityItem[] = [];
        const recentUsersQuery = query(usersRef, where("profileId", "!=", null));
        const recentUsersSnapshot = await getDocs(recentUsersQuery);

        // Get some recent users for activity feed
        const recentUsers = recentUsersSnapshot.docs
          .sort((a, b) => {
            const aTime = a.data().createdAt?.toDate() || new Date(0);
            const bTime = b.data().createdAt?.toDate() || new Date(0);
            return bTime.getTime() - aTime.getTime();
          })
          .slice(0, 4);

        recentUsers.forEach((doc) => {
          const data = doc.data();
          const timeDiff = Date.now() - (data.createdAt?.toDate().getTime() || 0);
          const timeAgo = formatTimeAgo(timeDiff);

          if (data.isVerified) {
            recentActivities.push({
              action: `${data.role === 'doctor' ? 'Doctor' : 'Hospital'} verified - ${data.name}`,
              time: timeAgo,
              type: "success",
            });
          } else {
            recentActivities.push({
              action: `New user registered - ${data.name}`,
              time: timeAgo,
              type: "info",
            });
          }
        });

        setActivities(recentActivities);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTimeAgo = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const statsDisplay = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      description: "Active registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications.toString(),
      icon: Clock,
      description: "Awaiting review",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Verified Today",
      value: stats.verifiedToday.toString(),
      icon: CheckCircle,
      description: "Completed verifications",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions.toString(),
      icon: Activity,
      description: "Active in last 24 hours",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome to the admin control panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <span className="text-sm text-slate-700">{activity.action}</span>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="font-medium text-slate-900">Review Pending Verifications</div>
                <div className="text-sm text-slate-500">23 items awaiting review</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="font-medium text-slate-900">Manage Users</div>
                <div className="text-sm text-slate-500">View and edit user accounts</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="font-medium text-slate-900">System Settings</div>
                <div className="text-sm text-slate-500">Configure system parameters</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
