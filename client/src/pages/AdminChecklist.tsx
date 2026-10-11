import { useState , useEffect} from "react";
import axios from "axios";

function AdminChecklist() {
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
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Create Checklist
                </h1>

                <p className="text-zinc-400 mb-8">
                    Manage required documents for each scholarship category.
                </p>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">

                    <div>
                        <label className="block text-sm mb-2 text-zinc-300">
                            Scholarship Category
                        </label>

                        <select
                            value={scholarshipType}
                            onChange={(e) => setScholarshipType(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none focus:border-blue-500"
                        >
                            <option value="">Select scholarship</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="OBC">OBC</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-zinc-300">
                            Required Documents
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
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
                                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={addDocument}
                                className="bg-blue-600 hover:bg-blue-500 rounded-lg px-5 py-3 font-medium transition"
                            >
                                + Add Document
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold">Document List</h2>
                            <span className="text-sm text-zinc-400">
                                {documents.length} documents
                            </span>
                        </div>

                        {documents.length === 0 ? (
                            <div className="border border-dashed border-zinc-700 rounded-xl p-8 text-center text-zinc-500">
                                No documents added yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc, index) => (
                                    <div
                                        key={`${doc}-${index}`}
                                        className="flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-blue-400">
                                                {index + 1}.
                                            </span>
                                            <span>{doc}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    

                    <div className="border-t border-zinc-800 pt-5">
                        <button
                            type="button"
                            disabled={!scholarshipType || documents.length === 0 || saving}
                            onClick={saveChecklist}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed rounded-lg p-3 font-semibold transition"
                        >
                            {saving ? "Saving..." : "Save Checklist"}
                        </button>

                        <p className="text-xs text-zinc-500 mt-3 text-center">
                            Save functionality will be connected to the backend next.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminChecklist;
