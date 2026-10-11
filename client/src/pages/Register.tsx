
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    GraduationCap,
    FileCheck2,
    ShieldCheck,
    MailCheck,
    Sparkles,
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [scholarshipType, setScholarshipType] = useState("");

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.(com|in)+$/;

    const passwordRules = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "One lowercase letter", valid: /[a-z]/.test(password) },
        { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "One number", valid: /[0-9]/.test(password) },
        {
            label: "One special character",
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const clearFieldError = (field: string) => {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        setError("");
    };

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setFieldErrors({});

        const errors: Record<string, string> = {};

        if (!name.trim()) {
            errors.name = "Please enter your full name.";
        } else if (name.trim().length < 2) {
            errors.name = "Name must contain at least 2 characters.";
        }

        if (!email.trim()) {
            errors.email = "Email address is required.";
        } else if (!emailRegex.test(email.trim())) {
            errors.email = "Enter a valid email address.";
        }

        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(password)) {
            errors.password = "Add at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            errors.password = "Add at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            errors.password = "Add at least one number.";
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            errors.password = "Add at least one special character.";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        if (!scholarshipType) {
            errors.scholarshipType = "Please select your category.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);

            await api.post("/api/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
                scholarshipType,
            });

            navigate("/login", {
                state: { message: "Account created successfully. Please sign in." },
            });
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full rounded-xl border bg-black/50 py-3.5 pl-10 pr-11 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-400/10 ${fieldErrors[field]
            ? "border-red-400/70 focus:border-red-400"
            : "border-white/[0.10] focus:border-blue-400/70"
        }`;

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

            {/* Left hero section */}
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

                {/* Hero content */}
                <div className="relative z-10 my-8 max-w-xl sm:my-10 lg:my-auto lg:py-5">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-blue-300 sm:text-xs">
                        <Sparkles size={13} />
                        AI-POWERED DOCUMENT PLATFORM
                    </div>

                    <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
                        Start your
                        <br />
                        journey,
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-zinc-500 bg-clip-text text-transparent">
                            with ScholarEase.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
                        Create your account and get started with scholarship
                        document verification. A simpler way to manage your
                        scholarship journey.
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

                    {/* Categories */}
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

            {/* Right registration section */}
            <section className="relative flex w-full min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:h-full lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:px-8 lg:py-6 xl:px-12">
                <form
                    noValidate
                    onSubmit={handleRegister}
                    className="relative w-full max-w-lg min-w-0 rounded-2xl border border-white/[0.09] bg-[#0a0a0d]/90 p-5 shadow-2xl shadow-black/40 sm:p-8 lg:p-7 xl:p-9"
                >
                    {/* Heading */}
                    <div className="mb-5">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08]">
                            <User size={21} className="text-blue-400" />
                        </div>

                        <h2 className="text-3xl font-semibold tracking-tight">
                            Create account
                            <span className="text-blue-400">.</span>
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Start your journey with ScholarEase
                        </p>
                    </div>

                    {/* API error */}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                        {/* Full name */}
                        <div>
                            <label
                                htmlFor="register-name"
                                className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                            >
                                FULL NAME
                            </label>

                            <div className="relative">
                                <User
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />
                                <input
                                    id="register-name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    aria-invalid={Boolean(fieldErrors.name)}
                                    aria-describedby={
                                        fieldErrors.name ? "name-error" : undefined
                                    }
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        clearFieldError("name");
                                    }}
                                    className={inputClass("name")}
                                />
                            </div>

                            {fieldErrors.name && (
                                <p
                                    id="name-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="register-email"
                                className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                            >
                                EMAIL ADDRESS
                            </label>

                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />
                                <input
                                    id="register-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@email.com"
                                    value={email}
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    aria-describedby={
                                        fieldErrors.email ? "email-error" : undefined
                                    }
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearFieldError("email");
                                    }}
                                    className={inputClass("email")}
                                />
                            </div>

                            {fieldErrors.email && (
                                <p
                                    id="email-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="register-password"
                                className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                            >
                                PASSWORD
                            </label>

                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    value={password}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby={
                                        fieldErrors.password
                                            ? "password-error"
                                            : undefined
                                    }
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearFieldError("password");
                                    }}
                                    className={inputClass("password")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:text-white"
                                >
                                    {showPassword ? (
                                        <Eye size={17} />
                                    ) : (
                                        <EyeOff size={17} />
                                    )}
                                </button>
                            </div>

                            {fieldErrors.password && (
                                <p
                                    id="password-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {fieldErrors.password}
                                </p>
                            )}


                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="register-confirm-password"
                                className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                            >
                                CONFIRM PASSWORD
                            </label>

                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />
                                <input
                                    id="register-confirm-password"
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    aria-invalid={Boolean(
                                        fieldErrors.confirmPassword
                                    )}
                                    aria-describedby={
                                        fieldErrors.confirmPassword
                                            ? "confirm-password-error"
                                            : undefined
                                    }
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        clearFieldError("confirmPassword");
                                    }}
                                    className={inputClass("confirmPassword")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((prev) => !prev)
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:text-white"
                                >
                                    {showConfirmPassword ? (
                                        <Eye size={17} />
                                    ) : (
                                        <EyeOff size={17} />
                                    )}
                                </button>
                            </div>

                            {fieldErrors.confirmPassword && (
                                <p
                                    id="confirm-password-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {isPasswordFocused && (
                            <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 sm:col-span-2">
                                <p className="mb-2 text-[11px] font-medium tracking-wide text-zinc-400">
                                    PASSWORD REQUIREMENTS
                                </p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    {passwordRules.map((rule) => (
                                        <div
                                            key={rule.label}
                                            className={`flex items-center gap-2 text-xs ${rule.valid
                                                    ? "text-emerald-400"
                                                    : "text-zinc-500"
                                                }`}
                                        >
                                            <span>{rule.valid ? "✓" : "○"}</span>
                                            <span>{rule.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="register-category"
                                className="mb-2 block text-xs font-medium tracking-wider text-zinc-400"
                            >
                                SCHOLARSHIP CATEGORY
                            </label>

                            <div className="relative">
                                <GraduationCap
                                    size={17}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />

                                
<CustomDropdown
    value={scholarshipType}
    onChange={(value) => {
        setScholarshipType(value);
        clearFieldError("scholarshipType");
    }}
    placeholder="Select your category"
    buttonClassName="!rounded-xl !py-3.5 !pl-10 !pr-10"
    buttonColorClassName={`border-white/[0.10] bg-black/50 text-white hover:border-white/20 ${
        fieldErrors.scholarshipType
            ? "!border-red-400/70"
            : ""
    }`}
    options={[
        { label:"Select your category", value:""},
        { label: "SC", value: "SC" },
        { label: "ST", value: "ST" },
        { label: "OBC", value: "OBC" },
        { label: "General", value: "General" },
        {label: "pwd", value: "pwd"}        
    ]}
/>


                               
                            </div>

                            {fieldErrors.scholarshipType && (
                                <p
                                    id="category-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {fieldErrors.scholarshipType}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Creating account..." : "Create account"}
                                {!isSubmitting && <span>→</span>}
                            </button>
                        </div>
                    </div>

                    {/* Sign in */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/[0.08]" />
                        <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">
                            OR
                        </span>
                        <div className="h-px flex-1 bg-white/[0.08]" />
                    </div>

                    <p className="text-center text-sm text-zinc-500">
                        Already have an account?
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="ml-1 font-medium text-blue-400 transition hover:text-blue-300"
                        >
                            Sign in
                        </button>
                    </p>

                    <p className="mt-6 text-center text-[11px] leading-5 text-zinc-600">
                        Your scholarship journey, simplified.
                    </p>
                </form>
            </section>
        </div>
    );
}

export default Register;
