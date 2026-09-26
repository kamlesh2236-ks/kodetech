import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth.api";

const ProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuthentication = async () => {

            try {

                await getMe();

                setAuthenticated(true);

            } catch (error) {

                console.log("Not authenticated");

                setAuthenticated(false);

            } finally {

                setLoading(false);

            }
        };

        checkAuthentication();

    }, []);


    if (loading) {
        return (
            <div>
                Checking authentication...
            </div>
        );
    }


    if (!authenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;
};

export default ProtectedRoute;