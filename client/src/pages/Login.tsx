import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    // useSate() --> React ka ek Hook hai jo component ke andar data ko remember/state mein rakhne deta hai.
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await api.post("/api/auth/login", {
                email: email.trim(),
                password,
            });

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "student") {
                navigate("/student");
            } else {
                setError("Unrecognized user role");
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    // const getProfile = async () => {
    //     try {
    //         const res = await api.get("/api/auth/profile");
    //         console.log("Profile:", res.data)
    //     } catch(error: any){
    //         console.log("Profile failed:",
    //             error.response?.data?.message || "Profile failed"
    //         );
    //     }
    // };

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
                <div className="mt-20 lg:mt-20 max-w-xl">

                    <p className="text-xs tracking-[0.2em] text-gray-500 mb-5">
                        AI-POWERED DOCUMENT PLATFORM
                    </p>

                    <h1 className="text-6xl lg:text-7xl font-semibold leading-[1.05]">

                        Scholarship
                        <br />

                        docs,
                        <br />

                        <span className="text-gray-700">
                            done right.
                        </span>

                    </h1>


                    <p className="mt-6 text-gray-500 leading-6 max-w-md">

                        Upload from home. Gemini Vision validates
                        instantly. No queues, no counter rejections,
                        no wasted trips.

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


            {/* ================= RIGHT SIDE ================= */}

            <div className="flex w-full lg:w-1/2 items-center justify-center px-12 lg:px-8 py-10 mt-8">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md">


                    {/* Heading */}
                    <h2 className="text-2xl font-semibold mb-1">
                        Sign in
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        Continue to ScholarEase
                    </p>


                    


                    {/* Error */}
                    {error && (
                        <p className="w-full px-3 py-1 pr-12 mb-3 rounded-lg bg-red-500/10 border border-red-400 text-red-500  outline-none transition">
                            {error}
                        </p>
                    )}


                    {/* Email */}
                    <div className="mb-5">

                        <label className="block text-xs tracking-wider text-gray-600 mb-2">
                            EMAIL
                        </label>

                        <input
                            type="email"
                            required
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-800 text-white placeholder-gray-700 outline-none focus:border-gray-500 transition"
                        />

                    </div>


                    {/* Password */}

                    <div className="mb-5">
                        <label className="block text-xs tracking-wider text-gray-600 mb-2">
                            PASSWORD
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-transparent border border-gray-800 text-white placeholder-gray-700 outline-none focus:border-gray-500 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>



                    {/* Continue */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-lg border border-gray-700 hover:bg-purple-300 hover:text-black transition font-medium disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Signing in..." : "Continue →"}
                    </button>


                    {/* OR */}
                    <div className="flex items-center gap-4 my-7">

                        <div className="flex-1 h-px bg-gray-900"></div>

                        <span className="text-xs text-gray-600">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-900"></div>

                    </div>


                    {/* Register */}
                    <p className="text-center text-sm text-gray-600">

                        No account?

                        <button onClick={() => navigate("/register")} className="text-gray-300 ml-1 cursor-pointer hover:text-white">
                            Create one
                        </button>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default Login;