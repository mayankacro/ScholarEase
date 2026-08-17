import { useState } from "react"
import api from "../api/axios";

function Login(){
    // useSate() --> React ka ek Hook hai jo component ke andar data ko remember/state mein rakhne deta hai.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: any) => {
        e.preventDefault(); //Email likho Password likho Login click karo Console check karo Page reload nahi hona chahiye
        
        const res = await api.post("/api/auth/login", {
            email: email,
            password: password
        });
        console.log(res.data)
    
    };

    return (
        <form onSubmit={handleLogin}>

        
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

              <p> Tu ne likha: {email}</p>
            
            </form>

            
            

    )

}



export default Login