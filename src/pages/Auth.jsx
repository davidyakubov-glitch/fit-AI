import { useState } from "react";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  registerUser,
  loginUser,
} from "../lib/auth";

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFormState = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    try {
      setLoading(true);

      if (!trimmedEmail) {
        alert("Enter email");
        return;
      }

      if (mode === "signup") {
        if (!trimmedName) {
          alert("Enter your name");
          return;
        }

        if (!password) {
          alert("Enter password");
          return;
        }

        if (password.length < 6) {
          alert("Password must be at least 6 characters");
          return;
        }

        if (password.trim() !== confirmPassword.trim()) {
          alert("Passwords do not match");
          return;
        }

        const user = await registerUser(trimmedEmail, password, trimmedName);
        alert("Account created successfully");
        resetFormState();

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else if (mode === "login") {
        if (!password) {
          alert("Enter password");
          return;
        }

        const user = await loginUser(trimmedEmail, password);
        alert("Signed in successfully");
        resetFormState();

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else if (mode === "reset") {
      
        alert("Password reset is not connected yet");
        setMode("login");
      }
    } catch (error) {
      console.error(error);

      if (error?.code === "auth/invalid-credential") {
        alert("Invalid email or password");
      } else if (error?.code === "auth/email-already-in-use") {
        alert("This email is already in use");
      } else if (error?.code === "auth/user-not-found") {
        alert("User not found");
      } else if (error?.code === "auth/invalid-email") {
        alert("Invalid email address");
      } else {
        alert(error?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "reset" && "Reset Password"}
            </CardTitle>

            <p className="text-sm text-gray-500">
              {mode === "login" && "Welcome back"}
              {mode === "signup" && "Create your FitAI account"}
              {mode === "reset" && "We will send reset instructions"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Name
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <User className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full outline-none bg-transparent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full outline-none bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {mode !== "reset" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Password
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full outline-none bg-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full outline-none bg-transparent"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl py-6"
                disabled={loading}
              >
                {loading ? (
                  "Please wait..."
                ) : (
                  <>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Create Account"}
                    {mode === "reset" && "Send Reset Email"}
                  </>
                )}
              </Button>

              {mode === "reset" ? (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </button>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    {mode === "login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}