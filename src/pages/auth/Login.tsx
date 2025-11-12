import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      try {
        const sessionData = JSON.parse(userSession);
        if (sessionData.loggedIn && sessionData.token) {
          navigate("/");
        }
      } catch {
        // Invalid session
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      // Store user session with token
      localStorage.setItem("userSession", JSON.stringify({
        user: {
          email: response.email,
          firstName: response.first_name,
          lastName: response.last_name,
        },
        token: response.token,
        loggedIn: true,
      }));

      toast({
        title: t("auth.login.toastSuccessTitle"),
        description: t("auth.login.toastSuccessDescription"),
      });
      
      // Redirect to previous page or home
      const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
      navigate(redirectTo);
    } catch (error: any) {
      toast({
        title: t("auth.login.toastErrorTitle"),
        description: error.message || t("auth.login.toastErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center py-16 px-4 gradient-roman">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">{t("auth.login.title")}</CardTitle>
            <CardDescription>
              {t("auth.login.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("forms.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("placeholders.email")}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("forms.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("placeholders.password")}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-roman" disabled={loading}>
                {loading ? t("auth.login.loading") : t("auth.login.cta")}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-muted-foreground">
                {t("auth.login.noAccount")}{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  {t("auth.login.signupLink")}
                </Link>
              </p>
              <p className="text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">
                  {t("auth.login.adminLink")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}

