import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Documents() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

     const nameParts = user.name.split(" ");
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);

    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

     const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        console.log("User Logged out");

        navigate("/login");
    }

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await api.get("/api/documents/my-documents");

                console.log("Documents Response:", res.data);

                setDocuments(res.data.documents || []);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);


    return (
        <div className="min-h-screen bg-black text-white">

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

                    <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-purple-300 hover:text-black ">

                        <h1>Dashboard</h1>

                        {/* <p>Student: {user.name}</p>

<p>Scholarship: {user.scholarshipType}</p> */}
                    </button>

                    <button onClick={() => navigate("/upload")} className="hover:bg-purple-300 hover:text-black px-4 py-2 rounded-lg border border-gray-700 ">
                        Upload
                    </button>

                    <button onClick={() => navigate("/documents")} className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black">
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


            {/* Page */}
            <main className="px-5 py-7">

                <h1 className="text-xl font-semibold">
                    Documents
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    Your uploaded scholarship documents
                </p>

                {loading ? (
                    <p className="mt-6 text-zinc-400">
                        Loading documents...
                    </p>
                ) : (
                    <div className="mt-6">
                        <p className="text-zinc-400">
                            Total documents: {documents.length}
                        </p>

                        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">

                            {/* Table Header */}
                            
                            <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_2fr_0.8fr] border-b border-zinc-800 px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500">

                                <span>Document</span>
                                <span className="text-center">AI Status</span>
                                <span className="text-center">Confidence</span>
                                <span className="text-center">Remarks</span>
                                <span className="text-center">Admin</span>
                               

                            </div>

                            {/* Documents */}
                            {documents.map((document) => (

                                <div
                                    key={document._id}
                                    className="grid grid-cols-[1.2fr_0.7fr_0.7fr_2fr_0.8fr] items-center border-b border-zinc-900 px-4 py-3 last:border-b-0"
                                >

                                    {/* Document */}
                                    <div className="text-sm font-medium text-zinc-200">
                                        {document.documentType}
                                    </div>

                                    {/* AI Status */}
                                    <div className="text-center">
                                        <span
                                            className={`rounded border px-2 py-1 text-xs ${document.aiStatus === "valid"
                                                    ? "border-green-500/40 bg-green-500/5 text-green-400"
                                                    : document.aiStatus === "invalid"
                                                        ? "border-red-500/40 bg-red-500/5 text-red-400"
                                                        : "border-yellow-500/40 bg-yellow-500/5 text-yellow-400"
                                                }`}
                                        >
                                            {document.aiStatus === "valid"
                                                ? "Valid"
                                                : document.aiStatus === "invalid"
                                                    ? "Invalid"
                                                    : "Pending"}
                                        </span>
                                    </div>

                                    {/* Confidence */}
                                    <div
                                        className={`text-center text-sm font-medium ${document.aiConfidence >= 70
                                                ? "text-green-400"
                                                : document.aiConfidence >= 40
                                                    ? "text-yellow-400"
                                                    : "text-red-400"
                                            }`}
                                    >
                                        {document.aiConfidence}%
                                    </div>

                                    {/* Remarks */}
                                    <div
                                    
                                        className="text-center w-full truncate text-sm text-zinc-500"
                                        title={document.aiRemarks}
                                    >
                                        {document.aiRemarks || "No remarks"}
                                    </div>

                                    {/* Admin Status */}
                                    <div className="text-center">
                                        <span
                                            className={`rounded border px-2 py-1 text-xs ${document.status === "approved"
                                                    ? "border-green-500/40 bg-green-500/5 text-green-400"
                                                    : document.status === "rejected"
                                                        ? "border-red-500/40 bg-red-500/5 text-red-400"
                                                        : "border-yellow-500/40 bg-yellow-500/5 text-yellow-400"
                                                }`}
                                        >
                                            {document.status === "approved"
                                                ? "Approved"
                                                : document.status === "rejected"
                                                    ? "Rejected"
                                                    : "Pending"}
                                        </span>
                                    </div>

                                </div>

                            ))}
                        </div>
                    </div>
                )}

            </main>

        </div>
    );
}

export default Documents;