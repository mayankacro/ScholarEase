import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Users,
    Clock3,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ClipboardList
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

function AdminDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");


    const nameParts = user.name.split(" ");
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);

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

        console.log("User Logged out");

        navigate("/login");
    }

    const students = studentsData.map((student) => {
        const studentDocuments = documentsData.filter(
            (document) =>
                document.studentId &&
                document.studentId._id === student._id
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
            documents: `${studentDocuments.length}`,
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

                console.log("Students:", studentsResponse.data);
                console.log(
                    "Final application statuses:",
                    studentsResponse.data.students.map((student: any) => ({
                        name: student.name,
                        finalApplicationStatus: student.finalApplicationStatus,
                    }))
                );
                console.log("Documents:", documentsResponse.data);

                setStudentsData(studentsResponse.data.students);
                setDocumentsData(documentsResponse.data.documents);

            } catch (error: any) {
                console.error("Failed to fetch admin data:", error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load admin data"
                );
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
            statusFilter === "All Status" ||
            student.status === statusFilter;

        return matchesSearch && matchesScholarship && matchesStatus;
    });

    const getStatusClass = (status: string) => {
        if (status === "Approved") {
            return "border-green-500/30 bg-green-500/10 text-green-400";
        }

        if (status === "Rejected") {
            return "border-red-500/30 bg-red-500/10 text-red-400";
        }

        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    };


    const pendingApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "pending"
    ).length;

    const approvedApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "approved"
    ).length;

    const rejectedApplications = studentsData.filter(
        (student) => student.finalApplicationStatus === "rejected"
    ).length;





    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-zinc-400 text-sm">
                    Loading admin dashboard...
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
        <div className="h-screen overflow-hidden bg-black text-white flex flex-col">
            {/* Navbar */}
            <nav className="h-16 border-b border-zinc-900 px-6 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center font-semibold">
                        Λ
                    </div>

                    <span className="text-sm font-semibold">
                        ScholarEase
                    </span>
                </div>



                <div className="flex items-center gap-2">





                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1">
                        Admin
                    </span>

                    {/* Profile */}
                    <div className="relative">

                        <button
                            onClick={() =>
                                setShowProfile(!showProfile)
                            }
                            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs uppercase"
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
                                    Admin
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
            <main className="flex-1 min-h-0 overflow-hidden flex flex-col px-6 py-4">


                {/* Heading */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Admin Dashboard
                        </h1>

                        <p className="text-sm text-zinc-500 mt-1">
                            Review and manage student scholarship documents
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/checklist")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20 hover:border-blue-400 active:scale-95"
                    >
                        <ClipboardList className="h-4 w-4" />
                        Create Checklist
                    </button>
                </div>





                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">

                    {/* Total */}
                    <div className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    TOTAL STUDENTS
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {studentsData.length}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    All registered students
                                </p>
                            </div>

                            <Users className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>

                    {/* Approved */}
                    <div className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    APPROVED
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {approvedApplications}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    Documents approved
                                </p>
                            </div>

                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    PENDING REVIEW
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {pendingApplications}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    Documents awaiting approval
                                </p>
                            </div>

                            <Clock3 className="h-6 w-6 text-yellow-400" />
                        </div>
                    </div>




                    {/* Rejected */}
                    <div className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    REJECTED
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {rejectedApplications}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    Documents rejected
                                </p>
                            </div>

                            <XCircle className="h-6 w-6 text-red-400" />
                        </div>
                    </div>

                </div>




                {/* Students Card */}
                <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                    {/* Header */}
                    <div className="px-5 pt-5">

                        <h2 className="text-lg font-medium">
                            Students
                        </h2>

                        <p className="text-xs text-zinc-500 mt-1">
                            View all students and their document status
                        </p>

                    </div>


                    {/* Filters */}
                    <div className="px-5 py-5 flex flex-col lg:flex-row gap-3">

                        {/* Search */}
                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full h-10 rounded-lg border border-zinc-800 bg-black pl-10 pr-3 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                            />

                        </div>


                       
<CustomDropdown
    value={scholarshipFilter}
    onChange={setScholarshipFilter}
    placeholder="All Scholarship Types"
    className="lg:w-52 "
    buttonClassName="!h-10 !py-0 "
        buttonColorClassName="border-zinc-800 bg-black text-zinc-0 hover:border-zinc-700"

    options={[
        { label: "All Scholarship Types", value: "All Scholarship Types" },
        { label: "ST Scholarship", value: "ST Scholarship" },
        { label: "SC Scholarship", value: "SC Scholarship" },
        { label: "OBC Scholarship", value: "OBC Scholarship" },
        { label: "General Scholarship", value: "General Scholarship" },
    ]}
/>



                       {/* Status */}
<CustomDropdown
    value={statusFilter}
    onChange={setStatusFilter}
    placeholder="All Status"
    className="lg:w-44"
    buttonClassName="!h-10 !py-0"
    buttonColorClassName="border-zinc-800 bg-black text-zinc-300 hover:border-zinc-700"
    options={[
        { label: "All Status", value: "All Status" },
        { label: "Not Started", value: "Not Started" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
    ]}
/>

                    </div>



                    {/* Table Area */}
                    <div className="flex-1 min-h-0 px-5 pb-1">
                        <div className="h-full min-w-[850px] rounded-lg border border-zinc-800 flex flex-col overflow-hidden">

                            {/* Fixed Table Header */}
                            <div className="shrink-0 grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_100px_110px_100px] bg-zinc-900 px-3 py-3 text-xs text-zinc-400 border-b border-zinc-800">
                                <span>Std.</span>
                                <span>Student Name</span>
                                <span>Email</span>
                                <span>Scholarship Type</span>
                                <span className="text-center">Documents</span>
                                <span className="text-center">Status</span>
                                <span className="text-center">Action</span>
                            </div>

                            {/* Only Student Rows Scroll */}
                            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                                {filteredStudents.map((student, index) => (
                                    <div
                                        key={student.id}
                                        className="grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_100px_110px_100px] items-center px-3 py-3 border-b border-zinc-900 text-sm hover:bg-zinc-900/30 transition"
                                    >
                                        <span className="text-zinc-500">
                                            {index + 1}
                                        </span>

                                        <span className="text-zinc-200 truncate pr-2">
                                            {student.name}
                                        </span>

                                        <span className="text-zinc-500 truncate pr-2">
                                            {student.email}
                                        </span>

                                        <span className="text-zinc-300 truncate pr-2">
                                            {student.scholarship}
                                        </span>

                                        <span className="text-zinc-400 text-center">
                                            {student.documents}
                                        </span>

                                        <div className="flex justify-center">
                                            <span
                                                className={`text-center inline-flex px-3 py-1 rounded-md border text-xs whitespace-nowrap ${getStatusClass(
                                                    student.status
                                                )}`}
                                            >
                                                {student.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/student/${student.id}`)
                                                }
                                                className="w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 text-xs text-zinc-300 hover:border-blue-400/50 hover:text-white transition"
                                            >
                                                View
                                                <ArrowRight className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>




                    {/* Pagination */}
                    <div className="shrink-0 px-5 py-3 flex items-center justify-between">
                        <p className="text-xs text-zinc-500">
                            Showing 1 to {filteredStudents.length} of {students.length} students
                        </p>

                        <div className="flex items-center gap-1">

                            <button className="p-2 text-zinc-500 hover:text-white">
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <button className="h-8 w-8 rounded-md bg-zinc-800 text-sm">
                                1
                            </button>

                            <button className="h-8 w-8 rounded-md text-sm text-zinc-500 hover:bg-zinc-900">
                                2
                            </button>

                            <button className="h-8 w-8 rounded-md text-sm text-zinc-500 hover:bg-zinc-900">
                                3
                            </button>

                            <button className="h-8 w-8 rounded-md text-sm text-zinc-500 hover:bg-zinc-900">
                                4
                            </button>

                            <button className="h-8 w-8 rounded-md text-sm text-zinc-500 hover:bg-zinc-900">
                                5
                            </button>

                            <button className="p-2 text-zinc-500 hover:text-white">
                                <ChevronRight className="h-4 w-4" />
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;