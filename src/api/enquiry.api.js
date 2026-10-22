import Axios from "axios";
import toast from "react-hot-toast";

const Api = Axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });

export const enquiry = async (formData) => {
    const response = await Api.post("/enquiry", formData);

    return response.data;
}

export const getEnquiry = async () => {
    const response = await Api.get("/enquiry");

    return response.data;
};

export const deleteEnquiry = async (id) => {

    try {
        const response = await Api.delete(`/enquiry/${id}`);

        return response.data;
    } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed")

        throw err;
    }

};

export const markEnquiry = async (id) => {
    try{
        const response = await Api.patch(`/enquiry/${id}`);

        return response.data
    }catch(err){
        toast.error(err.response?.data?.message || "Marked Error");
        throw err;
    }
}