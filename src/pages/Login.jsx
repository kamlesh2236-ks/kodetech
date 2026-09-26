import { useLayoutEffect, useRef, useState } from "react";
import {
    IconMail,
    IconLock,
    IconEye,
    IconEyeOff,
    IconBrandGoogleFilled,
    IconBrandGithubFilled,
    IconArrowRight,
} from "@tabler/icons-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import "./Login.css";

const Login = () => {
    const pageRef = useRef(null);
    const cardRef = useRef(null);
    const buttonRef = useRef(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // ---------- Entrance animation ----------
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                ".login-brand > *",
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
            )
                .fromTo(
                    cardRef.current,
                    { autoAlpha: 0, y: 30, scale: 0.96 },
                    { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
                    0.15,
                )
                .fromTo(
                    ".login-field, .login-row, .login-submit, .login-divider, .login-socials, .login-footer",
                    { autoAlpha: 0, y: 16, filter: "blur(4px)" },
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.5,
                        stagger: 0.06,
                    },
                    0.4,
                );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // ---------- Magnetic submit button ----------
    useLayoutEffect(() => {
        const btn = buttonRef.current;
        if (!btn) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) return;

        const moveX = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const moveY = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

        const handleMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const px = e.clientX - (rect.left + rect.width / 2);
            const py = e.clientY - (rect.top + rect.height / 2);
            moveX(px * 0.25);
            moveY(py * 0.35);
        };

        const reset = () => {
            moveX(0);
            moveY(0);
        };

        btn.addEventListener("mousemove", handleMove);
        btn.addEventListener("mouseleave", reset);
        return () => {
            btn.removeEventListener("mousemove", handleMove);
            btn.removeEventListener("mouseleave", reset);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in both fields to continue.");
            gsap.fromTo(
                cardRef.current,
                { x: -8 },
                { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" },
            );
            return;
        }

        try {
            setLoading(true);
            const data = await loginUser({
                email, password
            });

            // console.log("Login response", data);
            navigate("/admin/dashboard");
        } catch (err) {
            console.log("Login Error", err);
            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" ref={pageRef}>
            <div className="login-aurora" aria-hidden="true" />

            <div className="login-shell">
                {/* ========================= BRAND PANEL ========================== */}
                <div className="login-brand">
                    <span className="login-logo">
                        <span className="login-logo-dot" />
                        KodeTech
                    </span>

                    <h1>
                        Welcome back.
                        <br />
                        Let&apos;s build something great.
                    </h1>

                    <p>
                        Sign in to pick up right where you left off — projects, clients and
                        everything in between, all in one place.
                    </p>

                    <div className="login-orb-field" aria-hidden="true">
                        <span className="login-orb o1" />
                        <span className="login-orb o2" />
                        <span className="login-orb o3" />
                    </div>
                </div>

                {/* ========================= LOGIN CARD ========================== */}
                <div className="login-card" ref={cardRef}>
                    <div className="login-card-head">
                        <h2>Sign in</h2>
                        <p>Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="login-field">
                            <IconMail size={18} className="login-field-icon" />
                            <input
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            <label>Email address</label>
                        </div>

                        <div className="login-field">
                            <IconLock size={18} className="login-field-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <label>Password</label>
                            <button
                                type="button"
                                className="login-field-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <IconEyeOff size={18} />
                                ) : (
                                    <IconEye size={18} />
                                )}
                            </button>
                        </div>

                        {error && <p className="login-error">{error}</p>}

                        <div className="login-row">
                            <label className="login-remember">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span className="login-checkbox" />
                                Remember me
                            </label>

                            <a href="#forgot" className="login-forgot">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`login-submit${loading ? " is-loading" : ""}`}
                            ref={buttonRef}
                            disabled={loading}
                        >
                            <span>{loading ? "Signing in..." : "Sign in"}</span>
                            {!loading && <IconArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span />
                        or continue with
                        <span />
                    </div>

                    <div className="login-socials">
                        <button type="button" className="login-social">
                            <IconBrandGoogleFilled size={18} />
                            Google
                        </button>
                        <button type="button" className="login-social">
                            <IconBrandGithubFilled size={18} />
                            GitHub
                        </button>
                    </div>

                    <p className="login-footer">
                        Don&apos;t have an account? <a href="#signup">Create one</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
