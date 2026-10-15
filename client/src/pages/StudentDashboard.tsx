import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import StudentNav from "../components/StudenNav";

import {
    Upload,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Sparkles,
    ChevronRight,
    LogOut,
    Shield,
    ArrowUpRight,
    FileCheck,
    Layers,
} from "lucide-react";

function StudentDashboard() {
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
    const [showProfile, setShowProfile] = useState(false);
    const [checklist, setChecklist] = useState<any>(null);
    const [applicationStatus, setApplicationStatus] = useState("pending");
    const [applicationRemarks, setApplicationRemarks] = useState("");
    const [, setIsLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const docsRes = await api.get("/api/documents/my-documents");
                setDocuments(docsRes.data.documents || []);

                if (user.scholarshipType) {
                    try {
                        const checkRes = await api.get(`/api/checklist/${user.scholarshipType}`);
                        setChecklist(checkRes.data.rule);
                    } catch (e) {
                        console.warn("Checklist not configured yet for category:", user.scholarshipType);
                    }
                }

                try {
                    const profRes = await api.get("/api/auth/profile");
                    if (profRes.data?.user) {
                        setApplicationStatus(profRes.data.user.finalApplicationStatus || "pending");
                        setApplicationRemarks(profRes.data.user.applicationRemarks || "");
                    }
                } catch (e) {
                    console.error("Profile status error:", e);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user.scholarshipType]);

    const verifiedDocuments = documents.filter((doc) => doc.status === "approved");
    const pendingDocuments = documents.filter((doc) => doc.status === "pending");
    const rejectedDocuments = documents.filter((doc) => doc.status === "rejected");

    const checklistDocuments = checklist?.requiredDocuments || [
        "Aadhaar Card",
        "Marksheet",
        "Income Certificate",
        "Caste Certificate",
        "Bank Passbook",
    ];

    const documentStatus = checklistDocuments.map((requiredDoc: string) => {
        const uploadedDocument = documents.find(
            (doc) => doc.documentType?.toLowerCase() === requiredDoc.toLowerCase()
        );

        return {
            name: requiredDoc,
            uploaded: !!uploadedDocument,
            status: uploadedDocument?.status ?? "not_uploaded",
            aiStatus: uploadedDocument?.aiStatus ?? "Pending",
            aiConfidence: uploadedDocument?.aiConfidence ?? null,
            fileUrl: uploadedDocument?.fileUrl ?? null,
            aiRemarks: uploadedDocument?.aiRemarks ?? "",
        };
    });

    const uploadedRequiredCount = documentStatus.filter((doc: any) => doc.uploaded).length;
    const progressPercent = Math.round(
        (uploadedRequiredCount / Math.max(checklistDocuments.length, 1)) * 100
    );

    const allRequiredUploaded =
        documentStatus.length > 0 && documentStatus.every((doc: any) => doc.uploaded);
    const allAIValidated =
        documents.length > 0 && documents.every((doc) => doc.aiStatus !== "Pending");
    const allDocumentsReviewed =
        documents.length > 0 &&
        documents.every((doc) => doc.status === "approved" || doc.status === "rejected");

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(700px_340px_at_15%_-5%,rgba(255,255,255,0.04),transparent_70%)]" />

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
                                Student Portal
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

                        <button
                            onClick={() => navigate("/upload")}
                            className="hidden xl:flex items-center gap-1.5 rounded-lg bg-[#fafafa] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            <Upload size={14} />
                            Upload
                        </button>

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
                                            navigate("/documents");
                                        }}
                                        className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-[#9b9ba3] hover:bg-white/[0.04] hover:text-[#ededee] transition-colors cursor-pointer"
                                    >
                                        <span>View Document Archive</span>
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

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-8 relative overflow-hidden mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.14em] text-[#67676e]">
                                    Scholarship Application Status
                                </span>
                                <span className="h-1 w-1 rounded-full bg-[#67676e]" />
                                <span className="text-[11px] text-[#9b9ba3] font-medium">
                                    {user.scholarshipType} Category
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight capitalize">
                                    {applicationStatus === "approved"
                                        ? "Application Approved"
                                        : applicationStatus === "rejected"
                                        ? "Application Rejected"
                                        : "Under Verification"}
                                </h1>

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                                        applicationStatus === "approved"
                                            ? "bg-[#fafafa] text-[#0a0a0b]"
                                            : applicationStatus === "rejected"
                                            ? "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                            : "border border-white/[0.18] text-[#9b9ba3]"
                                    }`}
                                >
                                    {applicationStatus !== "rejected" && (
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                applicationStatus === "approved"
                                                    ? "bg-[#0a0a0b]"
                                                    : "bg-[#9b9ba3] animate-pulse"
                                            }`}
                                        />
                                    )}
                                    {applicationStatus.toUpperCase()}
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-[#9b9ba3] max-w-xl leading-relaxed">
                                {applicationStatus === "approved"
                                    ? "Congratulations! All documents verified and application approved for disbursement."
                                    : applicationStatus === "rejected"
                                    ? applicationRemarks || "Your application was rejected by the admin. Please re-check rejected documents."
                                    : "Your documents are currently progressing through AI verification and administrative queue."}
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 lg:w-72">
                            <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-[#9b9ba3] font-medium">Checklist Progress</span>
                                <span className="font-semibold text-[#ededee] font-['JetBrains_Mono']">{progressPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#fafafa] transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-[#67676e] mt-2">
                                {uploadedRequiredCount} of {checklistDocuments.length} mandatory documents submitted
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 transition-colors hover:border-white/[0.16]">
                            <div className="flex items-center justify-between text-[#9b9ba3] text-xs mb-2">
                                <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Total Uploads</span>
                                <Layers size={14} className="text-[#67676e]" />
                            </div>
                            <p className="text-2xl font-semibold text-[#ededee] tracking-tight">{documents.length}</p>
                            <p className="text-[11px] text-[#67676e] mt-1">Stored in Cloudinary</p>
                        </div>

                        <div className="rounded-xl border border-white/[0.18] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.3]">
                            <div className="flex items-center justify-between text-[#ededee] text-xs mb-2">
                                <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Admin Approved</span>
                                <CheckCircle2 size={14} className="text-[#ededee]" />
                            </div>
                            <p className="text-2xl font-semibold text-[#ededee] tracking-tight">{verifiedDocuments.length}</p>
                            <p className="text-[11px] text-[#9b9ba3] mt-1">Verified &amp; confirmed</p>
                        </div>

                        <div className="rounded-xl border border-dashed border-white/[0.12] bg-[#0c0c0e] p-4 transition-colors hover:border-white/[0.22]">
                            <div className="flex items-center justify-between text-[#9b9ba3] text-xs mb-2">
                                <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">In Review</span>
                                <Clock size={14} className="text-[#9b9ba3]" />
                            </div>
                            <p className="text-2xl font-semibold text-[#ededee] tracking-tight">{pendingDocuments.length}</p>
                            <p className="text-[11px] text-[#67676e] mt-1">Pending admin action</p>
                        </div>

                        <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 transition-colors hover:border-white/[0.16]">
                            <div className="flex items-center justify-between text-[#67676e] text-xs mb-2">
                                <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Rejected</span>
                                <XCircle size={14} className="text-[#67676e]" />
                            </div>
                            <p className="text-2xl font-semibold text-[#9b9ba3] tracking-tight">{rejectedDocuments.length}</p>
                            <p className="text-[11px] text-[#67676e] mt-1">Requires re-submission</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-7">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-semibold text-[#ededee] flex items-center gap-2">
                                    <FileCheck size={18} className="text-[#ededee]" />
                                    Required Checklist
                                </h2>
                                <p className="text-xs text-[#9b9ba3] mt-0.5">
                                    Mandatory submissions for {user.scholarshipType} category
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/upload")}
                                className="flex items-center gap-1 text-xs text-[#ededee] hover:underline underline-offset-4 font-medium cursor-pointer"
                            >
                                Upload missing
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {documentStatus.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between rounded-xl border p-3.5 transition-colors duration-200 ${
                                        item.uploaded
                                            ? "border-white/[0.07] bg-[#0c0c0e] hover:border-white/[0.16]"
                                            : "border-dashed border-white/[0.1] bg-transparent"
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                                                item.uploaded
                                                    ? item.status === "approved"
                                                        ? "bg-[#fafafa] text-[#0a0a0b] border-transparent"
                                                        : item.status === "rejected"
                                                        ? "border-white/[0.1] text-[#67676e]"
                                                        : "border-white/[0.18] text-[#ededee]"
                                                    : "border-white/[0.08] text-[#67676e]"
                                            }`}
                                        >
                                            {item.uploaded ? (
                                                item.status === "approved" ? (
                                                    <CheckCircle2 size={17} />
                                                ) : item.status === "rejected" ? (
                                                    <XCircle size={17} />
                                                ) : (
                                                    <Clock size={17} />
                                                )
                                            ) : (
                                                <FileText size={17} />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-[#ededee] truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-[#67676e] flex items-center gap-1.5 mt-0.5">
                                                {item.uploaded ? (
                                                    <>
                                                        <span className="capitalize">{item.status}</span>
                                                        {item.aiConfidence !== null && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-[#9b9ba3] font-['JetBrains_Mono']">
                                                                    AI {item.aiConfidence}%
                                                                </span>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-[#67676e]">Not uploaded yet</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {item.uploaded ? (
                                            item.status === "rejected" ? (
                                                <button
                                                    onClick={() => navigate("/upload")}
                                                    className="rounded-lg border border-white/[0.18] px-3 py-1.5 text-[11px] font-medium text-[#ededee] hover:bg-white/[0.06] transition-colors cursor-pointer"
                                                >
                                                    Replace
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.14] px-2.5 py-1 text-[10px] font-semibold text-[#9b9ba3]">
                                                    Ready
                                                </span>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => navigate("/upload")}
                                                className="rounded-lg bg-white/[0.06] border border-white/[0.1] px-3 py-1.5 text-[11px] font-medium text-[#ededee] hover:bg-white/[0.1] transition-colors cursor-pointer"
                                            >
                                                Upload
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-7 flex flex-col justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-[#ededee] flex items-center gap-2 mb-1">
                                <Sparkles size={18} className="text-[#ededee]" />
                                Verification Pipeline
                            </h2>
                            <p className="text-xs text-[#9b9ba3] mb-6">
                                End-to-end status of your scholarship application
                            </p>

                            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-px before:bg-white/[0.08]">
                                <div className="flex items-start gap-3.5 relative z-10">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            allRequiredUploaded
                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                : "bg-[#101012] text-[#9b9ba3] border border-white/[0.14]"
                                        }`}
                                    >
                                        {allRequiredUploaded ? "✓" : "1"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-[#ededee]">All Documents Uploaded</p>
                                        <p className="text-[11px] text-[#9b9ba3] mt-0.5">
                                            {uploadedRequiredCount} of {checklistDocuments.length} mandatory files submitted.
                                        </p>
                                        <span
                                            className={`inline-block mt-1 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider ${
                                                allRequiredUploaded ? "text-[#ededee]" : "text-[#67676e]"
                                            }`}
                                        >
                                            {allRequiredUploaded ? "Completed" : "In Progress"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 relative z-10">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            allAIValidated
                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                : "bg-[#101012] text-[#9b9ba3] border border-white/[0.14]"
                                        }`}
                                    >
                                        {allAIValidated ? "✓" : "2"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-[#ededee]">AI Authenticity Scan</p>
                                        <p className="text-[11px] text-[#9b9ba3] mt-0.5">
                                            Gemini &amp; OCR multimodal fraud and blur detection.
                                        </p>
                                        <span
                                            className={`inline-block mt-1 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider ${
                                                allAIValidated ? "text-[#ededee]" : "text-[#67676e]"
                                            }`}
                                        >
                                            {allAIValidated ? "Completed" : "In Progress"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 relative z-10">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            allDocumentsReviewed
                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                : "bg-[#101012] text-[#9b9ba3] border border-white/[0.14]"
                                        }`}
                                    >
                                        {allDocumentsReviewed ? "✓" : "3"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-[#ededee]">Administrative Verification</p>
                                        <p className="text-[11px] text-[#9b9ba3] mt-0.5">
                                            Institutional audit of all academic &amp; income credentials.
                                        </p>
                                        <span
                                            className={`inline-block mt-1 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider ${
                                                allDocumentsReviewed ? "text-[#ededee]" : "text-[#67676e]"
                                            }`}
                                        >
                                            {allDocumentsReviewed ? "Completed" : "Queued"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 relative z-10">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            applicationStatus === "approved"
                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                : applicationStatus === "rejected"
                                                ? "bg-[#101012] text-[#67676e] border border-white/[0.14]"
                                                : "bg-[#101012] text-[#9b9ba3] border border-white/[0.14]"
                                        }`}
                                    >
                                        {applicationStatus === "approved"
                                            ? "✓"
                                            : applicationStatus === "rejected"
                                            ? "✕"
                                            : "4"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-[#ededee]">Final Grant Decision</p>
                                        <p className="text-[11px] text-[#9b9ba3] mt-0.5">
                                            State officer dispatch &amp; scholarship allocation.
                                        </p>
                                        <span
                                            className={`inline-block mt-1 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider ${
                                                applicationStatus === "approved"
                                                    ? "text-[#ededee]"
                                                    : applicationStatus === "rejected"
                                                    ? "text-[#67676e] line-through decoration-1"
                                                    : "text-[#67676e]"
                                            }`}
                                        >
                                            {applicationStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 flex items-center gap-3">
                            <Shield size={18} className="text-[#ededee] shrink-0" />
                            <p className="text-[11px] text-[#9b9ba3] leading-relaxed">
                                Need help? Inquiries regarding re-upload requirements are handled directly by your institutional admin.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;