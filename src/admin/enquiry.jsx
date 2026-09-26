import { useState, useEffect } from "react";
import { getEnquiry } from "../api/enquiry.api";

const Enquiry = () => {
    const [enquiry, setEnquiry] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const loadEnquiries = async () => {
            try {
                const data = await getEnquiry();

                setEnquiry(data.enquiry);
            } catch (err) {
                console.error("Failed to load enquiries", err)
            } finally {
                setloading(false)
            }
        }

        loadEnquiries();
    }, [])

    if (loading) {
        return <div>Loading enquiries...</div>;
    }

    return (
        <>
            <h1>Enquiries</h1>
            {enquiry.map((en) => (
                <div key={en._id}>
                    <h1>{en.name}</h1>
                    <p>{en.phone}</p>
                    <p>{en.role}</p>
                    <p>{en.hasWebsite}</p>
                </div>
            ))}
        </>
    )
}


export default Enquiry