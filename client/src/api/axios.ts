import axios from "axios";

//Axios ek JavaScript library hai jo frontend se HTTP requests bhejne ke kaam aati hai.

const api = axios.create({ //Hum apna Axios ka customized instance bana rahe hain.
    baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {  //interceptor => Jab bhi api se request jaane wali ho, usse pehle mere paas aao.
    const token = localStorage.getItem("token");

    if(token){ //Agar token hai, request ke headers mein daal do.
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
