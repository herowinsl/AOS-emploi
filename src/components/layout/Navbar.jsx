import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLang } from "../../context/LangContext";
import logo from "../../../public/logo.png";

const content = {
  fr: {
    brand: "AOS Emploi",
    links: [
      { to: "/", label: "Accueil" },
      { to: "/about", label: "À propos" },
      { to: "/services", label: "Services" },
      { to: "/blog", label: "Actualités" },
      { to: "/contact", label: "Contact" },
    ],
    adhherent: "Espace Adhérent",
    languageLabel: "Langue",
  },
  ar: {
    brand: "AOS التشغيل",
    links: [
      { to: "/", label: "الرئيسية" },
      { to: "/about", label: "من نحن" },
      { to: "/services", label: "الخدمات" },
      { to: "/blog", label: "الأخبار" },
      { to: "/contact", label: "اتصل بنا" },
    ],
    adhherent: "فضاء المنخرط",
    languageLabel: "اللغة",
  },
};

function Navbar() {
  const { lang, setLang } = useLang();
  const t = content[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Mobile menu scroll effect */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`sticky z-50 transition-all duration-300 ease-out ${
        scrolled && !isMobileMenuOpen
          ? "top-4 mx-auto max-w-[calc(100%-2rem)] rounded-xl bg-white/90 border border-gray-200/60 shadow-md shadow-black/5 backdrop-blur"
          : "top-0 w-full bg-white/80 border-b border-white/20 shadow-sm shadow-black/5 backdrop-blur"
      }`}
    >
      <div
        className={
          scrolled
            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        }
      >
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ease-out ${scrolled ? "min-h-12" : "min-h-16"}`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-navy transition-transform duration-300"
          >
            <img
              src={logo}
              alt={t.brand}
              className={`w-auto transition-all duration-300 ${scrolled ? "h-10" : "h-14"}`}
            />
            <span className="sr-only">{t.brand}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {t.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/espace-adherent"
              className="hidden rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-light md:inline-flex"
            >
              {t.adhherent}
            </Link>
            <div className="hidden items-center gap-2 rounded-lg border border-gray-200/70 bg-white p-1 sm:inline-flex">
              <span className="px-2 text-xs font-medium text-gray-500">
                {t.languageLabel}
              </span>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  lang === "fr"
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  lang === "ar"
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                AR
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="inline-flex rounded-lg border border-gray-200/70 p-2 text-gray-700 transition-all duration-300 hover:text-gray-900 lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              <span
                className={`block transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out lg:hidden ${
            isMobileMenuOpen
              ? "max-h-[480px] pb-4 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="grid gap-1 rounded-xl border border-gray-200/70 bg-white p-2 shadow-sm shadow-black/5">
            {t.links.map((link) => (
              <NavLink
                key={`mobile-${link.to}`}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-navy/10 text-navy"
                      : "text-gray-700 hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/espace-adherent"
              onClick={closeMobileMenu}
              className="mt-2 rounded-lg bg-navy px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-light"
            >
              {t.adhherent}
            </Link>

            <div className="mt-4 inline-flex items-center justify-between rounded-lg border border-gray-200/70 p-1.5">
              <span className="px-2 text-xs font-medium text-gray-500">
                {t.languageLabel}
              </span>
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLang("fr")}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                    lang === "fr"
                      ? "bg-navy text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setLang("ar")}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                    lang === "ar"
                      ? "bg-navy text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  AR
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
