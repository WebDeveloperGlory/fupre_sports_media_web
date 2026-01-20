"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Link from "next/link";
import { authApi } from "@/lib/api/v1/auth.api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isOTPStep, setIsOTPStep] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validateEmail(formData.email) || !validatePassword()) return;

    setIsLoading(true);
    setEmailError("");
    try {
      const response = await authApi.registerUser(formData);
      if (response.success) {
        toast.success(response.message || "OTP Sent Successfully");
        setIsOTPStep(true);
      } else {
        const errorMsg = response.message || "Signup failed";
        toast.error(errorMsg);
        setEmailError(errorMsg);
        setFormData({ ...formData, password: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      let errorMsg = "Signup failed";

      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      toast.error(errorMsg);
      setEmailError(errorMsg);

      if (error?.response?.status === 401) {
        setIsOTPStep(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    setIsLoading(true);
    try {
      const response = await authApi.verifyOTP({
        email: formData.email,
        otp: otp.join(""),
      });
      if (response.success) {
        toast.success(response.message || "Signup successful");
        router.push("/");
      } else {
        const errorMsg = response.message || "Verification failed";
        toast.error(errorMsg);
        setOtpError(errorMsg);
        setFormData({ ...formData, password: "" });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMsg = "Verification failed";

      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      } else if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      }

      toast.error(errorMsg);
      setOtpError(errorMsg);
      setOtp(["", "", "", ""]);

      const firstOtpInput = document.getElementById(`otp-0`);
      if (firstOtpInput) {
        firstOtpInput.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await authApi.requestOTP({ email: formData.email });
      if (response.success) {
        toast.success(response.message || "OTP resent successfully");
        setOtpError("");
        setOtp(["", "", "", ""]);
      } else {
        const errorMsg = response.message || "Resend Failed";
        toast.error(errorMsg);
        setOtpError(errorMsg);
      }
    } catch (error: any) {
      console.error("Resend failed:", error);
      let errorMsg = "Failed to resend OTP";

      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      toast.error(errorMsg);
      setOtpError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg w-full max-w-md border bg-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
            </div>
            <CardDescription className="text-neutral-400">
              Enter your details to sign up for FSM
            </CardDescription>
          </CardHeader>
          {!isOTPStep ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      validateEmail(e.target.value);
                    }}
                    required
                    className={`bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20 ${
                      emailError ? "border-red-500" : ""
                    }`}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 8 chars with uppercase, lowercase & number)"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setPasswordError("");
                      }}
                      required
                      className={`bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20 ${
                        passwordError ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                      setPasswordError("");
                    }}
                    required
                    className={`bg-background border-input focus:border-emerald-500 focus:ring-emerald-500/20 ${
                      passwordError ? "border-red-500" : ""
                    }`}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t border-neutral-700 py-4 px-6">
                <div className="text-center w-full">
                  <p className="text-neutral-400 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit}>
              <CardContent className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white">
                    Verify your email
                  </h3>
                  <p className="text-sm text-natural-400">
                    We've sent a 4-digit verification code to{" "}
                    <span className="text-emerald-500">{formData.email}</span>
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      className={`w-12 h-12 text-center text-lg bg-card border text-white ${
                        otpError ? "border-red-500" : ""
                      }`}
                      aria-label={`Digit ${index + 1} of verification code`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-sm text-red-500 text-center">{otpError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isLoading || otp.some((digit) => !digit)}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <div className="text-center mt-4">
                  <Button
                    variant="link"
                    className="text-neutral-400 hover:text-white p-0 h-auto"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Resend OTP
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t border-neutral-700 py-4 px-6">
                <div className="text-center w-full">
                  <p className="text-neutral-400 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-green-500 hover:text-green-400 hover:underline hover:underline-offset-4 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
