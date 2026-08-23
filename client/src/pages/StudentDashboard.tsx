import { useEffect, useState } from "react";
import api from "../api/axios"

function StudentDashboard() {

    const [documents, setDocuments] = useState<any[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    useEffect(() => { //React ka ek Hook hai jo component ke render hone ke baad koi side-effect ka kaam karne deta hai.
        //Component load hone ke baad jo kaam karwana ho

        console.log("Student Dashboard loaded");
        console.log("Ab documents fetch krne hain");
        
        const fetchDocuments = async () => {

            const res = await api.get("/api/documents/my-documents");

//             console.log("Full Response:", res.data);
// console.log("Documents Array:", res.data.documents);
// console.log("Documents Length:", res.data.documents.length);

            console.log("Response:", res.data.documents);

            setDocuments(res.data.documents);
        };
        
        fetchDocuments();
        
    }, []);


    // return (
    //     <div>
    //        <h1>Student Dasboard</h1> 

    //        <p>Total Documents: {documents.length}</p>

    //        <div>
    //          {documents.map((doc) => (  /*har document ke liye run hoga. */
    //             <div key={doc._id}>
    //                 <h2>{doc.documentType}</h2>

    //                 <p>{doc.scholarshipType}</p>

    //                 <p>{doc.status}</p>
    //             </div>
    //         ))}
    //        </div>
    //     </div>
    // );

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

                <button className="px-4 py-2 rounded-lg border border-gray-700">
                    Dashboard
                </button>

                <button className="px-4 py-2 rounded-lg border border-gray-700">
                    Upload
                </button>

                <button className="px-4 py-2 rounded-lg border border-gray-700">
                    Documents
                </button>

            </div>


            {/* Right side */}
            <div className="flex items-center gap-3">

                <span className="text-xs text-gray-500 border border-gray-900 px-3 py-1 rounded-full">
                    ST Scholarship
                </span>

                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                    MK
                </div>

            </div>

        </nav>


        {/* Temporary */}
       {/* Dashboard Header */}
<div className="px-6 pt-8">

    {/* Top row */}
    <div className="flex items-center justify-between">

        <div>
            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>

            <p className="text-sm text-gray-600 mt-1">
                0 of {documents.length} documents verified · ST Scholarship
            </p>
        </div>


        {/* Upload Button */}
        <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-white hover:text-black transition font-medium">
            ↑ Upload
        </button>

    </div>

</div>

    </div>
);

}

export default StudentDashboard;