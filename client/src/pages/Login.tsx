import { useState } from "react"
import api from "../api/axios";

function Login(){
    // useSate() --> React ka ek Hook hai jo component ke andar data ko remember/state mein rakhne deta hai.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e: any) => {
        e.preventDefault(); //Email likho Password likho Login click karo Console check karo Page reload nahi hona chahiye
        
        setError("");// supose wrong password fir invalid credential phir user password correct karta hai. To purana error screen se hatna chahiye.

        try{
        const res = await api.post("/api/auth/login", {
            email,
            password,
        });
        console.log(res.data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

    } catch (error: any){
        setError(
            error.response?.data?.message || "Login failed"
        );

    }
};

const getProfile = async () => {
    try {
        const res = await api.get("/api/auth/profile");
        console.log("Profile:", res.data)
    } catch(error: any){
        console.log("Profile failed:",
            error.response?.data?.message || "Profile failed"
        );
    }
};

    return (
        <form onSubmit={handleLogin}>

            {error && <p>{error}</p>} 

            <input
              type="email"
              required
              placeholder="Email likho"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />

            <input
            type="password"
            required
            placeholder="pass likho"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit"> 
                Login
            </button>

            <button type="button" onClick={getProfile}>
                Get Profile
            </button>

              <p> Tu ne likha: {email}</p>
            
            </form>

            
            

    )

}



export default Login