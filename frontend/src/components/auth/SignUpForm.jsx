import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AiFillGoogleCircle } from "react-icons/ai";

const SignUpForm = () => {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = () => {};

  const handleSubmit = async (e) => {
    
        e.preventDefault();

        try {
            setIsSubmitting(true);

            if(password !== confirmPassword) {
               setError("Passwords must be same.");
               return;
            }
           
            setError("");

            await register({name, email, password, role});
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
  };

  return (
    <div className="w-full max-w-md rounded-lg shadow-sm border border-purple-300 text-[hsl(240,5%,10%)] bg-[hsl(0,0%,98%)]">
      <div className="flex flex-col space-y-1.5 p-6 items-center">
        <div className="text-2xl font-bold leading-none tracking-tight">
          Create Account
        </div>

        <div className="text-sm text-[hsl(240,5%,10%)]">
          Join our platform to start coding interviews.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 p-6 pt-0">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold">
              Full Name
            </label>
            <input
              type="name"
              id="name"
              className="h-10 w-full flex rounded-md mt-2 border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="h-10 w-full flex rounded-md mt-2 border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="h-10 w-full flex rounded-md mt-2 border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type="text"
              id="confirmPassword"
              className="h-10 w-full flex rounded-md mt-2 border border-[#b2b2b2] px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(258,89%,66%)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Role</label>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="role"
                  id="candidate"
                  value="candidate"
                  checked={role === "candidate"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-purple-500"
                />
                <label htmlFor="candidate" className="text-sm">Candidate</label>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  name="role"
                  id="interviewer"
                  value="interviewer"
                  checked={role === "interviewer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-purple-500"
                />
                <label htmlFor="interviewer" className="text-sm">Interviewer</label>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm font-medium text-[hsl(0,72%,50%)]">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center p-6 pt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 py-2 px-3 border-[hsl(240,4%,83%)] bg-purple-500 hover:bg-purple-400 text-base font-semibold rounded-md text-[#ffffff]"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      <div className="space-y-1.5 p-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-semibold">OR</p>
          <p className="text-md m-2 font-medium">Sign In with Google</p>
          <button onClick={handleGoogleLogin}>
            <AiFillGoogleCircle className="w-8 h-8 text-purple-600 hover:text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
