import { lazy } from "react";
import { LayoutGrid, Mail, Settings } from "lucide-react";

export const ADMIN_ROUTES = [
    {
        path: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        group: "Overview",
        element: lazy(() => import("../pages/admin/Dashboard")),
    },
    {
        path: "enquiry",
        label: "Enquiries",
        icon: Mail,
        group: "Manage",
        element: lazy(() => import("../pages/admin/Enquiry")),
    },
    // {
    //     path: "settings",
    //     label: "Settings",
    //     icon: Settings,
    //     group: "System",
    //     element: lazy(() => import("#")),
    // },
];