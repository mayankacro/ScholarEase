import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    FilePlus2,
    FileText,
    Trash2,
    Save,
    FolderOpen,
    Sparkles,
    ArrowLeft,
    Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import { toast } from "../components/Toast";

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
                const response = await api.get(
                    `/api/checklist/${encodeURIComponent(scholarshipType)}`
                );
                setDocuments(response.data.rule?.requiredDocuments || []);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setDocuments([]);
                } else {
                    console.error("Fetch checklist error:", error);
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
            toast("Document rule already exists in this list!");
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
            toast("Please select a scholarship category and add at least one required document.");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            let checklistExists = false;
            try {
                await api.get(`/api/checklist/${encodeURIComponent(scholarshipType)}`);
                checklistExists = true;
            } catch (error: any) {
                if (error.response?.status !== 404) throw error;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = checklistExists
                ? await api.put(
                      `/api/checklist/${encodeURIComponent(scholarshipType)}`,
                      { requiredDocuments: documents },
                      config
                  )
                : await api.post(
                      "/api/checklist",
                      { scholarshipType, requiredDocuments: documents },
                      config
                  );

            toast(
                response.data.message ||
                    (checklistExists
                        ? "Checklist updated successfully!"
                        : "Checklist created successfully!")
            );
        } catch (error: any) {
            console.error("Checklist save error:", error.response?.data || error);
            toast(
                error.response?.data?.message ||
                    "Checklist save failed. Please check the backend."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(700px_340px_at_50%_-5%,rgba(255,255,255,0.04),transparent_70%)]" />

            {/* TOP NAV */}
            <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0a0a0b]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#101012] px-3.5 py-1.5 text-xs font-medium text-[#9b9ba3] hover:text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer"
                    >
                        <ArrowLeft size={14} className="text-[#ededee]" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.03] px-3 py-1 text-xs text-[#ededee]">
                        <Shield size={12} />
                        <span>Rule Configuration</span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1 text-xs text-[#9b9ba3] mb-3">
                        <Sparkles size={14} className="text-[#ededee]" />
                        <span>Institutional Checklist Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#ededee]">
                        Configure Mandatory Checklist
                    </h1>
                    <p className="text-xs text-[#9b9ba3] mt-1.5">
                        Define which documents must be uploaded and verified for each scholarship reservation tier.
                    </p>
                </div>

                {/* Configuration Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-6 sm:p-8 space-y-7">
                    {/* Category Selection */}
                    <div>
                        <label className="mb-2 block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3]">
                            Scholarship Category
                        </label>
                        <CustomDropdown
                            value={scholarshipType}
                            onChange={setScholarshipType}
                            placeholder="Select reservation category (SC, ST, OBC, General)..."
                            buttonClassName="!py-3 !text-[13px] !rounded-lg"
                            buttonColorClassName="border-white/[0.1] bg-[#0c0c0e] text-[#ededee]"
                            options={[
                                { label: "Select Category", value: "" },
                                { label: "SC - Scheduled Caste", value: "SC" },
                                { label: "ST - Scheduled Tribe", value: "ST" },
                                { label: "OBC - Other Backward Class", value: "OBC" },
                                { label: "General Merit Tier", value: "General" },
                            ]}
                        />
                        <p className="mt-2 text-[11px] text-[#67676e]">
                            Changing category immediately fetches its existing required document rule list.
                        </p>
                    </div>

                    {/* Add Document Row */}
                    <div>
                        <label className="mb-2 block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3]">
                            Add Required Document
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FilePlus2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e] h-4 w-4" />
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
                                    placeholder="e.g. Income Certificate / Caste Certificate / 12th Marksheet"
                                    className="w-full rounded-lg border border-white/[0.1] bg-[#0c0c0e] py-3 pl-10 pr-4 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors focus:border-white/60"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={addDocument}
                                disabled={!documentName.trim()}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.18] bg-white/[0.03] px-5 py-3 text-xs font-semibold text-[#ededee] hover:bg-white/[0.07] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <FilePlus2 size={14} />
                                <span>Add Rule</span>
                            </button>
                        </div>
                    </div>

                    {/* Current Documents List */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b9ba3]">
                                    Enforced Checklist Items
                                </h3>
                                <p className="text-[11px] text-[#67676e] mt-0.5">
                                    Students in this category must upload each certificate below
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0c0c0e] px-3 py-1 text-xs text-[#9b9ba3]">
                                <FileText size={12} className="text-[#ededee]" />
                                <span className="font-['JetBrains_Mono']">{documents.length} items</span>
                            </span>
                        </div>

                        {documents.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-white/[0.1] bg-[#0c0c0e] p-8 text-center">
                                <FolderOpen size={28} className="mx-auto text-[#67676e] mb-2" />
                                <p className="text-xs text-[#9b9ba3]">
                                    {scholarshipType
                                        ? "No documents configured for this category yet. Add items above."
                                        : "Select a scholarship category to view and edit its rules."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {documents.map((doc, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#0c0c0e] px-4 py-3 transition-colors hover:border-white/[0.16]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.05] text-[10px] font-['JetBrains_Mono'] text-[#9b9ba3]">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[13px] font-medium text-[#ededee]">
                                                {doc}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeDocument(idx)}
                                            className="text-[#67676e] hover:text-[#ededee] transition-colors p-1 cursor-pointer"
                                            title="Delete rule"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4 flex-wrap">
                        <p className="text-[11px] text-[#67676e]">
                            Updates immediately take effect on all student upload terminals.
                        </p>

                        <button
                            type="button"
                            onClick={saveChecklist}
                            disabled={saving || !scholarshipType || documents.length === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-6 py-3 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Save size={14} />
                            <span>{saving ? "Saving Rules..." : "Save Checklist Rules"}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminChecklist;