import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem("adminSession");
      if (!session) {
        navigate("/auth");
        return;
      }
      
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.loggedIn && sessionData.token && sessionData.user) {
          setUser(sessionData.user);
        } else {
          navigate("/auth");
        }
      } catch (error) {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast({
      title: t("auth.loggedOut"),
      description: t("auth.loggedOutDesc"),
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t("adminPanel.layout.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-card">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-display font-bold text-primary">{t("adminPanel.layout.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <AdminSidebar />
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="p-6 border-b">
                  <h1 className="text-2xl font-display font-bold text-primary">{t("adminPanel.layout.title")}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <h2 className="text-xl font-semibold hidden lg:block">{t("adminPanel.layout.header")}</h2>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            {t("adminPanel.layout.logout")}
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
