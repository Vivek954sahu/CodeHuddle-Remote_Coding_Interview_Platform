import { AiOutlineBarChart, AiOutlinePlusCircle } from "react-icons/ai";
import {
  LuCalendar,
  LuFileCode2,
  LuFileText,
  LuHistory,
  LuLayoutDashboard,
  LuSettings,
  LuUsers,
} from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const candidateLinks = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: LuLayoutDashboard },
  {
    label: "Upcoming Interviews",
    href: "/candidate/upcoming",
    icon: LuCalendar,
  },
  { label: "Past Interviews", href: "/candidate/history", icon: LuHistory },
  {
    label: "Performance",
    href: "/candidate/performance",
    icon: AiOutlineBarChart,
  },
  { label: "My Profile", href: "/profile", icon: LuFileText },
  { label: "Settings", href: "/settings", icon: LuSettings },
];

const interviewerLinks = [
  { label: "Dashboard", href: "/interviewer/dashboard", icon: LuLayoutDashboard },
  { label: "Create Interview", href: "/interviewer/create", icon: AiOutlinePlusCircle },
  { label: "Scheduled", href: "/interviewer/scheduled", icon: LuCalendar },
  { label: "Interview History", href: "/interviewer/history", icon: LuHistory },
  { label: "Problem Library", href: "/problems", icon: LuFileCode2 },
  { label: "Candidates", href: "/interviewer/candidates", icon: LuUsers },
  { label: "Settings", href: "/settings", icon: LuSettings },
];

const DashboardSidebar = ({ collapsed = false }) => {
  const { user } = useAuth();

  const location = useLocation();

  const links = user.role === "interviewer" ? interviewerLinks : candidateLinks;

  return (
    <aside
      className={`fixed left-0 top-19 h-[calc(100vh-4rem)] border-r border-purple-400 bg-purple-100 transition-all duration-300 z-40 rounded-r-lg ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Role Indidcator */}
      <div className="flex flex-col h-full">
        {!collapsed && (
          <div className="px-4 py-4 border-b border-purple-400">
            <p className="text-xs font-medium text-gray-800 uppercase tracking-wider">
              {user.role} Portal
            </p>
          </div>
        )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => {
             const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "shadow-sm bg-purple-500 text-purple-50" : "text-gray-800 hover:text-purple-800 hover:bg-purple-300"}`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${collapsed && "mx-auto"}`}
                  />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      {!collapsed && (
        <div className="p-4 border-t border-purple-400">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>System Online</span>
          </div>
        </div>
      )}

     </div>
    </aside>
  );
};

export default DashboardSidebar;
