import { useEffect, useState } from "react";
import api from "../api/axios"
import { useNavigate } from "react-router-dom";
import "../App.css";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const nameParts = user.name.split(" ");
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    // console.log("Name Parts:", nameParts);
    // console.log("First Initial:", nameParts[0].charAt(0));
    // console.log("Second Initial:", nameParts[1].charAt(0));
    // console.log("initials:", initials);
    

    const [documents, setDocuments] = useState<any[]>([]);
    const [showProfile, setShowProfile] = useState(false);
    const [checklist, setChecklist] = useState<any>(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        console.log("User Logged out");

        navigate("/login");
    }

    useEffect(() => { //React ka ek Hook hai jo component ke render hone ke baad koi side-effect ka kaam karne deta hai.
        //Component load hone ke baad jo kaam karwana ho

        console.log("Student Dashboard loaded");
        console.log("Ab documents fetch krne hain");
        
        const fetchDocuments = async () => {

            const res = await api.get("/api/documents/my-documents");

            console.log("Response:", res.data.documents);

            setDocuments(res.data.documents);
        };
        
        fetchDocuments();

        const fetchChecklist = async () => {
            const res = await api.get(`/api/checklist/${user.scholarshipType}`);

            console.log("Checklist Response:", res.data.rule);

            setChecklist(res.data.rule);

            console.log("Required doc:", res.data.rule.requiredDocuments);
        };

        fetchChecklist();
        
        
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

    const verifiedDocuments = documents.filter(
        (doc) => doc.status === "verified"

    );
    console.log("verified doc:", verifiedDocuments);
    console.log("verified count:", verifiedDocuments.length);

    const pendingDocuments = documents.filter(
        (doc) => doc.status === "pending"
    );

    console.log("Pending doc:", pendingDocuments);
    console.log("Pending count:", pendingDocuments.length);

    const rejectedDocuments = documents.filter(
        (doc) => doc.status === "rejected"
    );

    console.log("Rejected doc:", rejectedDocuments);
    console.log("Rejected count:", rejectedDocuments.length);


//     const requiredDocuments = [
//     "Aadhaar card",
//     "Marksheet",
//     "Income certificate",
//     "Caste certificate",
//     "Bank passbook",
//     "Passport photo",
//     "admit card"
// ];

// const documentTypeMap: { [key: string]: string } = {
//     "aadhaar": "Aadhaar card",
//     "marksheet": "Marksheet",
//     "income certificate": "Income certificate",
//     "caste certificate": "Caste certificate",
//     "bank passbook": "Bank passbook",
//     "professional photo": "Passport photo",
//     "admit card": "admit card",
// };

// const uploadedDocumnetNames = documents.map(
//     (doc)=> documentTypeMap[doc.documentType]
// );

// console.log("Uploadd documents:", uploadedDocumnetNames);
 

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
                    
                    <h1>Dashboard</h1>

{/* <p>Student: {user.name}</p>

<p>Scholarship: {user.scholarshipType}</p> */}
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
                    {user.scholarshipType} Scholarship
                </span>

                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                    <button onClick={() => setShowProfile(!showProfile)}>
                        {initials}
 
                    </button>

                    {showProfile && (
                        <div> 
                            <p> {user.name}</p>
                            <p>{user.email}</p>
                            <p>{user.scholarshipType} Scholarship</p> 
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                        </div>
                    )}
                </div>

            </div>

        </nav>


        {/* Temporary */}
       {/* Dashboard Header */}
<div className="dashboard-container">

    {/* Top row */}
    <div className="flex items-center justify-between">

        <div>
            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>

            <p className="text-sm text-gray-600 mt-1">
                0 of {documents.length} documents verified · {user.scholarshipType} Scholarship
            </p>

            
        </div>


        {/* Upload Button */}
        <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-white hover:text-black transition font-medium">
            ↑ Upload
        </button>

    </div>

    <div>

        <div className="stats-container">

              <div className="stat-card" >
                    <p>UPLOADED</p>
                    <h2>{documents.length}</h2>
                    <p>Total</p>

              </div>

              <div className="stat-card" >
                    <p>VERIFIED</p>
                    <h2>{verifiedDocuments.length}</h2>
                    <p>Total</p>

              </div>

              <div className="stat-card" >
                    <p>PENDING</p>
                    <h2>{pendingDocuments.length}</h2>
                    <p>Total</p>

              </div>

              <div className="stat-card" >
                    <p>REJECTED</p>
                    <h2>{rejectedDocuments.length}</h2>
                    <p>Total</p>

              </div>


            
        </div>
              <div className="document-checklist">
                <h2>Document checklist</h2>    
                 {checklist?.requiredDocuments?.map((doc: string) => (   /*? ka mtlb hai --> Agar checklist abhi available nahi hai, to error mat do. */
                      <p key={doc}>{doc}</p> /* Har document ke liye ek <p> banao, document ka naam usme dikhao, aur React ko us document ko identify karne ke liye key do */
                          ))}            
              </div>

    </div>

</div>

    </div>
);

}

export default StudentDashboard;