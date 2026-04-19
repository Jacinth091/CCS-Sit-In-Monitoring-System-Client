import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import ccsLogo from "../assets/images/png/uccslogobg.png";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";

const inputStyles =
  "w-full px-0 py-2 bg-transparent border-0 border-b border-border focus:ring-0 focus:outline-none focus:border-primary-hover text-primary text-sm transition-colors duration-150 placeholder:text-primary-light/50";
const labelStyles =
  "block text-[10px] font-bold tracking-wider uppercase text-primary/60 mb-1";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!studentId || !password) {
      toast.error("Please enter both ID Number and Password.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        student_id: studentId,
        password: password,
      };
      const response = await authService.login(payload);

      if (response) {
        login(response);
        
        // Use intended destination if available, otherwise role-based default
        if (from) {
          toast.success(`Welcome back, ${response.first_name || "User"}!`);
          navigate(from, { replace: true });
        } else if (response.role === "admin") {
          toast.success("Welcome to the Admin Dashboard!");
          navigate("/admin/dashboard", { replace: true });
        } else {
          toast.success(`Welcome back, ${response.first_name || "Student"}!`);
          navigate("/student/dashboard", { replace: true });
        }
      }
    } catch (err) {
      toast.error(err.customMessage || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col md:flex-row">
        <div
          className="hidden md:flex flex-col justify-between p-10 md:w-2/5 bg-primary bg-cover bg-center relative"
          style={{ backgroundImage: "url('/login-illustration.jpg')" }}
        >
          <div className="absolute inset-0 bg-primary/90" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center gap-2">
                <img
                  src={ccsLogo}
                  alt="CCS Logo"
                  className="h-9 w-9 object-contain"
                />
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-sand">
                  CCS Sit-In Monitoring
                </span>
              </a>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-brand-sand leading-snug mb-3">
                Welcome back!
              </h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-xs font-medium">
                Sign in to monitor lab sessions, track your sit-in history, and
                stay connected with the CCS community.
              </p>
              <a
                href="/auth/signup"
                className="mt-6 inline-block text-sm font-bold text-brand-sand border border-brand-sand/30 px-6 py-2.5 rounded-md hover:bg-brand-sand/10 transition duration-150 uppercase tracking-wider"
              >
                Create an account →
              </a>
            </div>
            <p className="text-xs text-primary-light font-medium">
              Tip: Use your institutional ID to log in.
            </p>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-primary-light hover:text-primary font-bold mb-8 transition-colors duration-150 self-start uppercase tracking-widest"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-primary">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-primary-light font-medium">
              Enter your credentials to continue.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className={labelStyles}>ID Number</label>
              <input
                type="text"
                placeholder="e.g. 12345678"
                className={inputStyles}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyles}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputStyles} pr-8`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-light hover:text-primary transition-colors duration-150"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-primary/70 cursor-pointer select-none font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-border accent-primary-hover shadow-sm"
                />
                Remember me
              </label>
              <a
                href="/auth/forgot-password"
                className="text-primary-hover hover:underline font-bold"
              >
                Forgot password?
              </a>
            </div>

            <hr className="border-border" />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-brand-sand font-bold py-3.5 rounded-md transition-all duration-150 shadow-md text-sm tracking-widest uppercase ${
                isLoading
                  ? "bg-primary-light cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-xs text-primary-light font-medium text-center">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-primary-hover font-bold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}