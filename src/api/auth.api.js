import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5000/api"});

export const loginUser = async (userData) => {
    const response = await Api.post("/LoginAuth/login", userData);

    return response.data
}
