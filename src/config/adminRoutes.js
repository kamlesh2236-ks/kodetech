import { lazy } from "react";
import { LayoutGrid, Mail, Settings } from "lucide-react";

export const ADMIN_ROUTES = [
    {
        path: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        group: "Overview",
        element: lazy(() => import("../pages/admin/dashboard")),
    },
    {
        path: "enquiry",
        label: "Enquiries",
        icon: Mail,
        group: "Manage",
        element: lazy(() => import("../pages/admin/enquiry")),
    },
    // {
    //     path: "settings",
    //     label: "Settings",
    //     icon: Settings,
    //     group: "System",
    //     element: lazy(() => import("#")),
    // },
];