import { useState } from "react"
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login(){
    // useSate() --> React ka ek Hook hai jo component ke andar data ko remember/state mein rakhne deta hai.
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e: any) => {
        e.preventDefault(); //Email likho Password likho Login click karo Console check karo Page reload nahi hona chahiye
        
        setError("");// supose wrong password fir invalid credential phir user password correct karta hai. To purana error screen se hatna chahiye.

        try{
        const res = await api.post("/api/auth/login", {
            email,
            password,
        });

        const {token, user} = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Token:", token);
        console.log("User:", user);
        console.log("Role:", user.role);

        if(user.role === "admin"){
            navigate("/admin");
        } else if(user.role === "student"){
            navigate("/student");
        }


        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("user", JSON.stringify(res.data.user));

    } catch (error: any){
        setError(
            error.response?.data?.message || "Login failed"
        );

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
        <div className="min-h-screen bg-gradient-to-b from-[#0c0c0c] via-[#050505] to-[#020202] text-white flex">

            {/* ================= LEFT SIDE ================= */}

            <div className="w-1/2 min-h-screen border-r border-gray-800 px-12 py-8">

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
                <div className="mt-10 max-w-xl">

                    <p className="text-xs tracking-[0.2em] text-gray-500 mb-5">
                        AI-POWERED DOCUMENT PLATFORM
                    </p>

                    <h1 className="text-5xl font-semibold leading-[1.05]">

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

            <div className="w-1/2 min-h-screen flex items-start justify-center px-12 pt-9">

                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md">

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-6">

                        <span className="w-2 h-2 rounded-full bg-green-400"></span>

                        <span className="text-sm text-gray-600">
                            AI validation online
                        </span>

                    </div>


                    {/* Heading */}
                    <h2 className="text-2xl font-semibold mb-1">
                        Sign in
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        Continue to ScholarEase
                    </p>


                    {/* Role Selection */}
                    <div className="flex border border-gray-800 rounded-lg p-1 mb-6">

                        <button
                            type="button"
                            className="w-1/2 py-2 rounded-md border border-gray-700 text-sm font-medium">
                            Student
                        </button>

                        <button
                            type="button"
                            className="w-1/2 py-2 rounded-md text-sm font-medium text-gray-400">
                            Admin
                        </button>

                    </div>


                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm mb-4">
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

                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-800 text-white placeholder-gray-700 outline-none focus:border-gray-500 transition"
                        />

                    </div>


                    {/* Continue */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg border border-gray-700 hover:bg-white hover:text-black transition font-medium"
                    >
                        Continue →
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