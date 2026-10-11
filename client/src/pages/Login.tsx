
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    FileCheck2,
    ShieldCheck,
    MailCheck,
    Sparkles,
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

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setEmailError("");
        setPasswordError("");

            const emailRegex =/^[a-zA-Z0-9._%+-]+@gmail\.(com|in)+$/;

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

            if (user.role !== "admin" && user.role !== "student") {
                setError("Unrecognized user role.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
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

    const features = [
        { icon: FileCheck2, text: "AI-powered document validation" },
        { icon: ShieldCheck, text: "Smart document verification" },
        { icon: MailCheck, text: "Email updates on admin decisions" },
        { icon: Sparkles, text: "AI-assisted scholarship workflow" },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#050507] text-white lg:h-screen lg:min-h-0 lg:flex-row lg:overflow-hidden">
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-blue-600/[0.08] blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/[0.06] blur-[120px]" />

            {/* Left Hero Section */}
            <section className="relative flex w-full min-w-0 flex-col border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:h-full lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-8 lg:py-5 xl:px-12">
                {/* Logo */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex w-fit items-center gap-2.5"
                    aria-label="ScholarEase home"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-black shadow-lg shadow-white/[0.05]">
                        Λ
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        ScholarEase
                    </span>
                </button>

                {/* Hero Content */}
                <div className="relative z-10 my-8 max-w-xl sm:my-10 lg:my-auto lg:py-5">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-blue-300 sm:text-xs">
                        <Sparkles size={13} />
                        AI-POWERED DOCUMENT PLATFORM
                    </div>

                    <h1 className="text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl xl:text-6xl">
                        Scholarship
                        <br />
                        docs,
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-zinc-500 bg-clip-text text-transparent">
                            done right.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
                        Upload from home. Get your scholarship documents
                        checked with AI. Less paperwork, fewer delays,
                        and a simpler application experience.
                    </p>

                    {/* Features */}
                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {features.map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 transition duration-200 hover:border-blue-400/20 hover:bg-blue-400/[0.04]"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.07]">
                                    <Icon
                                        size={16}
                                        className="text-emerald-400"
                                    />
                                </span>
                                <span className="text-xs leading-5 text-zinc-400">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Scholarship categories */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs text-zinc-500">
                            Categories
                        </span>
                        {["SC", "ST", "OBC", "General"].map((category) => (
                            <span
                                key={category}
                                className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-xs text-zinc-400"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 hidden text-xs text-zinc-600 lg:block">
                    A simpler way to manage your scholarship documents.
                </p>
            </section>

            {/* Right Login Section */}
            <section className="relative flex w-full min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:h-full lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:px-8 lg:py-6 xl:px-12">
                <form
                    noValidate
                    onSubmit={handleLogin}
                    className="relative w-full max-w-md min-w-0 rounded-2xl border border-white/[0.09] bg-[#0a0a0d]/90 p-5 shadow-2xl shadow-black/40 sm:p-8 lg:p-7 xl:p-9"
                >
                    {/* Form heading */}
                    <div className="mb-8">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08]">
                            <ShieldCheck
                                size={21}
                                className="text-blue-400"
                            />
                        </div>

                        <h2 className="text-3xl font-semibold tracking-tight">
                            Welcome back
                            <span className="text-blue-400">.</span>
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Sign in to continue to ScholarEase
                        </p>
                    </div>

                    {/* Backend / login error */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-400"
                        >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-red-400/50 text-[10px]">
                                !
                            </span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                        >
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            aria-invalid={Boolean(emailError)}
                            aria-describedby={emailError ? "email-error" : undefined}
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                                setError("");
                            }}
                            className={`w-full rounded-xl border bg-black/50 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-400/10 ${
                                emailError
                                    ? "border-red-400/70 focus:border-red-400"
                                    : "border-white/[0.10] focus:border-blue-400/70"
                            }`}
                        />

                        {emailError && (
                            <p
                                id="email-error"
                                role="alert"
                                className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-red-400"
                            >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-red-400/50 text-[10px] ">
                                    !
                                </span>
                                <span>{emailError}</span>
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                        >
                            PASSWORD
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                aria-invalid={Boolean(passwordError)}
                                aria-describedby={
                                    passwordError ? "password-error" : undefined
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                    setError("");
                                }}
                                className={`w-full rounded-xl border bg-black/50 px-4 py-3.5 pr-12 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-400/10 ${
                                    passwordError
                                        ? "border-red-400/70 focus:border-red-400"
                                        : "border-white/[0.10] focus:border-blue-400/70"
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>

                        {passwordError && (
                            <p
                                id="password-error"
                                role="alert"
                                className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-red-400"
                            >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-red-400/50 text-[10px]">
                                    !
                                </span>
                                <span>{passwordError}</span>
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition duration-200 hover:bg-blue-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Signing in..." : "Continue"}
                        {!isSubmitting && <span aria-hidden="true">→</span>}
                    </button>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/[0.08]" />
                        <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">
                            OR
                        </span>
                        <div className="h-px flex-1 bg-white/[0.08]" />
                    </div>

                    {/* Register */}
                    <p className="text-center text-sm text-zinc-500">
                        No account?
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="ml-1 font-medium text-blue-400 transition hover:text-blue-300"
                        >
                            Create one
                        </button>
                    </p>

                    <p className="mt-8 text-center text-[11px] leading-5 text-zinc-600">
                        Your scholarship journey, simplified.
                    </p>
                </form>
            </section>
        </div>
    );
}

export default Login;
