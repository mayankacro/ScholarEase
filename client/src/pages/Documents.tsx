import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
    RefreshCw,
    Search,
    FileText,
    ExternalLink,
    RotateCcw,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowUpRight,
    LogOut,
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";
import StudentNav from "../components/StudenNav"

function Documents() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const nameParts = (user.name || "Student").split(" ");
    const initials =
        nameParts
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part.charAt(0))
            .join("")
            .toUpperCase() || "S";

    const [documents, setDocuments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [aiFilter, setAiFilter] = useState("all");
    const [adminFilter, setAdminFilter] = useState("all");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const fetchDocuments = async () => {
        try {
            setIsRefreshing(true);
            const res = await api.get("/api/documents/my-documents");
            setDocuments(res.data.documents || []);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const filteredDocuments = documents.filter((document) => {
        const matchesSearch = String(document.documentType || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const aiStatus = String(document.aiStatus || "pending").toLowerCase();
        const adminStatus = String(document.status || "pending").toLowerCase();

        const matchesAI = aiFilter === "all" || aiStatus === aiFilter;
        const matchesAdmin = adminFilter === "all" || adminStatus === adminFilter;

        return matchesSearch && matchesAI && matchesAdmin;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            {/* quiet ambient glow */}
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(700px_340px_at_85%_-5%,rgba(255,255,255,0.04),transparent_70%)]" />

            {/* TOP NAV */}
            <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0a0a0b]/80 backdrop-blur-xl">
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md border border-white/[0.14] grid place-items-center font-['JetBrains_Mono'] text-[11px] font-medium">
                            SE
                        </div>
                        <div> 
                            <span className="text-sm font-semibold tracking-tight">ScholarEase</span>
                            
                            <p className="text-[10px] text-[#67676e] uppercase tracking-[0.16em] font-['JetBrains_Mono'] leading-none mt-0.5">
                                Document Repository
                            </p>
                        </div>
                    </div>

<StudentNav />

                    <div className="flex items-center gap-3">
                        <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101012] px-3 py-1 text-xs text-[#9b9ba3]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#fafafa]" />
                            <span className="font-semibold text-[#ededee]">{user.scholarshipType || "General"}</span>
                            <span className="text-[#67676e]">Scholarship</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#101012] text-xs font-semibold text-[#ededee] hover:border-white/[0.25] transition-colors cursor-pointer"
                                aria-label="Open profile menu"
                            >
                                {initials}
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/[0.1] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur-2xl z-50">
                                    <div className="border-b border-white/[0.07] pb-3 mb-2">
                                        <p className="text-xs font-semibold text-[#ededee] truncate">{user.name}</p>
                                        <p className="text-[11px] text-[#9b9ba3] truncate mt-0.5">{user.email}</p>
                                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/[0.14] px-2 py-0.5 text-[10px] text-[#ededee] font-['JetBrains_Mono']">
                                            Role: Student
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowProfile(false);
                                            navigate("/upload");
                                        }}
                                        className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-[#9b9ba3] hover:bg-white/[0.04] hover:text-[#ededee] transition-colors cursor-pointer"
                                    >
                                        <span>Upload New Document</span>
                                        <ArrowUpRight size={13} className="text-[#67676e]" />
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#9b9ba3] hover:bg-white/[0.04] hover:text-[#ededee] transition-colors mt-1 cursor-pointer"
                                    >
                                        <LogOut size={13} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#ededee]">
                            My Document Repository
                        </h1>
                        <p className="text-xs text-[#9b9ba3] mt-1.5">
                            Audited records and secure cloud storage for your scholarship dossier.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchDocuments}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#101012] px-4 py-2 text-xs font-medium text-[#9b9ba3] hover:bg-white/[0.04] hover:text-[#ededee] transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw
                                size={14}
                                className={isRefreshing ? "animate-spin text-[#ededee]" : "text-[#9b9ba3]"}
                            />
                            <span>{isRefreshing ? "Syncing..." : "Sync Repository"}</span>
                        </button>

                        <button
                            onClick={() => navigate("/upload")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#fafafa] px-4 py-2 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            + Upload
                        </button>
                    </div>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        {/* Search Input */}
                        <div className="md:col-span-6 relative">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                            />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by certificate name (e.g. Aadhaar, Income)..."
                                className="w-full rounded-lg border border-white/[0.1] bg-[#0c0c0e] py-2.5 pl-10 pr-4 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors focus:border-white/60"
                            />
                        </div>

                        {/* AI Filter */}
                        <div className="md:col-span-3">
                            <CustomDropdown
                                value={aiFilter}
                                onChange={setAiFilter}
                                placeholder="All AI statuses"
                                buttonClassName="!py-2.5 !text-[13px] !rounded-lg"
                                buttonColorClassName="border-white/[0.1] bg-[#0c0c0e] text-[#ededee]"
                                options={[
                                    { label: "AI: All Statuses", value: "all" },
                                    { label: "AI: Valid Only", value: "valid" },
                                    { label: "AI: Manual Review", value: "manual_review" },
                                    { label: "AI: Invalid Only", value: "invalid" },
                                    { label: "AI: Pending", value: "pending" },
                                ]}
                            />
                        </div>

                        {/* Admin Filter */}
                        <div className="md:col-span-3">
                            <CustomDropdown
                                value={adminFilter}
                                onChange={setAdminFilter}
                                placeholder="All admin statuses"
                                buttonClassName="!py-2.5 !text-[13px] !rounded-lg"
                                buttonColorClassName="border-white/[0.1] bg-[#0c0c0e] text-[#ededee]"
                                options={[
                                    { label: "Admin: All Decisions", value: "all" },
                                    { label: "Admin: Approved", value: "approved" },
                                    { label: "Admin: In Review", value: "pending" },
                                    { label: "Admin: Rejected", value: "rejected" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06] font-['JetBrains_Mono'] text-[11px] text-[#67676e] px-1">
                        <span>
                            Displaying <strong className="text-[#ededee]">{filteredDocuments.length}</strong> of {documents.length} records
                        </span>
                        <span>Multi-category indexed</span>
                    </div>
                </div>

                {/* DOCUMENTS TABLE */}
                {loading ? (
                    <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-12 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#ededee] border-t-transparent" />
                        <p className="mt-3 text-xs text-[#9b9ba3]">Loading document vault...</p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0c0c0e] p-12 text-center">
                        <FileText size={32} className="mx-auto text-[#67676e] mb-3" />
                        <h3 className="text-sm font-semibold text-[#ededee]">No documents matched your filters</h3>
                        <p className="text-xs text-[#67676e] mt-1">
                            {documents.length === 0
                                ? "You haven't uploaded any scholarship certificates yet."
                                : "Try clearing search or filters to inspect your archive."}
                        </p>
                        <button
                            onClick={() => navigate("/upload")}
                            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#fafafa] px-4 py-2 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity"
                        >
                            Upload your first document
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/[0.07] bg-[#101012] overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden lg:grid grid-cols-12 border-b border-white/[0.06] bg-[#0c0c0e] px-6 py-3.5 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider text-[#67676e]">
                            <span className="col-span-4">Certificate</span>
                            <span className="col-span-2 text-center">AI Scan</span>
                            <span className="col-span-2 text-center">AI Confidence</span>
                            <span className="col-span-2 text-center">Admin Status</span>
                            <span className="col-span-2 text-right">Actions</span>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-white/[0.05]">
                          {filteredDocuments.map((doc) => {
    const isDocApproved = doc.status?.toLowerCase() === "approved";
    const isDocRejected = doc.status?.toLowerCase() === "rejected";
    const isDocValid = doc.aiStatus?.toLowerCase() === "valid";
    const isDocManual = doc.aiStatus?.toLowerCase() === "manual_review";

    return (
        <div
            key={doc._id}
            className="p-4 sm:p-5 lg:px-6 lg:py-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center transition-colors hover:bg-white/[0.02]"
        >
            {/* Certificate */}
            <div className="lg:col-span-4 flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-[#0c0c0e] text-[#ededee]">
                    <FileText size={18} />
                </div>
                <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#ededee] truncate">{doc.documentType}</p>
                    <p className="text-[11px] text-[#67676e] truncate mt-0.5 font-['JetBrains_Mono']">
                        {doc.scholarshipType} • {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* wrapper: mobile pe ek flex row jo wrap karti hai; lg pe gayab (contents) taaki grid align rahe */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 lg:contents">
                {/* AI Status */}
                <div className="lg:col-span-2 flex lg:justify-center">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-['JetBrains_Mono'] ${
                            isDocValid
                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                : isDocManual
                                ? "border border-white/[0.18] text-[#9b9ba3]"
                                : "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                        }`}
                    >
                        {doc.aiStatus || "Pending"}
                    </span>
                </div>

                {/* Confidence */}
                <div className="lg:col-span-2 flex items-center gap-2 lg:justify-center">
                    <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#ededee]"
                            style={{ width: `${doc.aiConfidence || 0}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-[#ededee] font-['JetBrains_Mono']">
                        {doc.aiConfidence ?? 0}%
                    </span>
                </div>

                {/* Admin Status */}
                <div className="lg:col-span-2 flex lg:justify-center">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                            isDocApproved
                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                : isDocRejected
                                ? "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                : "border border-white/[0.18] text-[#9b9ba3]"
                        }`}
                    >
                        {isDocApproved ? (
                            <CheckCircle2 size={12} />
                        ) : isDocRejected ? (
                            <XCircle size={12} />
                        ) : (
                            <Clock size={12} />
                        )}
                        {doc.status || "Pending"}
                    </span>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex items-center gap-2 ml-auto lg:ml-0 lg:justify-end">
                    {isDocRejected && (
                        <button
                            onClick={() =>
                                navigate(
                                    `/upload?documentType=${encodeURIComponent(doc.documentType)}`
                                )
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.18] px-2.5 py-1.5 text-[11px] font-medium text-[#ededee] hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                            <RotateCcw size={12} />
                            Replace
                        </button>
                    )}

                    <button
                        onClick={() => window.open(doc.fileUrl, "_blank", "noopener,noreferrer")}
                        disabled={!doc.fileUrl}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-[#0c0c0e] px-2.5 py-1.5 text-[11px] font-medium text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer disabled:opacity-50"
                    >
                        <span>View</span>
                        <ExternalLink size={12} className="text-[#67676e]" />
                    </button>
                </div>
            </div>
        </div>
    );
})}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Documents;