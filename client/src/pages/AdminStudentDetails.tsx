import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Sparkles,
    Shield,
    AlertCircle,
} from "lucide-react";
import api from "../api/axios";
import { toast } from "../components/Toast";
import { confirmDialog } from "../components/Confirm";

function AdminStudentDetails() {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingDocument, setUpdatingDocument] = useState<string | null>(null);
    const [validatingDocument, setValidatingDocument] = useState<string | null>(null);
    const [finalRemarks, setFinalRemarks] = useState("");
    const [finalizingApplication, setFinalizingApplication] = useState<"approved" | "rejected" | null>(null);

    const updateDocumentStatus = async (
        documentId: string,
        status: "approved" | "rejected"
    ) => {
        try {
            setUpdatingDocument(documentId);
            await api.patch(`/api/documents/${documentId}/status`, { status });

            setDocuments((prev) =>
                prev.map((doc) => (doc._id === documentId ? { ...doc, status } : doc))
            );
        } catch (err: any) {
            console.error("Failed to update status:", err);
            toast(err.response?.data?.message || "Failed to update status", "error");
        } finally {
            setUpdatingDocument(null);
        }
    };

    const validateDocumentAI = async (documentId: string) => {
        try {
            setValidatingDocument(documentId);
            const res = await api.patch(`/api/documents/${documentId}/validate-ai`);

            setDocuments((prev) =>
                prev.map((doc) => (doc._id === documentId ? res.data.document : doc))
            );
        } catch (err: any) {
            console.error("AI validation failed:", err);
            toast(err.response?.data?.message || "AI validation failed", "error");
        } finally {
            setValidatingDocument(null);
        }
    };

    const handleFinalDecision = async (status: "approved" | "rejected") => {
        if (status === "rejected" && !finalRemarks.trim()) {
            toast("Please provide a rejection reason in remarks.", "error");
            return;
        }

        const confirmed = await confirmDialog(
    `Are you sure you want to mark this application as ${status.toUpperCase()}?`,
    {
        title: "Confirm decision",
        confirmText: status === "approved" ? "Approve" : "Reject",
        cancelText: "Cancel",
    }
);
if (!confirmed) return;

        try {
            setFinalizingApplication(status);
            const res = await api.patch(
                `/api/documents/students/${studentId}/final-status`,
                { status, remarks: finalRemarks }
            );

            setStudent((prev: any) => ({
                ...prev,
                finalApplicationStatus: res.data.student.finalApplicationStatus,
                applicationRemarks: res.data.student.applicationRemarks,
            }));

            toast(res.data.message || `Application ${status} successfully`, "success");
        } catch (err: any) {
            console.error("Final decision error:", err);
            toast(err.response?.data?.message || "Failed to finalize status", "error");
        } finally {
            setFinalizingApplication(null);
        }
    };

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const [studentsRes, docsRes] = await Promise.all([
                    api.get("/api/auth/students"),
                    api.get("/api/documents/all"),
                ]);

                const found = (studentsRes.data.students || []).find(
                    (s: any) => s._id === studentId
                );
                if (!found) {
                    setError("Applicant profile not found");
                    return;
                }

                const studentDocs = (docsRes.data.documents || []).filter(
                    (d: any) => d.studentId && d.studentId._id === studentId
                );

                setStudent(found);
                setDocuments(studentDocs);
                setFinalRemarks(found.applicationRemarks || "");
            } catch (err: any) {
                console.error("Error loading student:", err);
                setError(err.response?.data?.message || "Failed to load applicant details");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex items-center justify-center font-['Hanken_Grotesk']">
                <div className="text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#ededee] border-t-transparent" />
                    <p className="mt-3 text-xs text-[#9b9ba3]">Loading student dossier...</p>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex items-center justify-center font-['Hanken_Grotesk']">
                <div className="text-center">
                    <p className="text-[#9b9ba3] text-sm">{error || "Student not found"}</p>
                    <button
                        onClick={() => navigate("/admin")}
                        className="mt-4 rounded-lg border border-white/[0.1] px-4 py-2 text-xs text-[#9b9ba3] hover:text-[#ededee] hover:border-white/[0.25] transition-colors cursor-pointer"
                    >
                        Back to Admin Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isApplicationApproved = student.finalApplicationStatus === "approved";
    const isApplicationRejected = student.finalApplicationStatus === "rejected";

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(700px_340px_at_85%_-5%,rgba(255,255,255,0.04),transparent_70%)]" />

            {/* TOP NAV */}
            <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0a0a0b]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/admin")}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#101012] px-3.5 py-1.5 text-xs font-medium text-[#9b9ba3] hover:text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer"
                    >
                        <ArrowLeft size={14} className="text-[#ededee]" />
                        <span>Back to Candidate Queue</span>
                    </button>

                    <div className="flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.03] px-3 py-1 text-xs text-[#ededee]">
                        <Shield size={12} />
                        <span>Dossier Audit Mode</span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {/* PROFILE HEADER */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-7 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.14] bg-[#0c0c0e] text-xl font-semibold text-[#ededee]">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#ededee]">
                                    {student.name}
                                </h1>
                                <p className="text-xs text-[#9b9ba3] mt-0.5">{student.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="rounded-lg border border-white/[0.1] bg-[#0c0c0e] px-3 py-1.5 text-xs font-medium text-[#9b9ba3] font-['JetBrains_Mono']">
                                {student.scholarshipType} Category
                            </span>

                            <span
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                                    isApplicationApproved
                                        ? "bg-[#fafafa] text-[#0a0a0b]"
                                        : isApplicationRejected
                                        ? "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                        : "border border-white/[0.18] text-[#9b9ba3]"
                                }`}
                            >
                                {!isApplicationRejected && (
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            isApplicationApproved ? "bg-[#0a0a0b]" : "bg-[#9b9ba3]"
                                        }`}
                                    />
                                )}
                                {student.finalApplicationStatus || "pending"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CERTIFICATES AUDIT */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-7 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-[#ededee] flex items-center gap-2">
                                <FileText size={18} className="text-[#ededee]" />
                                Submitted Certificates
                            </h2>
                            <p className="text-xs text-[#9b9ba3] mt-0.5">
                                {documents.length} files currently on record
                            </p>
                        </div>
                    </div>

                    {documents.length === 0 ? (
                        <div className="p-10 text-center border border-dashed border-white/[0.1] rounded-xl">
                            <p className="text-xs text-[#67676e]">Applicant has not uploaded any documents yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => {
                                const isApproved = doc.status === "approved";
                                const isRejected = doc.status === "rejected";
                                const isAiValid = doc.aiStatus?.toLowerCase() === "valid";

                                return (
                                    <div
                                        key={doc._id}
                                        className="rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-5 transition-colors hover:border-white/[0.16]"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2.5">
                                                    <h3 className="text-sm font-semibold text-[#ededee]">
                                                        {doc.documentType}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider capitalize ${
                                                            isApproved
                                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                                : isRejected
                                                                ? "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                                                : "border border-white/[0.18] text-[#9b9ba3]"
                                                        }`}
                                                    >
                                                        {doc.status}
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#9b9ba3]">
                                                    <span className="flex items-center gap-1.5">
                                                        <Sparkles size={13} className="text-[#ededee]" />
                                                        AI: <strong className={isAiValid ? "text-[#ededee]" : "text-[#9b9ba3]"}>{doc.aiStatus}</strong>
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-['JetBrains_Mono']">Confidence: <strong className="text-[#ededee]">{doc.aiConfidence}%</strong></span>
                                                </div>

                                                {doc.aiRemarks && (
                                                    <p className="mt-2 text-xs text-[#9b9ba3] bg-[#0a0a0b] rounded-lg p-2.5 border border-white/[0.06]">
                                                        {doc.aiRemarks}
                                                    </p>
                                                )}

                                                {doc.actionRequired && (
                                                    <p className="mt-2 text-xs text-[#9b9ba3] flex items-center gap-1.5">
                                                        <AlertCircle size={13} />
                                                        <span>Requires: <strong className="capitalize text-[#ededee]">{doc.actionRequired.replace(/_/g, " ")}</strong></span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => window.open(doc.fileUrl, "_blank", "noopener,noreferrer")}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#101012] px-3 py-2 text-xs font-medium text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer"
                                                >
                                                    <ExternalLink size={13} className="text-[#67676e]" />
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => validateDocumentAI(doc._id)}
                                                    disabled={validatingDocument === doc._id}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.18] bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#ededee] hover:bg-white/[0.07] transition-all disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Sparkles size={13} />
                                                    {validatingDocument === doc._id ? "Scanning..." : "Re-run AI"}
                                                </button>

                                                <button
                                                    onClick={() => updateDocumentStatus(doc._id, "approved")}
                                                    disabled={updatingDocument === doc._id || isApproved}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-[#fafafa] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
                                                >
                                                    <CheckCircle2 size={13} />
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => updateDocumentStatus(doc._id, "rejected")}
                                                    disabled={updatingDocument === doc._id || isRejected}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-white/[0.18] px-3 py-2 text-xs font-medium text-[#ededee] hover:bg-white/[0.06] transition-all disabled:opacity-40 cursor-pointer"
                                                >
                                                    <XCircle size={13} />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FINAL DECISION */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-7">
                    <h2 className="text-base font-semibold text-[#ededee] mb-1">
                        Final Grant Decision
                    </h2>
                    <p className="text-xs text-[#9b9ba3] mb-5">
                        Ensure all required certificates are verified prior to formal grant approval.
                    </p>

                    <div>
                        <label className="block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3] mb-2">
                            Audit Remarks / Decision Notes
                        </label>
                        <textarea
                            value={finalRemarks}
                            onChange={(e) => setFinalRemarks(e.target.value)}
                            placeholder="State reason for grant approval or specific criteria for rejection..."
                            rows={3}
                            className="w-full rounded-lg border border-white/[0.1] bg-[#0c0c0e] p-3 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors focus:border-white/60 resize-none"
                        />
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => handleFinalDecision("approved")}
                            disabled={finalizingApplication === "approved" || isApplicationApproved}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-5 py-3 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <CheckCircle2 size={15} />
                            {finalizingApplication === "approved" ? "Processing Approval..." : "Approve Full Application"}
                        </button>

                        <button
                            onClick={() => handleFinalDecision("rejected")}
                            disabled={finalizingApplication === "rejected" || isApplicationRejected}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.18] px-5 py-3 text-xs font-medium text-[#ededee] hover:bg-white/[0.06] transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <XCircle size={15} />
                            {finalizingApplication === "rejected" ? "Processing Rejection..." : "Reject Entire Application"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminStudentDetails;