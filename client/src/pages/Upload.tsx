import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import {
    ChevronDown,
    Check,
    Upload as UploadIcon,
    FileCheck2,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    ArrowUpRight,
    LogOut,
    ShieldAlert,
    RotateCcw,
} from "lucide-react";
import StudentNav from "../components/StudenNav"

function Upload() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const documentTypeFromUrl = searchParams.get("documentType");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const nameParts = (user.name || "Student").split(" ");
    const initials =
        nameParts
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part.charAt(0))
            .join("")
            .toUpperCase() || "S";

    const [documents, setDocuments] = useState<string[]>([]);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [existingDocuments, setExistingDocuments] = useState<any[]>([]);

    const [isDocumentDropdownOpen, setIsDocumentDropdownOpen] = useState(false);
    const documentDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                documentDropdownRef.current &&
                !documentDropdownRef.current.contains(event.target as Node)
            ) {
                setIsDocumentDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                if (user.scholarshipType) {
                    const res = await api.get(`/api/checklist/${user.scholarshipType}`);
                    setDocuments(res.data.rule?.requiredDocuments || []);
                }
            } catch (error) {
                console.error("Failed to fetch checklist:", error);
            }
        };

        const fetchExistingDocuments = async () => {
            try {
                const res = await api.get("/api/documents/my-documents");
                setExistingDocuments(res.data.documents || []);
            } catch (error) {
                console.error("Failed to fetch existing documents:", error);
            }
        };

        fetchChecklist();
        fetchExistingDocuments();
    }, [user.scholarshipType]);

    useEffect(() => {
        if (!documentTypeFromUrl || documents.length === 0) return;
        if (documents.some((d) => d.toLowerCase() === documentTypeFromUrl.toLowerCase())) {
            setSelectedDocument(documentTypeFromUrl);
        }
    }, [documentTypeFromUrl, documents]);

    const selectedExistingDocument = existingDocuments.find(
        (doc) =>
            doc.documentType?.toLowerCase() === selectedDocument?.toLowerCase() &&
            doc.scholarshipType === user.scholarshipType
    );

    const isRejectedDocument =
        selectedExistingDocument?.status?.toLowerCase() === "rejected";
    const isApprovedDocument =
        selectedExistingDocument?.status?.toLowerCase() === "approved";
    const isExistingDocument = Boolean(selectedExistingDocument);

    const validateFile = (file: File) => {
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
            setFileError("Only JPG, PNG and PDF files are allowed.");
            return false;
        }

        if (file.size > maxSize) {
            setFileError("File size must be strictly under 5 MB.");
            return false;
        }

        setFileError("");
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (validateFile(file)) setSelectedFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (isExistingDocument && !isRejectedDocument) return;

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (validateFile(file)) setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedDocument) {
            setUploadError("Please select a document type from the dropdown.");
            return;
        }

        if (!selectedFile) {
            setUploadError("Please select or drop a valid file.");
            return;
        }

        try {
            setIsUploading(true);
            setUploadError("");

            const formData = new FormData();
            formData.append("document", selectedFile);
            formData.append("documentType", selectedDocument);
            formData.append("scholarshipType", user.scholarshipType);

            const res = await api.post("/api/upload", formData);
            setUploadedDocument(res.data.document);

            // Refresh existing documents
            const refreshRes = await api.get("/api/documents/my-documents");
            setExistingDocuments(refreshRes.data.documents || []);
        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadError(
                error.response?.data?.message || "Document upload failed. Please try again."
            );
        } finally {
            setIsUploading(false);
        }
    };

    const aiStatus = String(uploadedDocument?.aiStatus ?? "").trim().toLowerCase();
    const isValid = aiStatus === "valid";
    const isManualReview = aiStatus === "manual_review";

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            {/* quiet ambient glow */}
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(700px_340px_at_50%_-5%,rgba(255,255,255,0.04),transparent_70%)]" />

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
                                Upload Terminal
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

            {/* MAIN */}
            <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1 text-xs text-[#9b9ba3] mb-3">
                        <Sparkles size={14} className="text-[#ededee]" />
                        <span>AI-Powered OCR &amp; Multimodal Verification</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#ededee]">
                        Upload Document
                    </h1>
                    <p className="text-xs text-[#9b9ba3] mt-1.5">
                        Files are verified in real time with Google Gemini Vision and stored securely.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-8 space-y-6">
                    {/* Document Type Dropdown */}
                    <div>
                        <label className="mb-2 block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3]">
                            Select Document Type
                        </label>
                        <div className="relative" ref={documentDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDocumentDropdownOpen((prev) => !prev)}
                                aria-haspopup="listbox"
                                aria-expanded={isDocumentDropdownOpen}
                                className={`flex w-full items-center justify-between rounded-lg border bg-[#0c0c0e] px-4 py-3 text-left text-[13px] outline-none transition-colors duration-200 ${
                                    isDocumentDropdownOpen
                                        ? "border-white/60"
                                        : "border-white/[0.1] hover:border-white/[0.2]"
                                }`}
                            >
                                <span className={selectedDocument ? "text-[#ededee] font-medium" : "text-[#5a5a60]"}>
                                    {selectedDocument || "Choose required document from checklist..."}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`shrink-0 text-[#9b9ba3] transition-transform duration-200 ${
                                        isDocumentDropdownOpen ? "rotate-180 text-[#ededee]" : ""
                                    }`}
                                />
                            </button>

                            {isDocumentDropdownOpen && (
                                <div
                                    role="listbox"
                                    className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-white/[0.1] bg-[#0c0c0e]/98 p-1.5 shadow-2xl backdrop-blur-xl"
                                >
                                    {documents.map((doc) => {
                                        const isSelected = selectedDocument === doc;
                                        return (
                                            <button
                                                key={doc}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    setSelectedDocument(doc);
                                                    setIsDocumentDropdownOpen(false);
                                                    setUploadedDocument(null);
                                                    setUploadError("");
                                                }}
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "bg-white/[0.08] text-[#ededee] font-semibold"
                                                        : "text-[#9b9ba3] hover:bg-white/[0.05] hover:text-[#ededee]"
                                                }`}
                                            >
                                                <span>{doc}</span>
                                                {isSelected && <Check size={14} className="text-[#ededee]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* State banner if document already exists */}
                    {selectedExistingDocument && (
                        <div
                            className={`rounded-xl border p-4 flex items-start gap-3.5 ${
                                isRejectedDocument
                                    ? "border-white/[0.18] bg-white/[0.03] text-[#ededee]"
                                    : isApprovedDocument
                                    ? "border-white/[0.2] bg-white/[0.04] text-[#ededee]"
                                    : "border-dashed border-white/[0.14] bg-transparent text-[#9b9ba3]"
                            }`}
                        >
                            {isRejectedDocument ? (
                                <RotateCcw size={18} className="text-[#ededee] shrink-0 mt-0.5" />
                            ) : isApprovedDocument ? (
                                <CheckCircle2 size={18} className="text-[#ededee] shrink-0 mt-0.5" />
                            ) : (
                                <ShieldAlert size={18} className="text-[#9b9ba3] shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="text-xs font-semibold">
                                    {isRejectedDocument
                                        ? "Previous Submission Rejected — Re-upload Allowed"
                                        : isApprovedDocument
                                        ? "Document Already Approved"
                                        : "Document Currently in Review"}
                                </p>
                                <p className="text-[11px] opacity-80 mt-0.5">
                                    {isRejectedDocument
                                        ? "Your previous file was rejected by the admin. You can submit a corrected document now."
                                        : isApprovedDocument
                                        ? "This certificate has been accepted and locked. Replacement is not permitted."
                                        : "This document is currently pending admin verification. Please wait before replacing."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Drag & Drop Upload Zone */}
                    <div>
                        <label className="mb-2 block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3]">
                            Upload File
                        </label>
                        <div
                            onClick={() => {
                                if (isExistingDocument && !isRejectedDocument) return;
                                document.getElementById("fileInput")?.click();
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`group relative rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 ${
                                isExistingDocument && !isRejectedDocument
                                    ? "border-white/[0.06] bg-[#0c0c0e] opacity-50 cursor-not-allowed"
                                    : isDragging
                                    ? "border-white/60 bg-white/[0.04] scale-[1.005]"
                                    : selectedFile
                                    ? "border-white/[0.3] bg-white/[0.02] hover:border-white/[0.45]"
                                    : "border-white/[0.12] bg-[#0c0c0e] hover:border-white/[0.25] cursor-pointer"
                            }`}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isExistingDocument && !isRejectedDocument}
                            />

                            {selectedFile ? (
                                <div className="space-y-3">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#fafafa] text-[#0a0a0b]">
                                        <FileCheck2 size={26} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#ededee] break-all">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-[#9b9ba3] mt-1 font-['JetBrains_Mono']">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI validation
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                            setFileError("");
                                            const input = document.getElementById("fileInput") as HTMLInputElement | null;
                                            if (input) input.value = "";
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.18] px-3 py-1 text-xs font-medium text-[#9b9ba3] hover:text-[#ededee] hover:bg-white/[0.05] transition-colors cursor-pointer"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.1] bg-[#101012] text-[#9b9ba3] group-hover:text-[#ededee] group-hover:border-white/[0.25] transition-all duration-300">
                                        <UploadIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#ededee]">
                                            Drag &amp; drop your document here
                                        </p>
                                        <p className="text-xs text-[#67676e] mt-1">
                                            or <span className="text-[#ededee] font-medium underline underline-offset-2">browse from your computer</span>
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-[#67676e] font-['JetBrains_Mono']">
                                        Supported: JPG, PNG, PDF • Maximum file size: 5 MB
                                    </p>
                                </div>
                            )}

                            {fileError && (
                                <p className="mt-3 font-['JetBrains_Mono'] text-[11px] text-[#9b9ba3]">— {fileError}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            isUploading ||
                            !selectedFile ||
                            !selectedDocument ||
                            (isExistingDocument && !isRejectedDocument)
                        }
                        className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#fafafa] py-3 text-[13px] font-semibold text-[#0a0a0b] transition-opacity duration-200 hover:opacity-90 active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isUploading ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0b] border-t-transparent" />
                                Validating with Gemini AI...
                            </span>
                        ) : isRejectedDocument ? (
                            "Replace & Verify Rejected Document"
                        ) : (
                            "Upload & Validate Document"
                        )}
                    </button>

                    {/* Upload Error */}
                    {uploadError && (
                        <div className="rounded-lg border border-white/[0.18] bg-white/[0.03] p-3 text-xs text-[#ededee] flex items-center gap-2">
                            <AlertCircle size={15} className="text-[#9b9ba3]" />
                            <span>{uploadError}</span>
                        </div>
                    )}

                    {/* AI Verification Result Card */}
                    {uploadedDocument && (
                        <div
                            className={`rounded-xl border p-5 ${
                                isValid
                                    ? "border-white/[0.2] bg-white/[0.04]"
                                    : isManualReview
                                    ? "border-dashed border-white/[0.16] bg-transparent"
                                    : "border-white/[0.08] bg-[#0c0c0e]"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                                            isValid
                                                ? "bg-[#fafafa]"
                                                : isManualReview
                                                ? "border border-white/50"
                                                : "bg-[#67676e]"
                                        }`}
                                    />
                                    <h3
                                        className={`text-sm font-semibold truncate ${
                                            isValid ? "text-[#ededee]" : isManualReview ? "text-[#ededee]" : "text-[#9b9ba3]"
                                        }`}
                                    >
                                        {isValid
                                            ? "AI Verification Succeeded"
                                            : isManualReview
                                            ? "Manual Administrative Review Required"
                                            : "AI Verification Failed"}
                                    </h3>
                                </div>

                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-['JetBrains_Mono'] shrink-0 ${
                                        isValid
                                            ? "bg-[#fafafa] text-[#0a0a0b]"
                                            : isManualReview
                                            ? "border border-white/[0.2] text-[#9b9ba3]"
                                            : "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                    }`}
                                >
                                    {uploadedDocument.aiStatus}
                                </span>
                            </div>

                            <p className="mt-3 text-xs text-[#9b9ba3] leading-relaxed">
                                {uploadedDocument.aiRemarks || "Document evaluated and recorded."}
                            </p>

                            {/* Confidence Meter */}
                            <div className="mt-4 pt-4 border-t border-white/[0.07]">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider font-medium text-[#9b9ba3]">
                                        Gemini AI Confidence Score
                                    </span>
                                    <span className="font-semibold text-[#ededee] font-['JetBrains_Mono']">
                                        {uploadedDocument.aiConfidence}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isValid ? "bg-[#fafafa]" : isManualReview ? "bg-[#9b9ba3]" : "bg-[#67676e]"
                                        }`}
                                        style={{ width: `${uploadedDocument.aiConfidence}%` }}
                                    />
                                </div>
                            </div>

                            {uploadedDocument.actionRequired && (
                                <div className="mt-4 rounded-lg border border-dashed border-white/[0.16] p-2.5 text-xs text-[#9b9ba3] flex items-center gap-2">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>
                                        Action required:{" "}
                                        <strong className="capitalize text-[#ededee]">
                                            {uploadedDocument.actionRequired.replace(/_/g, " ")}
                                        </strong>
                                    </span>
                                </div>
                            )}

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => navigate("/documents")}
                                    className="text-xs font-semibold text-[#ededee] hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                                >
                                    View in Document Archive
                                    <ArrowUpRight size={13} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Upload;