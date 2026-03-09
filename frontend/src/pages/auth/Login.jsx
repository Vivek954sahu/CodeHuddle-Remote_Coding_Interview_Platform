import { LuFileCode2 } from "react-icons/lu";
import LoginForm from "../../components/auth/LoginForm";
import { Link, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "interviewer") {
      return <Navigate to="/interviewer/dashboard" replace />;
    }

    if (user.role === "candidate") {
      return <Navigate to="/candidate/dashboard" replace />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f6f7]">
      <div className="w-full max-w-md px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-block rounded-full p-3 mb-4 bg-purple-100">
            <LuFileCode2 className="h-8 w-8 text-purple-600" />
          </div>

          <h1 className="text-3xl font-bold">Code Huddle</h1>
          <p className="mt-1 text-[hsl(240,5%,10%)]">
            Smart remote coding interviews.
          </p>
        </div>

        <LoginForm />

        <div className="mt-4 text-center">
            <p className="text-sm text-[hsl(240,4%,27%)]">
                Don't have an account? {" "}
                <button className="p-0 text-purple-600 font-semibold underline-offset-4 hover:underline">
                    <Link to="/signup">Sign Up</Link>
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
