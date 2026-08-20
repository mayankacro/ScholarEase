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
    return (
        <div>
           <h1>Student Dasboard</h1> 

           <p>Total Documents: {documents.length}</p>

           <div>
             {documents.map((doc) => (  /*har document ke liye run hoga. */
                <p key={doc._id}>
                    {doc.documentType}
                </p>
            ))}
           </div>
        </div>
    );
}

export default StudentDashboard;