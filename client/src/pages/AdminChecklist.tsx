import { useState, useEffect } from "react";
import axios from "axios";
import {
    ClipboardList,
    GraduationCap,
    FilePlus2,
    FileText,
    Trash2,
    Save,
    CheckCircle2,
    FolderOpen,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";

function AdminChecklist() {
    const navigate = useNavigate();

    const [scholarshipType, setScholarshipType] = useState("");
    const [documentName, setDocumentName] = useState("");
    const [documents, setDocuments] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!scholarshipType) {
            setDocuments([]);
            return;
        }

        const fetchChecklist = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/checklist/${encodeURIComponent(scholarshipType)}`
                );

                setDocuments(response.data.rule.requiredDocuments || []);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setDocuments([]);
                } else {
                    console.error("Fetch checklist error:", error);
                    alert("Could not load checklist.");
                    setDocuments([]);
                }
            }
        };

        fetchChecklist();
    }, [scholarshipType]);

    const addDocument = () => {
        const name = documentName.trim();

        if (!name) return;

        if (documents.some((doc) => doc.toLowerCase() === name.toLowerCase())) {
            alert("Document already added!");
            return;
        }

        setDocuments([...documents, name]);
        setDocumentName("");
    };

    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const saveChecklist = async () => {
        if (!scholarshipType || documents.length === 0) {
            alert("Please select a scholarship and add documents.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            // Check whether this category's checklist already exists
            let checklistExists = false;

            try {
                await axios.get(
                    `http://localhost:5000/api/checklist/${encodeURIComponent(scholarshipType)}`
                );
                checklistExists = true;
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    throw error;
                }
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = checklistExists
                ? await axios.put(
                    `http://localhost:5000/api/checklist/${encodeURIComponent(scholarshipType)}`,
                    { requiredDocuments: documents },
                    config
                )
                : await axios.post(
                    "http://localhost:5000/api/checklist",
                    {
                        scholarshipType,
                        requiredDocuments: documents,
                    },
                    config
                );

            alert(
                response.data.message ||
                (checklistExists
                    ? "Checklist updated successfully!"
                    : "Checklist created successfully!")
            );
        } catch (error: any) {
            console.error("Checklist save error:", error.response?.data || error);

            alert(
                error.response?.data?.message ||
                "Checklist save failed. Please check the backend."
            );
        } finally {
            setSaving(false);
        }
    };


    return (




        <div className="min-h-screen bg-[#09090b] text-white px-4 py-8 md:px-8 md:py-12">

            <button
                type="button"
                onClick={() => navigate("/admin")}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </button>

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">

                    <div className="flex  flex-wrap items-center gap-3">
                        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                            <ClipboardList className="h-6 w-6 text-blue-400" />
                        </div>
                        <h1 className="text-3xl  font-bold tracking-tight md:text-4xl">
                            Create Checklist
                        </h1>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Admin Tools
                        </span>
                    </div>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                        Manage scholarship requirements and keep document checklists
                        organized for every student category.
                    </p>
                </div>

                {/* Main Card */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131316] shadow-2xl shadow-black/20">

                    <div className="border-b border-white/[0.07] px-5 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                                <GraduationCap className="h-5 w-5 text-blue-400" />
                            </div>

                            <div>
                                <h2 className="font-semibold">Checklist Configuration</h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Select a category and manage its required documents.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-7 p-5 md:p-7">

                        <div>
    <label className="mb-2.5 block text-sm font-medium text-zinc-300">
        Scholarship Category
    </label>

    <CustomDropdown
        value={scholarshipType}
        onChange={setScholarshipType}
        placeholder="Select scholarship category"
        buttonClassName="!rounded-xl !px-4 !py-3.5 focus:!border-blue-500"
        buttonColorClassName="border-zinc-700/80 bg-[#09090b] text-white hover:border-zinc-600"
        options={[
            { label: "Select Scholarship Category", value: "Select Scholarship Category"},
            { label: "SC", value: "SC" },
            { label: "ST", value: "ST" },
            { label: "OBC", value: "OBC" },
            { label: "General", value: "General" },
        ]}
    />

    <p className="mt-2 text-xs text-zinc-500">
        Each category has its own document requirements.
    </p>
</div>

                        {/* Add Document */}
                        <div>
                            <label className="mb-2.5 block text-sm font-medium text-zinc-300">
                                Add Required Document
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <FilePlus2 className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500" />

                                    <input
                                        type="text"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addDocument();
                                            }
                                        }}
                                        placeholder="e.g. Income Certificate"
                                        className="w-full rounded-xl border border-zinc-700/80 bg-[#09090b] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={addDocument}
                                    disabled={!documentName.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <FilePlus2 className="h-4 w-4" />
                                    Add Document
                                </button>
                            </div>
                        </div>

                        {/* Document List Header */}
                        <div>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold">Required Documents</h3>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Documents students must provide.
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-800/70 px-3 py-1.5 text-xs font-medium text-zinc-300">
                                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                                    {documents.length} documents
                                </span>
                            </div>

                            {/* Empty State */}
                            {documents.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-5 py-12 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                                        <FolderOpen className="h-6 w-6 text-zinc-400" />
                                    </div>

                                    <p className="font-medium text-zinc-300">
                                        No documents added yet
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Add a document using the field above.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {documents.map((doc, index) => (
                                        <div
                                            key={`${doc}-${index}`}
                                            className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#09090b] p-3.5 transition hover:border-blue-500/30 hover:bg-zinc-900/70 sm:p-4"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/15 bg-blue-500/10 text-xs font-semibold text-blue-400">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <FileText className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-blue-400" />
                                                    <span className="break-words text-sm font-medium text-zinc-200">
                                                        {doc}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                aria-label={`Remove ${doc}`}
                                                title="Remove document"
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-2 text-xs font-medium text-zinc-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save Section */}
                        <div className="border-t border-white/[0.07] pt-6">
                            <button
                                type="button"
                                disabled={
                                    !scholarshipType ||
                                    documents.length === 0 ||
                                    saving
                                }
                                onClick={saveChecklist}
                                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                                        Saving Checklist...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Checklist
                                    </>
                                )}
                            </button>

                            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Changes are saved to your scholarship checklist.
                            </div>
                        </div>

                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-zinc-600">
                    ScholarEase · Scholarship Management
                </p>
            </div>
        </div>
    );
}

export default AdminChecklist;