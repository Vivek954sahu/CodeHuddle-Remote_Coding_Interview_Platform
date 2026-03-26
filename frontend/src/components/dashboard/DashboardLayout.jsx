import { useState } from "react"
import DashboardSidebar from "./DashboardSidebar";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import DashboardNav from "./DashboardNav";


const DashboardLayout = ({ children }) => {

    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-purple-300">
      <DashboardNav />
      <DashboardSidebar collapsed={sideBarCollapsed} />

      <div className={`transition-all duration-300 pt-16 ${sideBarCollapsed ? "pl-16" : "pl-64"}`}>
        {/* toggle sidebar */}
        <button
        onClick={() => setSideBarCollapsed(!sideBarCollapsed)}
        className="fixed top-20 z-50 transition-all duration-300 bg-purple-100 border border-purple-400 shadow-sm hover:bg-gray-500 h-10 w-10 inline-flex items-center justify-center rounded-md gap-2"
        >
            {sideBarCollapsed ? 
             <LuPanelLeftOpen className="h-4 w-4" /> :
             <LuPanelLeftClose className="h-4 w-4" />}
        </button>

        <main className="container mx-auto px-6 py-6">
            {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
