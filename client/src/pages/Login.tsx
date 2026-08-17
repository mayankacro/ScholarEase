import { useState } from "react"

function Login(){
    // useSate() --> React ka ek Hook hai jo component ke andar data ko remember/state mein rakhne deta hai.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault(); //Email likho Password likho Login click karo Console check karo Page reload nahi hona chahiye
        console.log("Email:", email);
        console.log("Password:", password);
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