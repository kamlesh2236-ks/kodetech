import React, { Suspense, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, LogOut, X } from "lucide-react";
import { logoutUser } from "../api/auth.api";
import { ADMIN_ROUTES } from "../config/adminRoutes";

const GROUPS = ADMIN_ROUTES.filter((r) => !r.hidden).reduce((acc, r) => {
    (acc[r.group] ||= []).push(r);
    return acc;
}, {});

const readCollapsed = () => {
    try {
        return localStorage.getItem("sidebar-collapsed") === "1";
    } catch {
        return false;
    }
};

export default function AdminLayout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(readCollapsed);

    useEffect(() => {
        try {
            localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
        } catch {}
    }, [collapsed]);

    const toggleSidebar = () => {
        if (window.matchMedia("(min-width: 1024px)").matches) {
            setCollapsed((c) => !c);
        } else {
            setOpen((o) => !o);
        }
    };

    const current = ADMIN_ROUTES.find((r) => pathname.startsWith(`/admin/${r.path}`));
    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const hideWhenCollapsed = collapsed ? "lg:hidden" : "";
    const centerWhenCollapsed = collapsed ? "lg:justify-center lg:px-0" : "";

    return (
        <div className="min-h-screen bg-[#090B1C] text-slate-100 flex relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 left-1/4 w-[620px] h-[620px] bg-blue-600/20 rounded-full blur-[150px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[520px] h-[520px] bg-pink-500/15 rounded-full blur-[150px]" />

            {open && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 z-30 h-screen w-64 shrink-0 border-r border-white/5 bg-[#0E1128]/90 backdrop-blur-xl flex flex-col p-4 gap-7 transition-[width,transform] duration-200 lg:translate-x-0 ${
                    collapsed ? "lg:w-[76px] lg:px-3" : "lg:w-64"
                } ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className={`flex items-center gap-3 px-2 ${centerWhenCollapsed}`}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-pink-900/40 shrink-0">
                        A
                    </div>
                    <div className={hideWhenCollapsed}>
                        <div className="font-extrabold tracking-tight text-[15px] leading-none">Adminly</div>
                        <div className="text-[11px] text-slate-500 mt-1">Control panel</div>
                    </div>
                    <button
                        className="ml-auto lg:hidden text-slate-400"
                        onClick={() => setOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
                    {Object.entries(GROUPS).map(([group, items]) => (
                        <div key={group} className="flex flex-col gap-1">
                            <div className={`text-[11px] font-semibold text-slate-500 px-3 mb-1 ${hideWhenCollapsed}`}>
                                {group}
                            </div>
                            {items.map(({ path, label, icon: Icon }) => (
                                <NavLink
                                    key={path}
                                    to={`/admin/${path}`}
                                    title={label}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${centerWhenCollapsed} ${
                                            isActive
                                                ? "bg-gradient-to-r from-blue-500/20 to-pink-500/10 text-white shadow-[inset_2px_0_0_0_#ec4899]"
                                                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                                        }`
                                    }
                                >
                                    <Icon size={17} strokeWidth={2} className="shrink-0" />
                                    <span className={`whitespace-nowrap ${hideWhenCollapsed}`}>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-white/5 px-2">
                    <div className={`flex items-center gap-3 mb-3 ${centerWhenCollapsed}`}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-[12px] font-bold shrink-0">
                            KD
                        </div>
                        <div className={`leading-tight ${hideWhenCollapsed}`}>
                            <div className="text-[13px] font-bold whitespace-nowrap">Kumar Dev</div>
                            <div className="text-[11px] text-slate-500">Administrator</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors ${centerWhenCollapsed}`}
                    >
                        <LogOut size={15} className="shrink-0" />
                        <span className={hideWhenCollapsed}>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="relative z-10 flex-1 min-w-0 flex flex-col min-h-screen">
                <header className="flex items-center gap-4 px-4 sm:px-8 py-5 border-b border-white/5 sticky top-0 z-10 bg-[#090B1C]/70 backdrop-blur-xl">
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                        className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                        <Menu size={18} />
                    </button>
                    <div>
                        <h1 className="text-[19px] font-extrabold tracking-tight">{current?.label ?? "Admin"}</h1>
                        <p className="text-[12px] text-slate-500 mt-0.5">{today}</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/5 rounded-xl px-3.5 py-2 w-64 text-slate-500 text-[13px] focus-within:border-blue-500/50">
                            <Search size={15} />
                            <input
                                placeholder="Search anything…"
                                className="bg-transparent outline-none w-full text-slate-100 placeholder:text-slate-500"
                            />
                        </div>
                        <button className="relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center hover:bg-white/[0.07] transition-colors">
                            <Bell size={16} className="text-slate-400" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-pink-500" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 px-4 sm:px-8 py-6">
                    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
                        <Outlet />
                    </Suspense>
                </main>

                <footer className="px-4 sm:px-8 py-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-500">
                    <span>© {new Date().getFullYear()} Adminly. All rights reserved.</span>
                    <span>Built by Kumar Dev</span>
                </footer>
            </div>
        </div>
    );
}