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
} from "lucide-react";

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
    


    const students = studentsData.map((student) => {
        const studentDocuments = documentsData.filter(
            (document) =>
                document.studentId &&
                document.studentId._id === student._id
        );

        let status = "Not Started";

        if (studentDocuments.length > 0) {
            const hasRejected = studentDocuments.some(
                (document) => document.status === "rejected"
            );

            const allApproved = studentDocuments.every(
                (document) => document.status === "approved"
            );

            if (hasRejected) {
                status = "Rejected";
            } else if (allApproved) {
                status = "Approved";
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

    const approvedDocuments = documentsData.filter(
        (doc) => doc.status === "approved"

    );

    const pendingDocuments = documentsData.filter(
        (doc) => doc.status === "pending"
    );

    const rejectedDocuments = documentsData.filter(
        (doc) => doc.status === "rejected"
    );




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
        <div className="min-h-screen bg-black text-white">

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

                    <button className="px-4 py-2 rounded-lg border border-blue-400/40 bg-blue-500/10 text-sm text-white">
                        Dashboard
                    </button>

                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-white hover:border-zinc-700">
                        Students
                    </button>

                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-white hover:border-zinc-700">
                        Documents
                    </button>

                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-white hover:border-zinc-700">
                        Analytics
                    </button>

                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1">
                        Admin
                    </span>

                    <button
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                        className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs uppercase"
                    >
                        {initials}
                    </button>
                </div>

            </nav>

            


            {/* Main */}
            <main className="px-6 py-7">

                {/* Heading */}
                <div className="mb-5">
                    <h1 className="text-xl font-semibold">
                        Admin Dashboard
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Review and manage student scholarship documents
                    </p>
                </div>


                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">

                    {/* Total */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
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


                    {/* Pending */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    PENDING REVIEW
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {pendingDocuments.length}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    Documents awaiting approval
                                </p>
                            </div>

                            <Clock3 className="h-6 w-6 text-yellow-400" />
                        </div>
                    </div>


                    {/* Approved */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    APPROVED
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {approvedDocuments.length}
                                </p>

                                <p className="text-xs text-zinc-500 mt-3">
                                    Documents approved
                                </p>
                            </div>

                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                        </div>
                    </div>


                    {/* Rejected */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-xs text-zinc-500">
                                    REJECTED
                                </p>

                                <p className="text-3xl mt-3 font-medium">
                                    {rejectedDocuments.length}
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
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">

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


                        {/* Scholarship */}
                        <div className="relative lg:w-52">

                            <select
                                value={scholarshipFilter}
                                onChange={(e) => setScholarshipFilter(e.target.value)}
                                className="appearance-none w-full h-10 rounded-lg border border-zinc-800 bg-black px-3 pr-9 text-sm text-zinc-300 outline-none"
                            >
                                <option>All Scholarship Types</option>
                                <option>ST Scholarship</option>
                                <option>SC Scholarship</option>
                                <option>OBC Scholarship</option>
                                <option>General Scholarship</option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                        </div>


                        {/* Status */}
                        <div className="relative lg:w-44">

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none w-full h-10 rounded-lg border border-zinc-800 bg-black px-3 pr-9 text-sm text-zinc-300 outline-none"
                            >
                                <option>All Status</option>
                                <option>Not Started</option>
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                        </div>

                    </div>


                    {/* Table */}
                    <div className="px-5 overflow-x-auto">

                        <div className="min-w-[850px] rounded-lg border border-zinc-800 overflow-hidden">

                            {/* Table Header */}
                            <div className="grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_100px_110px_100px] bg-zinc-900/60 px-3 py-3 text-xs text-zinc-500">

                                <span >#</span>
                                <span>Student Name</span>
                                <span>Email</span>
                                <span>Scholarship Type</span>
                                <span className="text-center">Documents</span>
                                <span className="text-center">Status</span>
                                <span className="text-center">Action</span>

                            </div>


                            {/* Rows */}
                            {filteredStudents.map((student, index) => (

                                <div
                                    key={student.id}
                                    className="grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_100px_110px_100px] items-center px-3 py-3 border-t border-zinc-900 text-sm hover:bg-zinc-900/30 transition "
                                >

                                    <span className="text-zinc-500 ">
                                        {index+1}
                                    </span>

                                    <span className="text-zinc-200">
                                        {student.name}
                                    </span>

                                    <span className="text-zinc-500 ">
                                        {student.email}
                                    </span>

                                    <span className="text-zinc-300 ">
                                        {student.scholarship}
                                    </span>

                                    <span className="text-zinc-400 text-center">
                                        {student.documents}
                                    </span>

                                    <div className=" flex justify-center">


                                    <span>
                                        <span
                                            className={`text-center inline-flex px-3 py-1 rounded-md border text-xs ${getStatusClass(
                                                student.status
                                            )}`}
                                        >
                                            {student.status}
                                        </span>
                                    </span>
                                    </div>


                           
                                    <div className=" flex justify-center">


                                    <button

                                        onClick={() => navigate(`/admin/student/${student.id}`)}
                                        
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
                  


                    {/* Pagination */}
                    <div className="px-5 py-4 flex items-center justify-between">

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