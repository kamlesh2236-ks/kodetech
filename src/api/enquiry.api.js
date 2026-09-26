import Axios from "axios";

const Api = Axios.create({baseURL: "http://localhost:5000/api", withCredentials: true});

export const enquiry = async(formData) => {
    const response = await Api.post("/enquiry", formData);

    return response.data;
}

export const getEnquiry = async() => {
    const response = await Api.get("/enquiry");

    return response.data;
} 