import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    Search,
    CheckCircle2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Inbox,
    X,
    Phone,
    Mail,
    MessageCircle,
    ExternalLink,
    MapPin,
    Clock,
    Globe,
    Building2,
} from "lucide-react";
import { getEnquiry, deleteEnquiry, markEnquiry } from "../../api/enquiry.api";

const PAGE_SIZE = 8;
const FILTERS = ["all", "pending", "complete"];
const SEARCH_FIELDS = ["name", "org", "phone", "email", "role", "projectType", "city", "state", "message"];

const isYes = (v) => v === true || ["yes", "true"].includes(String(v).toLowerCase());
const isComplete = (en) => en.status === "complete";
const digits = (p) => String(p ?? "").replace(/\D/g, "");

const formatDate = (d, withTime = false) =>
    d
        ? new Date(d).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            ...(withTime && { hour: "2-digit", minute: "2-digit" }),
        })
        : "—";

const StatusPill = ({ status }) => {
    const isComplete = status === "complete";

    return (
        <span
            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${isComplete
                ? "bg-blue-500/15 text-blue-300"
                : "bg-pink-500/15 text-pink-300"
                }`}
        >
            {status === "complete" ? "Complete" : "Pending"}
        </span>
    );
};

const Avatar = ({ name, size = "w-8 h-8 text-[11px]" }) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center font-bold shrink-0`}>
        {(name || "?").slice(0, 2).toUpperCase()}
    </div>
);

const Field = ({ icon: Icon, label, children }) => (
    <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
            {Icon && <Icon size={12} />}
            {label}
        </div>
        <div className="text-[13px] text-slate-100 break-words">{children || "—"}</div>
    </div>
);

const Enquiry = () => {
    const [enquiry, setEnquiry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [busyId, setBusyId] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const loadEnquiries = async () => {
            try {
                const data = await getEnquiry();
                setEnquiry(data.enquiry);
            } catch (err) {
                console.error("Failed to load enquiries", err);
            } finally {
                setLoading(false);
            }
        };
        loadEnquiries();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [query, filter]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== "Escape") return;
            if (toDelete) setToDelete(null);
            else setSelectedId(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toDelete]);

    const counts = useMemo(() => {
        const complete = enquiry.filter(
            (en) => en.status === "complete"
        ).length;

        const pending = enquiry.filter(
            (en) => en.status === "pending"
        ).length;

        return {
            all: enquiry.length,
            pending,
            complete
        };
    }, [enquiry]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return enquiry.filter((en) => {

            if (filter === "complete" && en.status !== "complete") {
                return false;
            }

            if (filter === "pending" && en.status !== "pending") {
                return false;
            }

            if (!q) return true;

            return SEARCH_FIELDS.some((f) =>
                String(en[f] ?? "")
                    .toLowerCase()
                    .includes(q)
            );
        });

    }, [enquiry, query, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const rows = filtered.slice(start, start + PAGE_SIZE);
    const selected = enquiry.find((en) => en._id === selectedId);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const handleSolved = async (id) => {
        setBusyId(id);

        try {
            const data = await markEnquiry(id);

            setEnquiry((list) =>
                list.map((en) =>
                    en._id === id ? { ...en, status: "complete" } : en
                )
            );

            toast.success(data?.message || "Enquiry marked as complete");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update enquiry");
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async () => {
        const id = toDelete._id;

        setBusyId(id);

        try {
            const data = await deleteEnquiry(id);

            setEnquiry((list) =>
                list.filter((en) => en._id !== id)
            );

            if (selectedId === id) {
                setSelectedId(null);
            }

            setToDelete(null);

            toast.success(
                data.message || "Enquiry deleted successfully"
            );

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to delete enquiry"
            );

        } finally {
            setBusyId(null);
        }
    };

    const stop = (e) => e.stopPropagation();

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl text-[12px] font-bold w-fit">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3.5 py-1.5 rounded-lg capitalize transition-colors ${filter === f
                                ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                                : "text-slate-400 hover:text-slate-100"
                                }`}
                        >
                            {f} <span className="opacity-70">{counts[f]}</span>
                        </button>
                    ))}
                </div>

                <div className="md:ml-auto flex items-center gap-2 bg-white/[0.04] border border-white/5 rounded-xl px-3.5 py-2.5 w-full md:w-80 text-slate-500 text-[13px] focus-within:border-blue-500/50">
                    <Search size={15} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, company, city, project…"
                        className="bg-transparent outline-none w-full text-slate-100 placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] min-w-[900px]">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-[12px]">
                                <th className="px-5 py-3.5 font-semibold">Contact person</th>
                                <th className="px-5 py-3.5 font-semibold">Phone / Email</th>
                                <th className="px-5 py-3.5 font-semibold">Project</th>
                                <th className="px-5 py-3.5 font-semibold">Location</th>
                                <th className="px-5 py-3.5 font-semibold">Received</th>
                                <th className="px-5 py-3.5 font-semibold">Status</th>
                                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center text-slate-500">
                                        Loading enquiries…
                                    </td>
                                </tr>
                            )}

                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center text-slate-500">
                                        <Inbox size={26} className="mx-auto mb-2 opacity-60" />
                                        {enquiry.length === 0 ? "No enquiries yet." : "No enquiries match your search."}
                                    </td>
                                </tr>
                            )}

                            {rows.map((en) => {
                                const complete = en.status === "complete";
                                const busy = busyId === en._id;
                                return (
                                    <tr
                                        key={en._id}
                                        onClick={() => setSelectedId(en._id)}
                                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.04] cursor-pointer transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={en.name} />
                                                <div className="min-w-0">
                                                    <div className="font-semibold capitalize truncate">{en.name}</div>
                                                    <div className="text-[11.5px] text-slate-500 truncate">
                                                        {[en.org, en.role].filter(Boolean).join(" · ") || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-slate-200">{en.phone}</div>
                                            <div className="text-[11.5px] text-slate-500 max-w-[190px] truncate">{en.email}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-slate-200 max-w-[180px] truncate">{en.projectType || "—"}</div>
                                            <div className="text-[11.5px] text-slate-500">
                                                Website: {isYes(en.hasWebsite) ? "Yes" : "No"}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-300 capitalize">
                                            {[en.city, en.state].filter(Boolean).join(", ") || "—"}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{formatDate(en.createdAt)}</td>
                                        <td className="px-5 py-3.5">
                                            <StatusPill status={en.status} />
                                        </td>
                                        <td className="px-5 py-3.5" onClick={stop}>
                                            <div className="flex items-center justify-end gap-2">
                                                {!complete && (
                                                    <button
                                                        disabled={busy}
                                                        onClick={() => handleSolved(en._id)}
                                                        title="Mark complete"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        Mark complete
                                                    </button>
                                                )}
                                                <button
                                                    disabled={busy}
                                                    onClick={() => setToDelete(en)}
                                                    aria-label={`Delete enquiry from ${en.name}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 disabled:opacity-50 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-white/5 text-[12px] text-slate-400">
                    <span>
                        {filtered.length === 0
                            ? "0 results"
                            : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 font-semibold hover:bg-white/[0.08] disabled:opacity-40 disabled:hover:bg-white/[0.04] transition-colors"
                        >
                            <ChevronLeft size={14} /> Previous
                        </button>
                        <span className="px-2 font-semibold text-slate-300">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 font-semibold hover:bg-white/[0.08] disabled:opacity-40 disabled:hover:bg-white/[0.04] transition-colors"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSelectedId(null)}>
                    <aside
                        onClick={stop}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0E1128] border-l border-white/10 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-start gap-3 p-6 border-b border-white/5">
                            <Avatar name={selected.name} size="w-12 h-12 text-[14px]" />
                            <div className="min-w-0 flex-1">
                                <h2 className="text-[17px] font-extrabold capitalize truncate">{selected.name}</h2>
                                <p className="text-[12px] text-slate-400 mt-0.5 truncate">
                                    {[selected.role, selected.org].filter(Boolean).join(" at ") || "—"}
                                </p>
                                <div className="mt-2">
                                    <StatusPill status={selected.status} />
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedId(null)}
                                aria-label="Close details"
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            <div className="flex gap-2">
                                <a
                                    href={`tel:${selected.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 transition-colors"
                                >
                                    <Phone size={14} /> Call
                                </a>
                                <a
                                    href={`https://wa.me/${digits(selected.phone)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold bg-pink-500/15 text-pink-300 hover:bg-pink-500/25 transition-colors"
                                >
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] transition-colors"
                                >
                                    <Mail size={14} /> Email
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                                <Field icon={Phone} label="Phone">{selected.phone}</Field>
                                <Field icon={Mail} label="Email">{selected.email}</Field>
                                <Field icon={Building2} label="Organisation">{selected.org}</Field>
                                <Field icon={MapPin} label="Location">
                                    <span className="capitalize">
                                        {[selected.city, selected.state].filter(Boolean).join(", ")}
                                    </span>
                                </Field>
                                <Field label="Project type">{selected.projectType}</Field>
                                <Field icon={Clock} label="Preferred call time">{selected.callTime}</Field>
                                <Field icon={Globe} label="Has website">{isYes(selected.hasWebsite) ? "Yes" : "No"}</Field>
                                <Field label="Found us via">{selected.source}</Field>
                            </div>

                            {selected.websiteLink && (
                                <Field label="Website link">
                                    <a
                                        href={selected.websiteLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-blue-300 hover:text-blue-200 break-all"
                                    >
                                        {selected.websiteLink}
                                        <ExternalLink size={12} className="shrink-0" />
                                    </a>
                                </Field>
                            )}

                            <div>
                                <div className="text-[11px] font-semibold text-slate-500 mb-2">Message</div>
                                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                    {selected.message || "No message provided."}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <Field label="Received">{formatDate(selected.createdAt, true)}</Field>
                                <Field label="Last updated">{formatDate(selected.updatedAt, true)}</Field>
                            </div>
                        </div>

                        <div className="flex gap-2 p-4 border-t border-white/5">
                            {selected.status !== "complete" && (
                                <button
                                    disabled={busyId === selected._id}
                                    onClick={() => handleSolved(selected._id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-blue-500 to-pink-500 text-white disabled:opacity-60"
                                >
                                    <CheckCircle2 size={15} /> Mark as solved
                                </button>
                            )}
                            <button
                                onClick={() => setToDelete(selected)}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[13px] font-semibold text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 transition-colors ${selected.status === "complete" ? "flex-1" : ""
                                    }`}
                            >
                                <Trash2 size={15} /> Delete
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {toDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setToDelete(null)}
                >
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E1128] p-6" onClick={stop}>
                        <h3 className="text-[16px] font-extrabold">Delete this enquiry?</h3>
                        <p className="text-[13px] text-slate-400 mt-2">
                            The enquiry from <span className="text-slate-100 font-semibold capitalize">{toDelete.name}</span> will be
                            removed permanently.
                        </p>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setToDelete(null)}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-white/[0.05] hover:bg-white/[0.09] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={busyId === toDelete._id}
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-pink-500 to-rose-600 text-white disabled:opacity-60"
                            >
                                Delete enquiry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Enquiry;