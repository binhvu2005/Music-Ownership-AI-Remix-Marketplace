"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";

type Role = "creator" | "remixer" | "consumer";

export default function RegisterPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("consumer"); // Default to consumer/fan
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      setError(
        language === "en" 
          ? "Please fill in all fields" 
          : "Vui lòng điền đầy đủ các thông tin"
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        language === "en"
          ? "You must agree to the Terms of Service"
          : "Bạn phải đồng ý với Điều khoản Dịch vụ"
      );
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          displayName,
          role,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          language === "en"
            ? "Account created successfully! Redirecting to login..."
            : "Đăng ký tài khoản thành công! Đang chuyển hướng đăng nhập..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        if (data?.message) {
          const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
          setError(errorMsg);
        } else {
          setError(
            language === "en"
              ? "Registration failed. Please try again."
              : "Đăng ký không thành công. Vui lòng thử lại."
          );
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-lg bg-glass-bg border border-glass-border rounded-3xl p-8 shadow-2xl backdrop-blur-lg relative z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold text-primary mb-4 tracking-wider">
            🎵 StemVerse
          </Link>
          <h2 className="text-3xl font-extrabold text-text-primary mb-2">
            {t("auth.signup.title")}
          </h2>
          <p className="text-sm text-text-secondary">
            {t("auth.signup.subtitle")}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-bg/15 border border-error/20 text-error text-sm font-semibold flex items-center gap-3">
            <span>⚠️</span>
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-secondary/15 border border-secondary/20 text-secondary text-sm font-semibold flex items-center gap-3">
            <span>✅</span>
            <p className="flex-1">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {language === "en" ? "Full Name" : "Họ và tên"}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-background/50 focus:outline-none focus:border-primary/50 text-text-primary text-sm transition-all duration-200 placeholder-text-muted"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-background/50 focus:outline-none focus:border-primary/50 text-text-primary text-sm transition-all duration-200 placeholder-text-muted"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {language === "en" ? "Password (min 8 chars)" : "Mật khẩu (tối thiểu 8 ký tự)"}
            </label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-background/50 focus:outline-none focus:border-primary/50 text-text-primary text-sm transition-all duration-200 placeholder-text-muted"
            />
          </div>

          {/* Role Selection Cards */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              {t("auth.signup.role_section")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Creator Card */}
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  role === "creator"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-glass-border bg-background/50 hover:bg-glass-border/30"
                }`}
              >
                <span className="text-xl mb-2 block">🎹</span>
                <p className="text-sm font-bold text-text-primary mb-1">
                  {t("auth.signup.role_creator")}
                </p>
                <p className="text-xs text-text-muted leading-snug">
                  {t("auth.signup.role_creator_desc")}
                </p>
              </button>

              {/* Remixer Card */}
              <button
                type="button"
                onClick={() => setRole("remixer")}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  role === "remixer"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-glass-border bg-background/50 hover:bg-glass-border/30"
                }`}
              >
                <span className="text-xl mb-2 block">🤖</span>
                <p className="text-sm font-bold text-text-primary mb-1">
                  {t("auth.signup.role_remixer")}
                </p>
                <p className="text-xs text-text-muted leading-snug">
                  {t("auth.signup.role_remixer_desc")}
                </p>
              </button>

              {/* Fan Card */}
              <button
                type="button"
                onClick={() => setRole("consumer")}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  role === "consumer"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-glass-border bg-background/50 hover:bg-glass-border/30"
                }`}
              >
                <span className="text-xl mb-2 block">🎧</span>
                <p className="text-sm font-bold text-text-primary mb-1">
                  {t("auth.signup.role_fan").split(" (")[0]}
                </p>
                <p className="text-xs text-text-muted leading-snug">
                  {t("auth.signup.role_fan_desc") || "For listening & buying music rights"}
                </p>
              </button>

            </div>
          </div>

          {/* Agree Terms Checkbox */}
          <div className="flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-glass-border text-primary focus:ring-primary/30"
            />
            <label htmlFor="agreeTerms" className="text-xs text-text-secondary select-none cursor-pointer leading-relaxed">
              {t("auth.signup.agree_terms")}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white dark:text-background font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 text-sm mt-4"
          >
            {loading ? t("common.loading") : t("auth.signup.submit_btn")}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            {t("auth.signup.login_link")}
          </Link>
        </p>

      </div>
    </div>
  );
}
