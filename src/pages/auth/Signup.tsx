import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNum: "",
  });
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("auth.signup.toastPasswordMismatchTitle"),
        description: t("auth.signup.toastPasswordMismatchDescription"),
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast({
        title: t("auth.signup.toastWeakPasswordTitle"),
        description: t("auth.signup.toastWeakPasswordDescription"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_num: formData.phoneNum || undefined,
        seller_account: false,
      });

      // Auto login after signup
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
      title: t("auth.signup.toastSuccessTitle"),
      description: t("auth.signup.toastSuccessDescription"),
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
      title: t("auth.signup.toastErrorTitle"),
      description: error.message || t("auth.signup.toastErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center py-16 px-4 gradient-roman">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">{t("auth.signup.title")}</CardTitle>
            <CardDescription>
              {t("auth.signup.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("forms.firstName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder={t("placeholders.name")}
                      className="pl-10"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("forms.lastName")}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder={t("placeholders.name")}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("forms.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("placeholders.email")}
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNum">{t("forms.phoneOptional")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNum"
                    name="phoneNum"
                    type="tel"
                    placeholder={t("placeholders.phone")}
                    className="pl-10"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("forms.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t("placeholders.password")}
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("forms.confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={t("placeholders.password")}
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-roman" disabled={loading}>
                {loading ? t("auth.signup.loading") : t("auth.signup.cta")}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-muted-foreground">
                {t("auth.signup.haveAccount")}{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  {t("auth.signup.signinLink")}
                </Link>
              </p>
              <p className="text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">
                  {t("auth.signup.adminLink")}
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

