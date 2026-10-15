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
    MailCheck,
    Sparkles,
    ArrowRight,
    CheckCircle2,
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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const passwordRules = [
        { label: "8+ characters", valid: password.length >= 8 },
        { label: "Lowercase", valid: /[a-z]/.test(password) },
        { label: "Uppercase", valid: /[A-Z]/.test(password) },
        { label: "Number", valid: /[0-9]/.test(password) },
        { label: "Symbol", valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const clearFieldError = (field: string) => {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        setError("");
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setFieldErrors({});

        const errors: Record<string, string> = {};

        if (!name.trim()) {
            errors.name = "Full name is required.";
        } else if (name.trim().length < 2) {
            errors.name = "Name must have at least 2 characters.";
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
            errors.password = "Must include an uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            errors.password = "Must include a lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            errors.password = "Must include at least one number.";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        if (!scholarshipType) {
            errors.scholarshipType = "Select your scholarship category.";
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
                "Registration failed. Please check inputs and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full rounded-lg border bg-[#0a0a0b] py-2.5 pl-10 pr-10 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors duration-200 focus:border-white/60 ${
            fieldErrors[field] ? "border-white/40" : "border-white/[0.1]"
        }`;

    const highlights = [
        {
            title: "Automated Eligibility Scanner",
            desc: "Smart category mapping & document matching",
            icon: Sparkles,
        },
        {
            title: "Instant Cloud Storage",
            desc: "Encrypted & authenticated file repositories",
            icon: FileCheck2,
        },
        {
            title: "Transparent Review Timeline",
            desc: "Step-by-step audit trail for each submission",
            icon: MailCheck,
        },
    ];

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0b] text-[#ededee] font-['Hanken_Grotesk'] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden selection:bg-[#fafafa] selection:text-black">
            {/* quiet ambient glow */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_300px_at_80%_0%,rgba(255,255,255,0.05),transparent_70%)]" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-xl lg:max-w-[1060px] rounded-2xl border border-white/[0.07] bg-[#101012] overflow-hidden grid grid-cols-1 lg:grid-cols-12">

                {/* LEFT — showcase */}
               <div className="hidden lg:flex lg:col-span-5 p-8 sm:p-10 lg:p-12 flex-col justify-between lg:border-r border-white/[0.07]">
                    {/* Brand */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded-md border border-white/[0.14] grid place-items-center font-['JetBrains_Mono'] text-[11px] font-medium">
                                SE
                            </div>
                            <span className="text-[15px] font-semibold tracking-tight">ScholarEase</span>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">
                            Sign up
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="my-10 lg:my-12">
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#67676e]">
                            Fast onboarding
                        </span>
                        <h1 className="mt-4 text-3xl lg:text-[40px] font-semibold leading-[1.05] tracking-[-0.02em]">
                            Apply once,<br />verify forever.
                        </h1>
                        <p className="mt-5 text-sm text-[#9b9ba3] leading-relaxed max-w-sm">
                            Create your scholar profile. AI validates your certificates and streamlines admin reviews in hours, not weeks.
                        </p>

                        {/* Highlights — minimal rows */}
                        <div className="mt-8 space-y-2.5">
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
                        <span>ZERO PAPER</span>
                        <span>MULTI-ROLE ACCESS</span>
                    </div>
                </div>

                {/* RIGHT — form */}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0c0c0e]">
                    <div className="max-w-xl mx-auto w-full">
                        <div className="mb-7">
                            <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#67676e]">
                                Get started free
                            </span>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create your account</h2>
                            <p className="mt-1.5 text-[13px] text-[#9b9ba3]">
                                Fill in your basic details to set up your student scholarship profile.
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

                        <form noValidate onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="register-name"
                                        className="mb-1.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#9b9ba3]"
                                    >
                                        Full name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={15}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                                        />
                                        <input
                                            id="register-name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Aarav Sharma"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                clearFieldError("name");
                                            }}
                                            className={inputClass("name")}
                                        />
                                    </div>
                                    {fieldErrors.name && (
                                        <p className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fieldErrors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="register-email"
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
                                            id="register-email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="aarav@gmail.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                clearFieldError("email");
                                            }}
                                            className={inputClass("email")}
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fieldErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="register-password"
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
                                            id="register-password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="••••••••••••"
                                            value={password}
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
                                            onClick={() => setShowPassword((p) => !p)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#67676e] hover:text-[#ededee] transition-colors"
                                            aria-label="Toggle password"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fieldErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="register-confirm-password"
                                        className="mb-1.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#9b9ba3]"
                                    >
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={15}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                                        />
                                        <input
                                            id="register-confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="••••••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                clearFieldError("confirmPassword");
                                            }}
                                            className={inputClass("confirmPassword")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((p) => !p)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#67676e] hover:text-[#ededee] transition-colors"
                                            aria-label="Toggle confirm password"
                                        >
                                            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && (
                                        <p className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fieldErrors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Strength pills */}
                            {isPasswordFocused && (
                                <div className="rounded-lg border border-white/[0.07] bg-[#0a0a0b] p-3">
                                    <p className="mb-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#67676e]">
                                        Password strength
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {passwordRules.map((rule) => (
                                            <span
                                                key={rule.label}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] border transition-colors ${
                                                    rule.valid
                                                        ? "bg-[#fafafa] text-black border-transparent"
                                                        : "bg-transparent text-[#67676e] border-white/[0.1]"
                                                }`}
                                            >
                                                <span>{rule.valid ? "✓" : "○"}</span>
                                                {rule.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Scholarship Category Dropdown */}
                            <div>
                                <label
                                    htmlFor="register-category"
                                    className="mb-1.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#9b9ba3]"
                                >
                                    Scholarship category
                                </label>
                                <div className="relative">
                                    <GraduationCap
                                        size={16}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e] z-10"
                                    />
                                    <CustomDropdown
                                        value={scholarshipType}
                                        onChange={(value) => {
                                            setScholarshipType(value);
                                            clearFieldError("scholarshipType");
                                        }}
                                        placeholder="Select your reservation/scholarship category"
                                        buttonClassName="!py-2.5 !pl-10 !pr-10 !text-[13px] !rounded-lg"
                                        buttonColorClassName={`border-white/[0.1] bg-[#0a0a0b] text-[#ededee] ${
                                            fieldErrors.scholarshipType ? "!border-white/40" : ""
                                        }`}
                                        options={[
                                            { label: "Select your category", value: "" },
                                            { label: "SC - Scheduled Caste", value: "SC" },
                                            { label: "ST - Scheduled Tribe", value: "ST" },
                                            { label: "OBC - Other Backward Class", value: "OBC" },
                                            { label: "General Merit", value: "General" },
                                        ]}
                                    />
                                </div>
                                {fieldErrors.scholarshipType && (
                                    <p className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fieldErrors.scholarshipType}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#fafafa] py-2.5 text-[13px] font-semibold text-[#0a0a0b] transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span>Creating account…</span>
                                ) : (
                                    <>
                                        <span>Create ScholarEase account</span>
                                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.07]" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#0c0c0e] px-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#67676e]">
                                    or
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-[13px] text-[#9b9ba3]">
                            Already registered?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="font-semibold text-[#ededee] underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-colors cursor-pointer"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;