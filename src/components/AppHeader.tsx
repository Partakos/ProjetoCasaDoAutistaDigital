import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { Menu, X, LogOut, User } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardLink = roles.includes("profissional") ?
  "/profissional" :
  roles.includes("responsavel") ?
  "/responsavel" :
  "/";

  return (
    <>
    <a href="#main-content" className="skip-nav">
      Pular para o conteúdo principal
    </a>
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md" role="banner">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Casa do Autista" className="h-10 w-10 rounded-full" />
          <span className="font-display text-lg font-bold text-foreground">Casa do Autista</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link to="/crianca">
            <Button variant="ghost" size="sm">Criança</Button>
          </Link>
          <Link to="/responsavel">
            <Button variant="ghost" size="sm">Responsável</Button>
          </Link>
          <Link to="/institucional">
            <Button variant="ghost" size="sm">Institucional</Button>
          </Link>
          <Link to="/profissional">
            <Button variant="ghost" size="sm">Profissional</Button>
          </Link>
          <Link to="/base-conhecimento">
            <Button variant="ghost" size="sm">Conhecimento</Button>
          </Link>

          {!loading && user ?
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(dashboardLink)}>
                  Meu Painel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> :

          <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          }
          <AccessibilityMenu />
        </nav>

        {/* Mobile nav toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <AccessibilityMenu />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen &&
      <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link to="/crianca" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Criança</Button>
            </Link>
            <Link to="/responsavel" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Responsável</Button>
            </Link>
            <Link to="/institucional" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Institucional</Button>
            </Link>
            <Link to="/profissional" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Profissional</Button>
            </Link>
            <Link to="/base-conhecimento" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Conhecimento</Button>
            </Link>
            {!loading && user ?
          <>
                <Link to={dashboardLink} onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Meu Painel</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => {handleSignOut();setMenuOpen(false);}}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </Button>
              </> :

          <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Entrar</Button>
              </Link>
          }
          </nav>
        </div>
      }
    </header>
    </>);

}