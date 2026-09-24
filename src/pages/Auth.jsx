import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  registerUser,
  loginUser,
} from "../lib/auth";

export default function Auth({ onLoginSuccess }) {
  const { t } = useTranslation();
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
        alert(t("auth.alert_enter_email"));
        return;
      }

      if (mode === "signup") {
        if (!trimmedName) {
          alert(t("auth.alert_enter_name"));
          return;
        }

        if (!password) {
          alert(t("auth.alert_enter_password"));
          return;
        }

        if (password.length < 6) {
          alert(t("auth.alert_password_length"));
          return;
        }

        if (password.trim() !== confirmPassword.trim()) {
          alert(t("auth.alert_passwords_no_match"));
          return;
        }

        const user = await registerUser(trimmedEmail, password, trimmedName);
        alert(t("auth.alert_created"));
        resetFormState();

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else if (mode === "login") {
        if (!password) {
          alert(t("auth.alert_enter_password"));
          return;
        }

        const user = await loginUser(trimmedEmail, password);
        alert(t("auth.alert_signed_in"));
        resetFormState();

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else if (mode === "reset") {
      
        alert(t("auth.alert_reset_not_connected"));
        setMode("login");
      }
    } catch (error) {
      console.error(error);

      if (error?.code === "auth/invalid-credential") {
        alert(t("auth.alert_invalid_credentials"));
      } else if (error?.code === "auth/email-already-in-use") {
        alert(t("auth.alert_email_in_use"));
      } else if (error?.code === "auth/user-not-found") {
        alert(t("auth.alert_user_not_found"));
      } else if (error?.code === "auth/invalid-email") {
        alert(t("auth.alert_invalid_email"));
      } else {
        alert(error?.message || t("auth.alert_generic_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              {mode === "login" && t("sign_in")}
              {mode === "signup" && t("auth.create_account")}
              {mode === "reset" && t("auth.reset_password")}
            </CardTitle>

            <p className="text-sm text-gray-500">
              {mode === "login" && t("auth.welcome_back")}
              {mode === "signup" && t("auth.create_your_account")}
              {mode === "reset" && t("auth.reset_instructions")}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {t("auth.name")}
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <User className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("auth.your_name")}
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
                  {t("auth.email")}
                </label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder={t("auth.enter_email")}
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
                    {t("auth.password")}
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t("auth.enter_password")}
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
                    {t("auth.confirm_password")}
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t("auth.confirm_password_placeholder")}
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
                    {t("auth.forgot_password")}
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl py-6"
                disabled={loading}
              >
                {loading ? (
                  t("auth.please_wait")
                ) : (
                  <>
                    {mode === "login" && t("sign_in")}
                    {mode === "signup" && t("auth.create_account")}
                    {mode === "reset" && t("auth.send_reset_email")}
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
                  {t("auth.back_to_sign_in")}
                </button>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {mode === "login"
                    ? t("auth.no_account")
                    : t("auth.have_account")}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    {mode === "login" ? t("auth.sign_up_free") : t("auth.sign_in_short")}
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
