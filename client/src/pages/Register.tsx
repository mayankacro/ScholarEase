import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
// import { execArgv } from "process";

function Register() {
    
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [scholarshipType, setScholarshipType] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: any) => {
        e.preventDefault();

        setError("");

        try{
            const res = await api.post("/api/auth/register", {
                name,
                email,
                password,
                scholarshipType,
            });

            console.log("Register Response:", res.data);

            navigate("/login");

        } catch (error: any){
            setError(
                error.response?.data?.message || "Resgistration failed"
            );
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

                {error && <p>{error}</p>}
                

            <form onSubmit={handleRegister}>


                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <select
                    value={scholarshipType}
                    onChange={(e) => setScholarshipType(e.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="ST">ST</option>
                    <option value="SC">SC</option>
                    <option value="OBC">OBC</option>
                    <option value="General">General</option>
                </select>

                <button type="submit">
                    Create Account
                </button>

            </form>
        </div>
    );
}

export default Register;





// import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";


// function Register() {
//     const navigate = useNavigate();

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [scholarshipType, setScholarshipType] = useState("");
//     const [error, setError] = useState("");

//     return (
//         <div>
//             Register
//         </div>
//     )
// }

// export default Register;