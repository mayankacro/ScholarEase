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
} from "lucide-react";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [scholarshipType, setScholarshipType] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        try {
            const res = await api.post("/api/auth/register", {
                name,
                email,
                password,
                scholarshipType,
            });

            console.log("Register Response:", res.data);

            navigate("/login");

        } catch (error: any) {
            setError(
                error.response?.data?.message || "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#0c0c0c] via-[#050505] to-[#020202] text-white flex">

            {/* ================= LOGO ================= */}

            {/* <div className="w-1/2 min-h-screen border-r border-gray-800 px-12 py-8"> */}

            <div className="w-1/2 min-h-screen border-r border-gray-800 px-6 lg:px-12 py-8">

                {/* Logo */}
                <div className="flex items-center gap-2">

                    <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-black font-bold">
                        Λ
                    </div>

                    <span className="font-semibold text-lg">
                        ScholarEase
                    </span>

                </div>


                {/* Left Content */}
                <div className="mt-12 lg:mt-20 max-w-xl">

                    <p className="text-xs tracking-[0.2em] text-blue-400 mb-5">
                        AI-POWERED DOCUMENT PLATFORM
                    </p>

                    <h1 className="text-6xl lg:text-7xl font-semibold leading-[1.05]">

                        Start your
                        <br />

                        Journey,
                        <br />

                        <span className="text-gray-700">
                            with ScholarEase.
                        </span>

                    </h1>


                    <p className="mt-6 text-gray-500 leading-6 max-w-md">

                        Create an account and get started with AI-powered
                        scholarhip document verification. Fast, simlpe, and secure.                        .

                    </p>


                    {/* Features */}
                    <div className="mt-8 space-y-3 text-sm">

                        <p className="text-gray-500">
                            <span className="text-green-400 mr-2">
                                •
                            </span>

                            Gemini Vision — images and PDFs
                        </p>

                        <p className="text-gray-500">
                            <span className="text-green-400 mr-2">
                                •
                            </span>

                            Auto fallback — never crashes
                        </p>

                        <p className="text-gray-500">
                            <span className="text-green-400 mr-2">
                                •
                            </span>

                            Email on admin decision
                        </p>

                        <p className="text-gray-500">
                            <span className="text-green-400 mr-2">
                                •
                            </span>

                            AI validation online
                        </p>

                        <p className="text-gray-700">
                            <span className="mr-2">
                                •
                            </span>

                            SC / ST / OBC / General
                        </p>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-12 lg:px-8 mt-6">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <h2 className="text-2xl font-semibold">
                        Create account
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Start your journey with ScholarEase
                    </p>


                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleRegister}
                        className="mt-7 space-y-5"
                    >

                        {/* Name */}
                        <div className="relative">
                            <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                                Full name
                            </label>
                            <User
                                size={16}
                                className="absolute left-3 top-11.5 -translate-y-1/2 text-zinc-500"
                            />

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-4 text-sm text-white outline-none  placeholder:text-zinc-700"
                            />
                        </div>


                        {/* Email */}
                        <div className="relative">

                            <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                                Email
                            </label>
                            <Mail
                                size={16}
                                className="absolute left-3 top-11.5 -translate-y-1/2 text-zinc-500"
                            />

                            <input
                                type="email"
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700"
                            />
                        </div>


                        {/* Password */}
                        <div className="relative">

                            <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                                Password
                            </label>
                            <Lock
                                size={16}
                                className="absolute left-3 top-11.5 -translate-y-1/2 text-zinc-500"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-12 text-sm text-white outline-none placeholder:text-zinc-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-12 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                            </button>
                        </div>

                        <div className="relative">

                            <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                                Password
                            </label>


                            <Lock
                                size={16}
                                className="absolute left-3 top-11.5 -translate-y-1/2 text-zinc-500"
                            />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-12 text-sm text-white outline-none placeholder:text-zinc-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-12 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>




                        {/* Scholarship Type */}
                        <div className="relative">
                            <GraduationCap
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                            />

                            <select
                                value={scholarshipType}
                                onChange={(e) => setScholarshipType(e.target.value)}
                                className="w-full appearance-none rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-10 text-sm text-white outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="ST">ST</option>
                                <option value="SC">SC</option>
                                <option value="OBC">OBC</option>
                                <option value="General">General</option>
                            </select>

                            <svg
                                className="mt-0.5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>

                        </div>


                        {/* Create Account */}
                        <button
                            type="submit"
                            className=" w-full rounded-lg border border-zinc-700 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-300"
                        >
                            Create account →
                        </button>

                    </form>


                    {/* Login */}
                    <div className="mt-7 text-center text-sm text-zinc-500">

                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-white hover:underline"
                        >
                            Sign in
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;




