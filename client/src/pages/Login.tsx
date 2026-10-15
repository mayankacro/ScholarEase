import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    FileCheck2,
    MailCheck,
    Sparkles,
    ArrowRight,
    Lock,
    Mail,
    CheckCircle2,
} from "lucide-react";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setEmailError("");
        setPasswordError("");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.trim()) {
            setEmailError("Email address is required.");
            return;
        }

        if (!emailRegex.test(email.trim())) {
            setEmailError("Enter a valid email address.");
            return;
        }

        if (!password) {
            setPasswordError("Password is required.");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await api.post("/api/auth/login", {
                email: email.trim(),
                password,
            });

            const { token, user } = res.data;

            if (!token || !user) {
                setError("Invalid response from server. Please try again.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "officer") {
                navigate("/officer");
            } else {
                navigate("/student");
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                    "Invalid email or password. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const highlights = [
        {
            title: "Smart AI OCR & Validation",
            desc: "Instant document text & authenticity checks",
            icon: Sparkles,
        },
        {
            title: "Automated Verification",
            desc: "Rapid administrative workflows & approvals",
            icon: FileCheck2,
        },
        {
            title: "Live Notification Sync",
            desc: "Real-time email and portal status dispatches",
            icon: MailCheck,
        },
    ];

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0b] text-[#ededee] font-['Hanken_Grotesk'] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden selection:bg-[#fafafa] selection:text-black">
            {/* quiet ambient glow */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_300px_at_20%_0%,rgba(255,255,255,0.05),transparent_70%)]" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md lg:max-w-[960px] rounded-2xl border border-white/[0.07] bg-[#101012] overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT — showcase */}
               <div className="hidden lg:flex p-8 sm:p-10 lg:p-12 flex-col justify-between lg:border-r border-white/[0.07]">
                    {/* Brand */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded-md border border-white/[0.14] grid place-items-center font-['JetBrains_Mono'] text-[11px] font-medium">
                                SE
                            </div>
                            <span className="text-[15px] font-semibold tracking-tight">ScholarEase</span>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#fafafa]" />
                            Operational
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="my-10 lg:my-12">
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#67676e]">
                            Scholarship verification
                        </span>
                        <h1 className="mt-4 text-3xl lg:text-[40px] font-semibold leading-[1.05] tracking-[-0.02em]">
                            Verify documents in seconds.
                        </h1>
                        <p className="mt-5 text-sm text-[#9b9ba3] leading-relaxed max-w-sm">
                            Sign in to upload, track and review scholarship documents — with an instant first read from AI.
                        </p>

                        {/* Highlights — minimal rows */}
                        <div className="mt-8 space-y-2.5 max-w-md">
                            {highlights.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group flex items-center gap-3.5 rounded-xl border border-white/[0.07] p-3 transition-colors duration-200 hover:border-white/[0.16]"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] text-[#ededee]">
                                            <Icon size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-medium text-[#ededee]">{item.title}</p>
                                            <p className="text-[11.5px] text-[#67676e] truncate">{item.desc}</p>
                                        </div>
                                        <CheckCircle2 size={15} className="text-[#67676e] transition-colors group-hover:text-[#ededee]" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[11px] text-[#67676e] pt-4 border-t border-white/[0.06]">
                        <span>SC · ST · OBC · GENERAL</span>
                        <span>JWT SECURED</span>
                    </div>
                </div>

                {/* RIGHT — form */}
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0c0c0e]">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#67676e]">
                                Portal access
                            </span>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Welcome back</h2>
                            <p className="mt-1.5 text-[13px] text-[#9b9ba3]">
                                Sign in to your student or administrative dashboard.
                            </p>
                        </div>

                        {/* Error alert */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex items-start gap-2.5 rounded-lg border border-white/[0.18] bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] text-[#ededee]"
                            >
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/[0.3] font-['JetBrains_Mono'] text-[10px]">
                                    !
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form noValidate onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#9b9ba3]"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={15}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="student@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError("");
                                            setError("");
                                        }}
                                        className={`w-full rounded-lg border bg-[#0a0a0b] py-2.5 pl-10 pr-4 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors duration-200 focus:border-white/60 ${
                                            emailError ? "border-white/40" : "border-white/[0.1]"
                                        }`}
                                    />
                                </div>
                                {emailError && (
                                    <p className="mt-1.5 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {emailError}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#9b9ba3]"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                                    />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError("");
                                            setError("");
                                        }}
                                        className={`w-full rounded-lg border bg-[#0a0a0b] py-2.5 pl-10 pr-11 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors duration-200 focus:border-white/60 ${
                                            passwordError ? "border-white/40" : "border-white/[0.1]"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#67676e] hover:text-[#ededee] transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="mt-1.5 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {passwordError}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#fafafa] py-2.5 text-[13px] font-semibold text-[#0a0a0b] transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span>Signing in…</span>
                                ) : (
                                    <>
                                        <span>Sign in to dashboard</span>
                                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-7">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.07]" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#0c0c0e] px-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#67676e]">
                                    or
                                </span>
                            </div>
                        </div>

                        {/* Register link */}
                        <p className="text-center text-[13px] text-[#9b9ba3]">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="font-semibold text-[#ededee] underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-colors cursor-pointer"
                            >
                                Create account
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;