import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const STATS = [
    { label: "Total revenue", value: "₹4,82,300", delta: "+12.4%", up: true, accent: "from-blue-500 to-indigo-600" },
    { label: "Active users", value: "2,148", delta: "+6.1%", up: true, accent: "from-pink-500 to-rose-600" },
    { label: "Pending tickets", value: "14", delta: "0.0%", up: null, accent: "from-fuchsia-500 to-blue-600" },
];

const REVENUE = [
    { day: "Mon", v: 58, prev: 40 },
    { day: "Tue", v: 92, prev: 65 },
    { day: "Wed", v: 70, prev: 72 },
    { day: "Thu", v: 130, prev: 90 },
    { day: "Fri", v: 100, prev: 85 },
    { day: "Sat", v: 150, prev: 110 },
    { day: "Sun", v: 118, prev: 95 },
];

const ACTIVITY = [
    { text: "New order #4821 placed by Rohit Sharma", time: "2 min ago", color: "bg-blue-400" },
    { text: "Payment pending for invoice #INV-1092", time: "18 min ago", color: "bg-fuchsia-400" },
    { text: "New user Priya Verma signed up", time: "1 hr ago", color: "bg-sky-400" },
    { text: "Payment failed for order #4790", time: "3 hr ago", color: "bg-pink-500" },
    { text: 'Product "Wireless Mouse" restocked', time: "5 hr ago", color: "bg-blue-400" },
];

const card = "rounded-2xl border border-white/5 bg-white/[0.03]";

export default function Dashboard() {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {STATS.map((s) => (
                    <div key={s.label} className={`group relative ${card} p-5 overflow-hidden hover:border-white/10 transition-colors`}>
                        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.accent} opacity-30 blur-xl group-hover:opacity-40 transition-opacity`} />
                        <div className="relative">
                            <div className="text-[12px] font-semibold text-slate-400">{s.label}</div>
                            <div className="text-[26px] font-extrabold mt-3 tracking-tight">{s.value}</div>
                            <div className={`text-[12px] font-bold mt-2 ${s.up === true ? "text-blue-400" : s.up === false ? "text-pink-400" : "text-slate-500"}`}>
                                {s.up === true ? "▲" : s.up === false ? "▼" : "—"} {s.delta} this period
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
                <div className={`${card} p-5`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-extrabold">Revenue overview</h2>
                        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-blue-500" />This week</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-pink-500" />Last week</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={REVENUE} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                            <Tooltip
                                cursor={{ stroke: "#ec489933" }}
                                contentStyle={{ background: "#12152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12 }}
                                labelStyle={{ color: "#94a3b8" }}
                            />
                            <Area type="monotone" dataKey="prev" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 4" fill="url(#pinkFill)" />
                            <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#blueFill)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={`${card} p-5`}>
                    <h2 className="text-[14px] font-extrabold mb-4">Recent activity</h2>
                    <div className="flex flex-col gap-4">
                        {ACTIVITY.map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                                <div>
                                    <div className="text-[13px] leading-snug">{a.text}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}