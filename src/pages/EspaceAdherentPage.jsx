import PageWrapper from "../components/layout/PageWrapper";
import { useLang } from "../context/LangContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, FileText, Bell, HelpCircle, LogOut, Settings } from "lucide-react";
import { useEffect } from "react";

const content = {
  fr: {
    title: "Espace Adhérent",
    subtitle: "Accédez à votre profil et gérez vos services",
    loginPrompt: "Veuillez vous connecter pour accéder à votre espace adhérent",
    loginButton: "Se connecter",
    signupButton: "S'inscrire",
    features: [
      {
        icon: "user",
        title: "Profil et Adhésion",
        description: "Consultez votre profil et gérez votre adhésion à la association",
      },
      {
        icon: "document",
        title: "Documents",
        description: "Téléchargez vos formulaires et documents importants",
      },
      {
        icon: "bell",
        title: "Notifications",
        description: "Recevez les dernières actualités et annonces",
      },
      {
        icon: "help",
        title: "Support",
        description: "Contactez notre équipe pour toute assistance",
      },
      {
        icon: "settings",
        title: "Paramètres",
        description: "Gérez vos préférences et informations personnelles",
      },
      {
        icon: "logout",
        title: "Services",
        description: "Accédez à tous les services disponibles pour les adhérents",
      },
    ],
  },
  ar: {
    title: "فضاء المنخرط",
    subtitle: "الوصول إلى ملفك الشخصي وإدارة خدماتك",
    loginPrompt: "يرجى تسجيل الدخول للوصول إلى فضاء المنخرط الخاص بك",
    loginButton: "تسجيل الدخول",
    signupButton: "التسجيل",
    features: [
      {
        icon: "user",
        title: "الملف الشخصي والعضوية",
        description: "استعرض ملفك الشخصي وأدر عضويتك في الجمعية",
      },
      {
        icon: "document",
        title: "الوثائق",
        description: "قم بتحميل نماذجك والمستندات المهمة",
      },
      {
        icon: "bell",
        title: "الإشعارات",
        description: "استقبل آخر الأخبار والإعلانات",
      },
      {
        icon: "help",
        title: "الدعم",
        description: "اتصل بفريقنا للحصول على أي مساعدة",
      },
      {
        icon: "settings",
        title: "الإعدادات",
        description: "إدارة تفضيلاتك ومعلوماتك الشخصية",
      },
      {
        icon: "logout",
        title: "الخدمات",
        description: "الوصول إلى جميع الخدمات المتاحة للمنخرطين",
      },
    ],
  },
};

const getIcon = (iconName) => {
  const iconMap = {
    user: User,
    document: FileText,
    bell: Bell,
    help: HelpCircle,
    settings: Settings,
    logout: LogOut,
  };
  return iconMap[iconName];
};

function EspaceAdherentPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout } = useAuth();
  const t = content[lang];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <PageWrapper>
      {/* Header Section */}
      <section className="bg-gray-soft py-16">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className={`text-4xl text-navy md:text-5xl ${lang === "ar" ? "font-semibold" : "font-bold"}`}>
            {t.title}
          </h1>
          <p className="mt-4 text-base text-gray-600">{t.subtitle}</p>
        </div>
      </section>

      {/* Login Prompt Section */}
      {!loading && !isAuthenticated && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-8 md:p-12 text-center">
              <User className="mx-auto h-12 w-12 text-navy mb-4" />
              <h2 className={`text-2xl text-navy mb-4 ${lang === "ar" ? "font-semibold" : "font-bold"}`}>
                {t.loginPrompt}
              </h2>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/signin')}
                  className="bg-brand-orange text-white px-5 py-3 rounded-lg font-semibold transition-colors duration-150 hover:bg-navy-light"
                >
                  {t.loginButton}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="border border-white/30 bg-[#2d4270] text-white px-5 py-3 rounded-lg font-semibold transition-colors duration-150 hover:bg-[#f26522]"
                >
                  {t.signupButton}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Authenticated User Section */}
      {!loading && isAuthenticated && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 rounded-lg border border-green-200 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl text-green-900 mb-2 ${lang === "ar" ? "font-semibold" : "font-bold"}`}>
                    {lang === 'fr' ? `Bienvenue, ${user?.email}` : `أهلا وسهلا، ${user?.email}`}
                  </h2>
                  <p className="text-green-800">
                    {lang === 'fr' ? 'Vous êtes connecté à votre espace adhérent' : 'أنت متصل بفضاء المنخرط الخاص بك'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg font-semibold transition-colors duration-150 hover:bg-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  {lang === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-gray-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature, index) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <IconComponent className="h-8 w-8 text-navy mb-4" />
                  <h3 className={`text-lg text-navy mb-2 ${lang === "ar" ? "font-semibold" : "font-bold"}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default EspaceAdherentPage;
