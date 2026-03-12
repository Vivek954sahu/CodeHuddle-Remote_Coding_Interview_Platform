import { LuFileCode2, LuLogOut } from "react-icons/lu"
import { useAuth } from "../../context/AuthContext"


const DashboardNav = () => {
    const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full border-b border-purple-400 bg-purple-50 shadow-sm rounded-md">
        <div className="container px-4 py-4 mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <LuFileCode2 className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-purple-700">Code Huddle</h1>
            </div>

            <div className="flex- items-center space-x-4">
                <span className="text-md text-purple-950 font-medium">
                    Welcome, {user?.name || "User"} 
                </span>

                <button
                className="h-10 inline-flex px-4 py-2 items-center justify-center gap-2 border border-purple-500 hover:bg-purple-300 whitespace-nowrap rounded-md text-sm font-medium"
                onClick={logout}
                >
                    <LuLogOut className="h-4 w-4 mr-1" />
                    Logout
                </button>

            </div>
        </div>
    </header>
  )
}

export default DashboardNav

