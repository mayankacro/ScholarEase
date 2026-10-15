import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Users,
    Clock3,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ClipboardList,
    LogOut,
    ArrowUpRight,
    Shield,
    FileText,
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

function AdminDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const nameParts = (user.name || "Admin User").split(" ");
    const initials =
        nameParts
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part.charAt(0))
            .join("")
            .toUpperCase() || "A";

    const [search, setSearch] = useState("");
    const [scholarshipFilter, setScholarshipFilter] = useState("All Scholarship Types");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [showProfile, setShowProfile] = useState(false);
    const [studentsData, setStudentsData] = useState<any[]>([]);
    const [documentsData, setDocumentsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const students = studentsData.map((student) => {
        const studentDocuments = documentsData.filter(
            (document) =>
                document.studentId && document.studentId._id === student._id
        );

        const finalStatus = student.finalApplicationStatus || "pending";
        let status = "Not Started";

        if (studentDocuments.length > 0) {
            if (finalStatus === "approved") {
                status = "Approved";
            } else if (finalStatus === "rejected") {
                status = "Rejected";
            } else {
                status = "Pending";
            }
        }

        return {
            id: student._id,
            name: student.name,
            email: student.email,
            scholarship: `${student.scholarshipType} Scholarship`,
            documents: studentDocuments.length,
            status,
        };
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const [studentsResponse, documentsResponse] = await Promise.all([
                    api.get("/api/auth/students"),
                    api.get("/api/documents/all"),
                ]);

                setStudentsData(studentsResponse.data.students || []);
                setDocumentsData(documentsResponse.data.documents || []);
            } catch (err: any) {
                console.error("Failed to fetch admin data:", err);
                setError(err.response?.data?.message || "Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.email.toLowerCase().includes(search.toLowerCase());

        const matchesScholarship =
            scholarshipFilter === "All Scholarship Types" ||
            student.scholarship === scholarshipFilter;

        const matchesStatus =
            statusFilter === "All Status" || student.status === statusFilter;

        return matchesSearch && matchesScholarship && matchesStatus;
    });

    const pendingApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "pending"
    ).length;

    const approvedApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "approved"
    ).length;

    const rejectedApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "rejected"
    ).length;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] flex flex-col font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
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
                                Administrative Command
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin/checklist")}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#101012] px-3.5 py-1.5 text-xs font-medium text-[#9b9ba3] hover:text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer"
                        >
                            <ClipboardList size={14} className="text-[#ededee]" />
                            <span>Checklist Rules</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.03] px-3 py-1 text-xs text-[#ededee]">
                            <Shield size={12} />
                            <span className="font-semibold">Super Admin</span>
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
                                            Role: Admin
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowProfile(false);
                                            navigate("/admin/checklist");
                                        }}
                                        className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-[#9b9ba3] hover:bg-white/[0.04] hover:text-[#ededee] transition-colors cursor-pointer"
                                    >
                                        <span>Manage Checklist Rules</span>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#ededee]">
                            Scholarship Review Queue
                        </h1>
                        <p className="text-xs text-[#9b9ba3] mt-1.5">
                            Verify submitted dossiers, inspect AI OCR signals, and grant or reject scholarships.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/checklist")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#fafafa] px-4 py-2.5 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <ClipboardList size={15} />
                        <span>Configure Checklist</span>
                    </button>
                </div>

                {/* 4 METRIC TILES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-5 transition-colors hover:border-white/[0.16]">
                        <div className="flex items-center justify-between text-[#9b9ba3] text-xs mb-1">
                            <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Total Students</span>
                            <Users size={16} className="text-[#67676e]" />
                        </div>
                        <p className="text-3xl font-semibold text-[#ededee] mt-1 tracking-tight">{studentsData.length}</p>
                        <p className="text-[11px] text-[#67676e] mt-1">Registered applicants</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.18] bg-white/[0.03] p-5 transition-colors hover:border-white/[0.3]">
                        <div className="flex items-center justify-between text-[#ededee] text-xs mb-1">
                            <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Granted</span>
                            <CheckCircle2 size={16} className="text-[#ededee]" />
                        </div>
                        <p className="text-3xl font-semibold text-[#ededee] mt-1 tracking-tight">{approvedApplications}</p>
                        <p className="text-[11px] text-[#9b9ba3] mt-1">Disbursements ready</p>
                    </div>

                    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#101012] p-5 transition-colors hover:border-white/[0.22]">
                        <div className="flex items-center justify-between text-[#9b9ba3] text-xs mb-1">
                            <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Pending Audit</span>
                            <Clock3 size={16} className="text-[#9b9ba3]" />
                        </div>
                        <p className="text-3xl font-semibold text-[#ededee] mt-1 tracking-tight">{pendingApplications}</p>
                        <p className="text-[11px] text-[#67676e] mt-1">Awaiting decision</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-5 transition-colors hover:border-white/[0.16]">
                        <div className="flex items-center justify-between text-[#67676e] text-xs mb-1">
                            <span className="uppercase text-[10px] tracking-[0.12em] font-['JetBrains_Mono']">Rejected</span>
                            <XCircle size={16} className="text-[#67676e]" />
                        </div>
                        <p className="text-3xl font-semibold text-[#9b9ba3] mt-1 tracking-tight">{rejectedApplications}</p>
                        <p className="text-[11px] text-[#67676e] mt-1">Re-uploads requested</p>
                    </div>
                </div>

                {/* STUDENTS ROSTER */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#101012] p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-[#ededee]">Student Directory &amp; Queue</h2>
                            <p className="text-xs text-[#9b9ba3] mt-0.5">
                                Select any candidate to review their verified credentials and AI confidence logs
                            </p>
                        </div>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#67676e]">
                            Showing <strong className="text-[#ededee]">{filteredStudents.length}</strong> candidates
                        </span>
                    </div>

                    {/* Search & Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
                        <div className="md:col-span-6 relative">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67676e]"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search applicant by name or email address..."
                                className="w-full rounded-lg border border-white/[0.1] bg-[#0c0c0e] py-2.5 pl-10 pr-4 text-[13px] text-[#ededee] placeholder-[#5a5a60] outline-none transition-colors focus:border-white/60"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <CustomDropdown
                                value={scholarshipFilter}
                                onChange={setScholarshipFilter}
                                placeholder="All Scholarship Types"
                                buttonClassName="!py-2.5 !text-[13px] !rounded-lg"
                                buttonColorClassName="border-white/[0.1] bg-[#0c0c0e] text-[#ededee]"
                                options={[
                                    { label: "All Scholarship Categories", value: "All Scholarship Types" },
                                    { label: "ST Scholarship", value: "ST Scholarship" },
                                    { label: "SC Scholarship", value: "SC Scholarship" },
                                    { label: "OBC Scholarship", value: "OBC Scholarship" },
                                    { label: "General Scholarship", value: "General Scholarship" },
                                ]}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <CustomDropdown
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="All Status"
                                buttonClassName="!py-2.5 !text-[13px] !rounded-lg"
                                buttonColorClassName="border-white/[0.1] bg-[#0c0c0e] text-[#ededee]"
                                options={[
                                    { label: "All Decisions", value: "All Status" },
                                    { label: "Not Started", value: "Not Started" },
                                    { label: "Pending", value: "Pending" },
                                    { label: "Approved", value: "Approved" },
                                    { label: "Rejected", value: "Rejected" },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Roster Table */}
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#ededee] border-t-transparent" />
                            <p className="mt-3 text-xs text-[#9b9ba3]">Loading applicant rosters...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-[#9b9ba3] text-xs">{error}</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-xl">
                            <p className="text-xs text-[#67676e]">No students found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-[#0c0c0e] font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-wider text-[#67676e]">
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4 text-center">Documents</th>
                                        <th className="py-3 px-4 text-center">Decision</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05]">
                                    {filteredStudents.map((student, idx) => {
                                        const isApproved = student.status === "Approved";
                                        const isRejected = student.status === "Rejected";

                                        return (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="py-3.5 px-4 text-xs text-[#67676e] font-['JetBrains_Mono']">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <p className="text-[13px] font-medium text-[#ededee]">{student.name}</p>
                                                    <p className="text-[11px] text-[#67676e] font-['JetBrains_Mono']">{student.email}</p>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="inline-block rounded-md border border-white/[0.1] bg-[#0c0c0e] px-2.5 py-1 text-[11px] text-[#9b9ba3] font-['JetBrains_Mono']">
                                                        {student.scholarship}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ededee]">
                                                        <FileText size={12} className="text-[#67676e]" />
                                                        {student.documents}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                                                            isApproved
                                                                ? "bg-[#fafafa] text-[#0a0a0b]"
                                                                : isRejected
                                                                ? "bg-white/[0.05] text-[#67676e] line-through decoration-1"
                                                                : "border border-white/[0.18] text-[#9b9ba3]"
                                                        }`}
                                                    >
                                                        {isApproved ? (
                                                            <CheckCircle2 size={11} />
                                                        ) : isRejected ? (
                                                            <XCircle size={11} />
                                                        ) : (
                                                            <Clock3 size={11} />
                                                        )}
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => navigate(`/admin/student/${student.id}`)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0c0c0e] px-3 py-1.5 text-[11px] font-medium text-[#ededee] hover:border-white/[0.25] transition-all cursor-pointer"
                                                    >
                                                        <span>Audit</span>
                                                        <ArrowRight size={12} className="text-[#ededee]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;