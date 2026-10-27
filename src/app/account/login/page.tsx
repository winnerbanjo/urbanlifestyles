"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/context/AuthContext";
import { Mail, KeyRound, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, token } = useAuth();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (token) {
    router.replace("/account");
    return null;
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendOtp(email.trim());
      setStep("OTP");
      setInfoMessage(`A single-use verification code has been dispatched to ${email}. Check your inbox.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed sending login code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(email.trim(), otp.trim());
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification code incorrect or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-16 flex flex-col justify-center">
        <div className="bg-white border border-[#E9E7E3] p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-editorial text-3xl text-[#171717]">
              Customer Account
            </h1>
            <p className="text-[12px] text-[#777777] font-light">
              Passwordless, secure one-time passcode verification powered by Nile.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-[12px]">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-[#EBF2EC] border border-[#BDD2BF] text-[#37533E] text-[12px]">
              {infoMessage}
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full border border-[#E9E7E3] pl-10 pr-3 py-2.5 text-[13px] focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[12px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#37533E]" />
                ) : (
                  <>
                    <span>Send Login Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#777777] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full border border-[#E9E7E3] pl-10 pr-3 py-2.5 text-center tracking-[0.3em] font-mono text-base focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <p className="text-[11px] text-[#777777] mt-1.5">
                  Demo hint: If running offline/dev, enter <strong>123456</strong>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[12px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#37533E]" />
                ) : (
                  <span>Verify Code & Sign In</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-center text-[11px] uppercase tracking-wider text-[#777777] hover:text-[#171717] pt-2"
              >
                Use a different email address
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
