import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [scholarshipType, setScholarshipType] = useState("");
    const [error, setError] = useState("");

    return (
        <div>
            Register
        </div>
    )
}

export default Register;