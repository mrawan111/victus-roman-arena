import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.loggedIn && sessionData.token) {
          navigate("/admin");
        }
      } catch {
        // Invalid session
      }
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login({ email, password });

        // Store session with token
        localStorage.setItem("adminSession", JSON.stringify({
          user: {
            email: response.email,
            sellerAccount: response.seller_account,
          },
          token: response.token,
          loggedIn: true,
        }));

        toast({
          title: t("auth.admin.toastLoginSuccessTitle"),
          description: t("auth.admin.toastLoginSuccessDescription"),
        });
        navigate("/admin");
      } else {
        const nameParts = firstName.trim().split(" ");
        const response = await authAPI.register({
          email,
          password,
          first_name: nameParts[0] || firstName,
          last_name: nameParts.slice(1).join(" ") || lastName,
          phone_num: phoneNum || undefined,
          seller_account: false,
        });

        // Auto login after signup
        localStorage.setItem("adminSession", JSON.stringify({
          user: {
            email: response.email,
            sellerId: response.seller_id,
          },
          token: response.token,
          loggedIn: true,
        }));

        toast({
          title: t("auth.admin.toastSignupSuccessTitle"),
          description: t("auth.admin.toastSignupSuccessDescription"),
        });
        
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: t("auth.admin.toastErrorTitle"),
        description: error.message || t("auth.admin.toastErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-roman flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">{t("auth.admin.title")}</CardTitle>
          <CardDescription>
            {isLogin ? t("auth.admin.loginDescription") : t("auth.admin.signupDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("forms.firstName")}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t("placeholders.name")}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("forms.lastName")}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t("placeholders.name")}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNum">{t("forms.phoneOptional")}</Label>
                  <Input
                    id="phoneNum"
                    type="tel"
                    placeholder={t("placeholders.phone")}
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                  />
                </div>
              </>
            )}
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
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? t("auth.admin.processing")
                : isLogin
                ? t("auth.admin.loginCta")
                : t("auth.admin.signupCta")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? t("auth.admin.toggleToSignup") : t("auth.admin.toggleToLogin")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
