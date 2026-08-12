import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, BadgeCheck, UsersRound, FileWarning, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/admin");
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists() || userDoc.data().isAdmin !== true) {
          await signOut(auth);
          toast.error("Access denied. Admin privileges required.");
          navigate("/admin");
        } else {
          setAdminEmail(user.email || userDoc.data().email || "Admin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        await signOut(auth);
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", path: "/admin/home", icon: LayoutDashboard },
    { name: "Verification", path: "/admin/verify", icon: BadgeCheck },
    { name: "Incomplete Docs", path: "/admin/incomplete-documents", icon: FileWarning },
    { name: "User Management", path: "/admin/users", icon: UsersRound },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const pageTitle =
    location.pathname.includes("/incomplete-documents")
      ? "Incomplete Documents"
      : location.pathname.includes("/verify")
      ? "Verification"
      : location.pathname.includes("/users")
      ? "User Management"
      : location.pathname.includes("/hospital") || location.pathname.includes("/doctor")
      ? "Profile Review"
      : "Dashboard";

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-14 items-center gap-2 px-3.5 border-b border-slate-100">
        <Link to="/admin/home" className="flex items-center gap-2 min-w-0">
          <img src="/logo.png" alt="DrStethos" className="h-6 w-6 rounded-full object-contain flex-shrink-0" />
          <span className="text-[13px] font-semibold text-slate-900 tracking-tight truncate">
            DrStethos
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`} />
              <span className="truncate text-left leading-tight">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-2.5 space-y-1.5">
        <p className="px-2 text-[10px] text-slate-400 truncate">{adminEmail}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <aside className="hidden md:flex w-[176px] flex-shrink-0 border-r border-slate-200 bg-white">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[176px] border-r border-slate-200 bg-white transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-2 top-3 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight">{pageTitle}</h1>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
