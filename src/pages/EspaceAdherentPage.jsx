import React, { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { useLang } from "../context/LangContext";
import useAuth from "../hooks/useAuth";
import DashboardSidebar from "../components/espace-adherent/DashboardSidebar";
import OverviewSection from "../components/espace-adherent/OverviewSection";
import ProfileSection from "../components/espace-adherent/ProfileSection";
import DocumentsSection from "../components/espace-adherent/DocumentsSection";
import DemandesSection from "../components/espace-adherent/DemandesSection";
import { InteractiveMenu } from "../components/ui/modern-mobile-menu";
import { Bell, ClipboardList, LayoutDashboard, User, FileText } from "lucide-react";

const mobileMenuContent = {
  fr: [
    { id: 'overview', label: 'Tableau', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'demandes', label: 'Demandes', icon: ClipboardList },
  ],
  ar: [
    { id: 'overview', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'profile', label: 'ملفي', icon: User },
    { id: 'documents', label: 'وثائقي', icon: FileText },
    { id: 'demandes', label: 'الطلبات', icon: ClipboardList },
  ]
};

function EspaceAdherentPage() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "profile":
        return <ProfileSection />;
      case "documents":
        return <DocumentsSection />;
      case "demandes":
        return <DemandesSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <PageWrapper>
      {/* Institutional Navy Header - Matches the pattern of other subpages */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 md:pt-44 md:pb-24 text-white">
        {/* Abstract background elements */}
        <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute -end-24 -bottom-24 h-96 w-96 rounded-full bg-navy-light/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-4">
              {isArabic ? "فضاء المنخرط" : "ESPACE ADHÉRENT"}
            </p>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl ${isArabic ? "font-bold" : "font-extrabold"}`}>
              {isArabic ? "مرحباً،" : "Bienvenue,"} {user?.nom}
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              {isArabic 
                ? "أدِر عضويتك، اطلع على وثائقك وتابع آخر مستجدات الجمعية."
                : "Gérez votre adhésion, consultez vos documents et suivez les actualités de l'association."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content Area */}
      <section className="bg-white pb-24 lg:pb-16 -mt-8 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28 rounded-2xl overflow-hidden shadow-2xl shadow-navy/5 border border-gray-100 bg-white">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-navy flex items-center justify-center text-white">
                         <User size={20} />
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-xs text-gray-500 font-medium truncate uppercase tracking-wider">{user?.email}</p>
                         <p className="text-sm font-bold text-navy truncate">{user?.nom}</p>
                      </div>
                   </div>
                </div>
                <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1">
              <div className="rounded-2xl bg-white p-6 md:p-8 shadow-2xl shadow-navy/5 border border-gray-100 min-h-[600px]">
                {renderContent()}
              </div>
            </main>

          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <InteractiveMenu 
          items={mobileMenuContent[lang]} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          accentColor="#F26522"
        />
      </div>
    </PageWrapper>
  );
}

export default EspaceAdherentPage;
