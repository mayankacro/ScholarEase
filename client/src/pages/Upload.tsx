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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [existingDocuments, setExistingDocuments] = useState<any[]>([]);



    const handleUpload = async () => {
        if (!selectedDocument) {
            setUploadError("Please select a document type.");
            return;
        }

        if (!selectedFile) {
            setUploadError("Please select a file.");
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

            console.log("Upload Response:", res.data);

            setUploadedDocument(res.data.document);

        } catch (error: any) {
            console.error("Upload failed:", error);

            setUploadError(
                error.response?.data?.message || "Document upload failed."
            );
        } finally {
            setIsUploading(false);
        }
    };


    const validateFile = (file: File) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf"
        ];

        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
            setFileError("Only JPG, PNG and PDF files are allowed.");
            return false;
        }

        if (file.size > maxSize) {
            setFileError("File size must be less than 5 MB.");
            return false;
        }

        setFileError("");
        return true;
    };




    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (validateFile(file)) {
            setSelectedFile(file);
        }

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
        if (isExistingDocument && !isRejectedDocument) {
    return;
}
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (!file) return;

        if (validateFile(file)) {
            setSelectedFile(file);
        }

    };

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

        const fetchExistingDocuments = async () => {
    try {
        const res = await api.get("/api/documents/my-documents");
        setExistingDocuments(res.data.documents || []);
    } catch (error) {
        console.error("Failed to fetch existing documents:", error);
    }
};

fetchExistingDocuments();

    }, []);

    
const selectedExistingDocument = existingDocuments.find(
    (doc) =>
        doc.documentType === selectedDocument &&
        doc.scholarshipType === user.scholarshipType
);

const isRejectedDocument =
    selectedExistingDocument?.status?.toLowerCase() === "rejected";

    
const existingStatus = String(
    selectedExistingDocument?.status ?? ""
).toLowerCase();

const isApprovedDocument = existingStatus === "approved";

const isPendingDocument = existingStatus === "pending";

const isExistingDocument = Boolean(selectedExistingDocument);



    const aiStatus = String(uploadedDocument?.aiStatus ?? "")
        .trim()
        .toLowerCase();

    const isValid = aiStatus === "valid";
    const isManualReview = aiStatus === "manual_review";


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
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black shadow-md transform transition active:scale-95 duration-100 ease-in-out"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/upload")}
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black shadow-md transform transition active:scale-95 duration-100 ease-in-out"
                    >
                        Upload
                    </button>

                    <button
                        onClick={() => navigate("/documents")}
                        className="px-4 py-2 rounded-lg border border-gray-700  hover:bg-purple-300 hover:text-black shadow-md transform transition active:scale-95 duration-100 ease-in-out"
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

                
{selectedExistingDocument && (
    <div
        className={`mb-5 rounded-xl border p-4 ${
            isRejectedDocument
                ? "border-red-500/30 bg-red-500/5"
                : isApprovedDocument
                ? "border-green-500/30 bg-green-500/5"
                : "border-yellow-500/30 bg-yellow-500/5"
        }`}
    >
        <p className="text-sm font-medium">
            {isRejectedDocument
                ? "Document Rejected — Replacement Allowed"
                : isApprovedDocument
                ? "Document Already Approved"
                : "Document Awaiting Review"}
        </p>

        <p className="mt-1 text-xs text-zinc-400">
            {isRejectedDocument
                ? "Upload a corrected document to replace the rejected file."
                : isApprovedDocument
                ? "This document is already approved and cannot be replaced."
                : "Please wait for admin review before uploading this document again."}
        </p>
    </div>
)}



                {/* Upload Area */}
                <div
                    onClick={() => {
    if (isExistingDocument && !isRejectedDocument) return;
    document.getElementById("fileInput")?.click();
}}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}

                    className={`group border-2 border-dashed rounded-2xl bg-gradient-to-b from-[#141218] to-[#101010] p-10 sm:p-12 text-center cursor-pointer transition-all duration-200 ${isDragging
                            ? "border-purple-400 bg-purple-400/10 scale-[1.01]"
                            : selectedFile
                                ? "border-green-500/50 hover:border-green-400"
                                : "border-[#38343f] hover:border-purple-400/70 hover:bg-purple-400/[0.03]"
                        }`}

                >

                    <input
                        id="fileInput"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="text-4xl mb-4">
                        ↑
                    </div>

                    {selectedFile ? (


                        <>
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-2xl text-green-400">
                                ✓
                            </div>

                            <h2 className="break-all text-base font-medium">
                                {selectedFile.name}
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    setFileError("");

                                    const input = document.getElementById(
                                        "fileInput"
                                    ) as HTMLInputElement | null;

                                    if (input) input.value = "";
                                }}
                                className="mt-4 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                            >
                                Remove file
                            </button>
                        </>


                    ) : (

                        <>
                            <h2 className="text-base font-medium">
                                Drag & drop your file here
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                or click to browse
                            </p>

                            <p className="text-xs text-gray-600 mt-4">
                                JPG, PNG or PDF · Maximum file size: 5 MB
                            </p>
                        </>

                    )}

                    {fileError && (
                        <p className="text-sm text-red-400 mt-4">
                            {fileError}
                        </p>
                    )}

                </div>

                <button
                    type="button"
                    onClick={handleUpload}
disabled={
    isUploading ||
    !selectedFile ||
    !selectedDocument ||
    (isExistingDocument && !isRejectedDocument)
}              
      className="mt-6 w-full rounded-xl bg-purple-400 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                   
{isUploading ? (
  <span className="inline-flex items-center justify-center gap-2">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    Uploading & Validating...
  </span>

) : (
  isRejectedDocument
    ? "Replace Rejected Document"
    : "Upload Document"
)}


                </button>


                {uploadedDocument && (
                    <div
                        className={`mt-3 rounded-xl border p-4 ${isValid
                            ? "border-green-500/40 bg-green-500/5"
                            : isManualReview
                                ? "border-yellow-500/40 bg-yellow-500/5"
                                : "border-red-500/40 bg-red-500/5"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${isValid
                                        ? "bg-green-400"
                                        : isManualReview
                                            ? "bg-yellow-400"
                                            : "bg-red-400"
                                        }`}
                                />

                                <span
                                    className={`select-none text-sm font-medium ${isValid
                                        ? "text-green-300"
                                        : isManualReview
                                            ? "text-yellow-300"
                                            : "text-red-300"
                                        }`}
                                >
                                    {isValid
                                        ? "AI Verification Successful"
                                        : isManualReview
                                            ? "Manual Review Required"
                                            : "AI Verification Failed"}
                                </span>
                            </div>

                            <span
                                className={`rounded border px-2 py-0.5 text-xs ${isValid
                                    ? "border-green-500/40 bg-green-500/5"
                                    : isManualReview
                                        ? "border-yellow-500/40 bg-yellow-500/5"
                                        : "border-red-500/40 bg-red-500/5"
                                    }`}
                            >
                                {isValid ? "Valid" : isManualReview ? "Manual Review" : "Invalid"}
                            </span>
                        </div>

                        <p className="mt-3 text-sm leading-5 text-zinc-400">
                            {uploadedDocument.aiRemarks}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                                Confidence
                            </span>

                            <div className="h-0.5 flex-1 bg-zinc-800">
                                <div
                                    className={`h-full ${isValid
                                        ? "bg-green-400"
                                        : isManualReview
                                            ? "bg-yellow-400"
                                            : "bg-red-400"
                                        }`}
                                    style={{
                                        width: `${uploadedDocument.aiConfidence}%`,
                                    }}
                                />
                            </div>

                            <span
                                className={`text-xs font-semibold ${isValid
                                    ? "text-green-400"
                                    : isManualReview
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                            >
                                {uploadedDocument.aiConfidence}%
                            </span>
                        </div>

                        {uploadedDocument.actionRequired && (
                            <p className="mt-3 text-xs text-yellow-400">
                                {uploadedDocument.actionRequired}
                            </p>
                        )}
                    </div>
                )}


                {uploadError && (
                    <p className="mt-3 text-sm text-red-400">
                        {uploadError}
                    </p>
                )}

            </main>

        </div>

    );
}

export default Upload;