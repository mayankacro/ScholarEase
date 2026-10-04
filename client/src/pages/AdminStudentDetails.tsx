import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import api from "../api/axios";

function AdminStudentDetails() {

    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingDocument, setUpdatingDocument] = useState<string | null>(null);
    const [validatingDocument, setValidatingDocument] = useState<string | null>(null);

    const updateDocumentStatus = async (
        documentId: string,
        status: "approved" | "rejected"
    ) => {
        try {
            setUpdatingDocument(documentId);

            const res = await api.patch(
                `/api/documents/${documentId}/status`,
                { status }
            );

            console.log("Status updated:", res.data);

            // UI me immediately updated document dikhao
            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc._id === documentId
                        ? { ...doc, status }
                        : doc
                )
            );

        } catch (error: any) {
            console.error("Failed to update document status:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update document status"
            );
        } finally {
            setUpdatingDocument(null);
        }
    };

    const validateDocumentAI = async (documentId: string) => {
        try {
            setValidatingDocument(documentId);

            const res = await api.patch(
                `/api/documents/${documentId}/validate-ai`
            );

            console.log("AI validation result:", res.data);

            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc._id === documentId
                        ? res.data.document
                        : doc
                )
            );

        } catch (error: any) {
            console.error("AI validation failed:", error);

            alert(
                error.response?.data?.message ||
                "AI validation failed"
            );
        } finally {
            setValidatingDocument(null);
        }
    };

    useEffect(() => {


        const fetchStudentDetails = async () => {

            try {
                setLoading(true);

                const [studentsResponse, documentsResponse] =
                    await Promise.all([
                        api.get("/api/auth/students"),
                        api.get("/api/documents/all"),
                    ]);

                const students = studentsResponse.data.students;
                const allDocuments = documentsResponse.data.documents;

                const selectedStudent = students.find(
                    (student: any) => student._id === studentId
                );

                if (!selectedStudent) {
                    setError("Student not found");
                    return;
                }

                const studentDocuments = allDocuments.filter(
                    (document: any) =>
                        document.studentId &&
                        document.studentId._id === studentId
                );

                setStudent(selectedStudent);
                setDocuments(studentDocuments);

            } catch (error: any) {

                console.error("Failed to fetch student details:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load student details"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();

    }, [studentId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-zinc-400 text-sm">
                    Loading student details...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-red-400 text-sm">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-black text-white">

            {/* Navbar */}
            <nav className="h-16 border-b border-zinc-900 px-6 flex items-center">

                <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>

            </nav>


            {/* Main */}
            <main className="px-6 py-7">

                {/* Heading */}
                <div className="mb-6">

                    <h1 className="text-xl font-semibold">
                        Student Details
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Review student information and uploaded documents
                    </p>

                </div>


                {/* Student Info */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 mb-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-medium">
                                {student.name}
                            </h2>

                            <p className="text-sm text-zinc-500 mt-1">
                                {student.email}
                            </p>
                        </div>

                        <span className="text-xs text-zinc-300 border border-zinc-800 rounded-full px-3 py-1">
                            {student.scholarshipType} Scholarship
                        </span>

                    </div>

                </div>


                {/* Documents */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">

                    <div className="px-5 py-5 border-b border-zinc-900">

                        <h2 className="text-lg font-medium">
                            Documents
                        </h2>

                        <p className="text-xs text-zinc-500 mt-1">
                            {documents.length} documents uploaded
                        </p>

                    </div>


                    {documents.length === 0 ? (

                        <div className="px-5 py-12 text-center">

                            <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-3" />

                            <p className="text-sm text-zinc-400">
                                No documents uploaded yet
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-zinc-900">

                            {documents.map((document) => (

                                <div
                                    key={document._id}
                                    className="px-5 py-4 grid grid-cols-[1fr_80px_100px_260px] items-center gap-4"
                                >

                                    <div>

                                        <p className="text-sm text-zinc-200">
                                            {document.documentType}
                                        </p>

                                        <p className="text-xs text-zinc-500 mt-1">
                                            AI: {document.aiStatus}
                                        </p>

                                        <p className="text-xs text-zinc-500 mt-1 max-w-md truncate">
                                            {document.aiRemarks || "No AI remarks available"}
                                        </p>

                                        {document.actionRequired && (
                                            <p className="text-xs text-orange-400 mt-1">
                                                Action:{" "}
                                                {document.actionRequired === "reupload_clearer_image"
                                                    ? "Re-upload a clearer image"
                                                    : "Re-upload the correct document"}
                                            </p>
                                        )}



                                    </div>







                                    <div className="text-center mr-15">
                                        <span className="text-xs text-zinc-400">
                                            {document.aiConfidence}%
                                        </span>
                                    </div>

                                    <div className="flex justify-center mr-20">
                                        <span
                                            className={`px-3 py-1 rounded-md border text-xs ${document.status === "approved"
                                                ? "border-green-500/30 bg-green-500/10 text-green-400"
                                                : document.status === "rejected"
                                                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                                                    : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                                }`}
                                        >
                                            {document.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end gap-3.5">

                                        <a
                                            href={document.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 text-xs text-zinc-300 hover:border-blue-400/50 hover:text-white transition"
                                        >
                                            View
                                            <ExternalLink className="h-3 w-3" />
                                        </a>

                                        <button
                                            onClick={() => validateDocumentAI(document._id)}
                                            disabled={validatingDocument === document._id}
                                            className="w-24 px-3 py-1.5 rounded-md border border-blue-500/30 text-blue-400 text-xs whitespace-nowrap hover:bg-blue-500/10 transition disabled:opacity-50"
                                        >
                                            {validatingDocument === document._id
                                                ? "Validating..."
                                                : "Re-run AI"}
                                        </button>



                                        <button
                                            onClick={() =>
                                                updateDocumentStatus(document._id, "approved")
                                            }
                                            disabled={updatingDocument === document._id}
                                            className="px-3 py-1.5 rounded-md border border-green-500/30 text-green-400 text-xs hover:bg-green-500/10 transition disabled:opacity-50"
                                        >
                                            Approve
                                        </button>



                                        <button
                                            onClick={() =>
                                                updateDocumentStatus(document._id, "rejected")
                                            }
                                            disabled={updatingDocument === document._id}
                                            className="px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition disabled:opacity-50"
                                        >
                                            Reject
                                        </button>

                                    </div>



                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default AdminStudentDetails;