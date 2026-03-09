import { useState } from "react"
import { useAuth } from "../../context/AuthContext";
import { AiFillGoogleCircle } from "react-icons/ai";


const LoginForm = () => {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            await login({email, password});
        } catch (err) {
            setError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {

    };

  return (
    <div className="w-full max-w-md rounded-lg shadow-sm border border-purple-300 text-[hsl(240,5%,10%)] bg-[hsl(0,0%,98%)]">
        <div className="flex flex-col space-y-1.5 p-6 items-center">
            <div className="text-2xl font-bold leading-none tracking-tight">
                Sign In
            </div>

             <div className="text-sm text-[hsl(240,5%,10%)]">
                Enter your creadentials to access your account.
             </div>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="space-y-4 p-6 pt-0">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold">Email :</label>
                    <input 
                    type="email"
                    id="email"
                    className="h-10 w-full flex rounded-md border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
                    placeholder="abc@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold">Password :</label>
                    <input 
                    type="password"
                    id="password"
                    className="h-10 w-full flex rounded-md border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                {error && <div className="text-sm font-medium text-[hsl(0,72%,50%)]">{ error }</div>}
            </div>

            <div className="flex flex-col items-center p-6 pt-0">
                <button type="submit" disabled={isSubmitting} className="w-full h-10 py-2 px-3 border-[hsl(240,4%,83%)] bg-purple-500 hover:bg-purple-400 text-base font-semibold rounded-md text-[#ffffff]">
                    {isSubmitting ? "Logging In..." : "Log In"}
                </button>
            </div>
        </form>

        <div className="space-y-1.5 p-6">
            <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-semibold">OR</p>
                <p className="text-md m-2 font-medium">Sign In with Google</p>
                <button onClick={handleGoogleLogin}>
                    <AiFillGoogleCircle className="w-8 h-8 text-purple-600 hover:text-purple-400"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default LoginForm
