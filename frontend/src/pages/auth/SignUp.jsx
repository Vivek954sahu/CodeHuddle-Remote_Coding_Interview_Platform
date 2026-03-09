import { LuFileCode2 } from "react-icons/lu";
import { Link } from "react-router";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp = () => {
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

        <SignUpForm />

        <div className="mt-4 text-center">
          <p className="text-sm text-[hsl(240,4%,27%)]">
            Already have an account?{" "}
            <button className="p-0 text-purple-600 font-semibold underline-offset-4 hover:underline">
              <Link to="/login">Log In</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
