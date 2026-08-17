import axios from "axios";

//Axios ek JavaScript library hai jo frontend se HTTP requests bhejne ke kaam aati hai.

const api = axios.create({
    baseURL: "http://localhost:5000",
})

export default api;
