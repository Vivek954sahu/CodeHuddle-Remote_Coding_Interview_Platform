import { LuFileCode2 } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";


const NavBar = () => {
    const { isAuthenticated, user } = useAuth();

  return (
    <header className="border-b border-purple-400 bg-purple-50 shadow-sm rounded-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <LuFileCode2 className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold text-purple-700">Code Huddle</span>
            </div>

            {/* Navigation Links */}
            <nav>
                <div className="flex items-center space-x-4">
                    { isAuthenticated ? (
                        <button className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm text-white bg-purple-600 hover:bg-purple-500/70">
                            <Link to={user.role === "interviewer" ? "/interviewer/dashboard" : "/candidate/dashboard"}>Go to Dashboard</Link>
                        </button>
                    ) : (
                        <>
                        <button className="h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium  bg-[hsl(0,5%,92%)] hover:bg-[hsl(270,90%,84%)] text-[hsl(270,100%,50%)] hover:text-[hsl(180,1%,15%)]">
                            <Link to="/login">Login</Link>
                        </button>

                        <button className="h-10 px-4 py-2 inline-flex items-center justify-center gap-2  whitespace-nowrap rounded-md text-sm font-medium text-[hsl(276,15%,94%)] bg-purple-600 hover:bg-purple-500/70">
                            <Link to="/signup">Sign Up</Link>
                        </button>
                        </>
                    )}
                </div>
            </nav>
        </div>
    </header>
  );
}

export default NavBar
