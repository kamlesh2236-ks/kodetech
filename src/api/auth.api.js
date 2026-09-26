import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5000/api", withCredentials: true,});

export const loginUser = async (userData) => {
    const response = await Api.post("/auth/login", userData);

    return response.data;
}

export const getMe = async () => {
    const response = await Api.get("/auth/me");

    return response.data;
}

export const logoutUser = async () => {
    const response = await Api.post("/auth/logout");

    return response.data;
}