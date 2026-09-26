import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import {
    LayoutGrid,
    BarChart3,
    Activity,
    Users,
    Mail,
    ShoppingBag,
    Boxes,
    CreditCard,
    Settings,
    LifeBuoy,
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/* ---------------- Static UI data (replace with real API data) ---------------- */

const NAV = [
    {
        group: "Overview",
        items: [
            { label: "Dashboard", icon: LayoutGrid, active: true },
        ],
    },
    {
        group: "Manage",
        items: [
            { label: "Enquiries", icon: Mail, },
        ],
    },
    {
        group: "System",
        items: [
            { label: "Settings", icon: Settings },
        ],
    },
];

const STATS = [
    { label: "Total revenue", value: "₹4,82,300", delta: "+12.4%", up: true, accent: "from-amber-400 to-orange-600" },
    { label: "Active users", value: "2,148", delta: "+6.1%", up: true, accent: "from-emerald-400 to-teal-600" },
    // { label: "New orders", value: "318", delta: "-2.3%", up: false, accent: "from-sky-400 to-blue-600" },
    { label: "Pending tickets", value: "14", delta: "0.0%", up: null, accent: "from-rose-400 to-red-600" },
];

const REVENUE = [
    { day: "Mon", v: 58 }, { day: "Tue", v: 92 }, { day: "Wed", v: 70 },
    { day: "Thu", v: 130 }, { day: "Fri", v: 100 }, { day: "Sat", v: 150 },
    { day: "Sun", v: 118 },
];

const ACTIVITY = [
    { text: "New order #4821 placed by Rohit Sharma", time: "2 min ago", color: "bg-emerald-400" },
    { text: "Payment pending for invoice #INV-1092", time: "18 min ago", color: "bg-amber-400" },
    { text: "New user Priya Verma signed up", time: "1 hr ago", color: "bg-sky-400" },
    { text: "Payment failed for order #4790", time: "3 hr ago", color: "bg-rose-400" },
    { text: 'Product "Wireless Mouse" restocked', time: "5 hr ago", color: "bg-emerald-400" },
];



/* ---------------- Component ---------------- */

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [activeNav, setActiveNav] = useState("Dashboard");
    const [orderTab, setOrderTab] = useState("All");


    const handleLogout = async () => {
        try {
            const data = await logoutUser();

            console.log("Logout response:", data);

            navigate("/login", { replace: true });

        } catch (error) {
            console.error("Logout error:", error);

            // Agar backend logout fail bhi ho,
            // user ko login page par bhej sakte ho.
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0D10] text-zinc-100 font-sans flex relative overflow-hidden">
            {/* ambient glow */}
            <div className="pointer-events-none absolute -top-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px]" />

            {/* ---------------- Sidebar ---------------- */}
            <aside className="relative z-10 w-64 shrink-0 border-r border-white/5 bg-[#101317]/80 backdrop-blur-xl flex flex-col p-4 gap-7">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-extrabold text-[#1a1406] shadow-lg shadow-orange-900/40">
                        A
                    </div>
                    <div>
                        <div className="font-extrabold tracking-tight text-[15px] leading-none">Adminly</div>
                        <div className="text-[11px] text-zinc-500 mt-1">Control panel</div>
                    </div>
                </div>

                <nav className="flex flex-col gap-6 overflow-y-auto">
                    {NAV.map((group) => (
                        <div key={group.group} className="flex flex-col gap-1">
                            <div className="text-[10.5px] font-semibold text-zinc-500 px-3 mb-1 tracking-wide">
                                {group.group}
                            </div>
                            {group.items.map(({ label, icon: Icon, badge }) => {
                                const isActive = activeNav === label;
                                return (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            setActiveNav(label);

                                            if (label === "Enquiries") {
                                                navigate("/admin/enquiry");
                                            }

                                            if (label === "Dashboard") {
                                                navigate("/admin/dashboard");
                                            }
                                        }}
                                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all
                      ${isActive
                                                ? "bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 shadow-[inset_1px_0_0_0_rgba(245,158,11,0.6)]"
                                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                                            }`}
                                    >
                                        <Icon size={17} strokeWidth={2} />
                                        {label}
                                        {badge && (
                                            <span
                                                className={`ml-auto text-[10.5px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-amber-400 text-[#1a1406]" : "bg-white/5 text-zinc-400"
                                                    }`}
                                            >
                                                {badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-white/5 px-2">

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-[12px] font-bold">
                            KD
                        </div>

                        <div className="leading-tight">
                            <div className="text-[13px] font-bold">
                                Kumar Dev
                            </div>

                            <div className="text-[11px] text-zinc-500">
                                Administrator
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                        Logout
                    </button>

                </div>
            </aside>

            {/* ---------------- Main ---------------- */}
            <div className="relative z-10 flex-1 min-w-0 flex flex-col">
                {/* Topbar */}
                <header className="flex items-center gap-4 px-8 py-5 border-b border-white/5 sticky top-0 bg-[#0B0D10]/70 backdrop-blur-xl">
                    <div>
                        <h1 className="text-[19px] font-extrabold tracking-tight">{activeNav}</h1>
                        <p className="text-[12px] text-zinc-500 mt-0.5">Overview for Wed, 24 Sep 2026</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/5 rounded-xl px-3.5 py-2 w-64 text-zinc-500 text-[13px]">
                            <Search size={15} />
                            <span>Search anything…</span>
                        </div>
                        <button className="relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center hover:bg-white/[0.07] transition-colors">
                            <Bell size={16} className="text-zinc-400" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-[12px] font-bold">
                            KD
                        </div>
                    </div>
                </header>

                <main className="px-8 py-6 overflow-y-auto">
                    {/* Stat cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {STATS.map((s) => (
                            <div
                                key={s.label}
                                className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-5 overflow-hidden hover:border-white/10 transition-colors"
                            >
                                <div
                                    className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-xl group-hover:opacity-30 transition-opacity`}
                                />
                                <div className="relative">
                                    <div className="text-[12px] font-semibold text-zinc-400">{s.label}</div>
                                    <div className="text-[26px] font-extrabold mt-3 tracking-tight">{s.value}</div>
                                    <div
                                        className={`text-[12px] font-bold mt-2 ${s.up === true ? "text-emerald-400" : s.up === false ? "text-rose-400" : "text-zinc-500"
                                            }`}
                                    >
                                        {s.up === true ? "▲" : s.up === false ? "▼" : "—"} {s.delta} this period
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart + Activity */}
                    <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-6">
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[14px] font-extrabold">Revenue overview</h2>
                                <div className="flex gap-1 bg-white/[0.04] p-1 rounded-lg text-[11px] font-bold">
                                    <span className="px-2.5 py-1 rounded-md text-zinc-500">Week</span>
                                    <span className="px-2.5 py-1 rounded-md bg-[#0B0D10] text-zinc-100">Month</span>
                                    <span className="px-2.5 py-1 rounded-md text-zinc-500">Year</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={190}>
                                <AreaChart data={REVENUE} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
                                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#71717a", fontSize: 11, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: "#f59e0b33" }}
                                        contentStyle={{
                                            background: "#16181c",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: 10,
                                            fontSize: 12,
                                        }}
                                        labelStyle={{ color: "#a1a1aa" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="v"
                                        stroke="#f59e0b"
                                        strokeWidth={2.5}
                                        fill="url(#revFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                            <h2 className="text-[14px] font-extrabold mb-4">Recent activity</h2>
                            <div className="flex flex-col gap-4">
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                                        <div>
                                            <div className="text-[13px] leading-snug">{a.text}</div>
                                            <div className="text-[11px] text-zinc-500 mt-0.5">{a.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}