import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { useLang } from "../context/LangContext";
import { Home, Compass } from "lucide-react";

const content = {
  fr: {
    code: "404",
    title: "Page introuvable",
    description:
      "La page que vous recherchez a peut-être été déplacée ou n'existe pas.",
    goHome: "Retour à l'accueil",
    explore: "Découvrir nos services",
  },
  ar: {
    code: "404",
    title: "الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها ربما تم نقلها أو غير موجودة.",
    goHome: "العودة إلى الرئيسية",
    explore: "اكتشف خدماتنا",
  },
};

function NotFoundPage() {
  const { lang } = useLang();
  const t = content[lang];
  const isArabic = lang === "ar";

  return (
    <PageWrapper>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gray-soft py-16">
        {/* Background gradient */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,42,74,0.05),transparent_70%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          {/* 404 Code */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center justify-center rounded-full bg-navy/10 px-6 py-2 text-6xl font-extrabold text-navy ${
                isArabic ? "font-bold" : ""
              }`}
            >
              {t.code}
            </span>
          </div>

          {/* Title */}
          <h1
            className={`text-3xl text-navy md:text-4xl lg:text-5xl ${
              isArabic ? "font-semibold" : "font-bold"
            }`}
          >
            {t.title}
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-600 md:text-lg">
            {t.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="me-2 h-4 w-4" />
              {t.goHome}
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-lg border-2 border-navy bg-transparent px-6 py-3 text-sm font-semibold text-navy transition-all duration-200 hover:bg-navy hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="me-2 h-4 w-4" />
              {t.explore}
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default NotFoundPage;
