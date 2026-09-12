import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Upload() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const nameParts = user.name?.split(" ") || [];
    const initials =
        (nameParts[0]?.charAt(0) || "") +
        (nameParts[1]?.charAt(0) || "");

    const [documents, setDocuments] = useState<string[]>([]);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    useEffect(() => {

        const fetchChecklist = async () => {

            try {

                const res = await api.get(
                    `/api/checklist/${user.scholarshipType}`
                );

                console.log("Checklist:", res.data.rule);

                setDocuments(
                    res.data.rule.requiredDocuments
                );

            } catch (error) {

                console.error(
                    "Failed to fetch checklist:",
                    error
                );

            }

        };

        fetchChecklist();

    }, []);


    return (

        <div className="min-h-screen bg-[#050505] text-white">

            {/* Navbar */}
            <nav className="h-16 border-b border-gray-900 flex items-center justify-between px-6">

                {/* Logo */}
                <div className="flex items-center gap-2">

                    <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
                        Λ
                    </div>

                    <span className="font-semibold">
                        ScholarEase
                    </span>

                </div>


                {/* Navigation */}
                <div className="flex items-center gap-2">

                    <button
                        onClick={() => navigate("/student")}
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/upload")}
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black "
                    >
                        Upload
                    </button>

                    <button
                        onClick={() => navigate("/documents")}
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black"
                    >
                        Documents
                    </button>

                </div>


                {/* Right side */}
                <div className="flex items-center gap-3">

                    <span className="text-xs text-gray-500 border border-gray-900 px-3 py-1 rounded-full">
                        {user.scholarshipType} Scholarship
                    </span>


                    {/* Profile */}
                    <div className="relative">

                        <button
                            onClick={() =>
                                setShowProfile(!showProfile)
                            }
                            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs"
                        >
                            {initials}
                        </button>


                        {showProfile && (

                            <div className="absolute right-0 top-10 w-56 bg-[#111111] border border-[#27272a] rounded-xl p-4 z-50">

                                <p className="font-medium">
                                    {user.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {user.email}
                                </p>

                                <p className="text-xs text-gray-500 mt-2">
                                    {user.scholarshipType} Scholarship
                                </p>

                                <button
                                    onClick={handleLogout}
                                    className="mt-4 w-full text-left text-sm text-red-400 hover:text-red-300"
                                >
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </nav>


            {/* Main */}
            <main className="max-w-3xl mx-auto px-6 py-12">

                <div className="mb-8">

                    <h1 className="text-2xl font-semibold">
                        Upload document
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Validated instantly by Gemini Vision
                    </p>

                </div>


                {/* Document Type */}
                <div className="mb-6">

                    <label className="block text-sm text-gray-400 mb-2">
                        Document type
                    </label>


                    <div className="relative">

                        <select
                            value={selectedDocument}
                            onChange={(e) =>
                                setSelectedDocument(e.target.value)
                            }
                            // className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-3 text-white outline-none"
                            // className="appearance-none w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-3 pr-10 text-white outline-none focus:border-gray-500 cursor-pointer"
                            className="appearance-none w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-3 pr-10 text-white outline-none focus:border-gray-500 cursor-pointer"
                        >


                            <option value="">
                                Select document type
                            </option>

                            {documents.map((document) => (

                                <option
                                    key={document}
                                    value={document}
                                >
                                    {document}
                                </option>

                            ))}

                        </select>
                        {/* Custom arrow, jitna chaho utna left kar sakte ho */}
                        <svg
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
                </div>


                {/* Upload Area */}
                <div className="border border-dashed border-[#3f3f46] rounded-xl bg-[#111111] p-12 text-center">

                    <div className="text-4xl mb-4">
                        ↑
                    </div>

                    <h2 className="text-base font-medium">
                        Drag & drop your file here
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        or click to browse
                    </p>

                    <p className="text-xs text-gray-600 mt-4">
                        JPG, PNG, PDF
                    </p>

                </div>

            </main>

        </div>

    );
}

export default Upload;