import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { useLang } from "../context/LangContext";
import { servicesDetails } from "../data/servicesDetails";
import { cn } from "../lib/utils";

function ServiceDetailPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const service = servicesDetails[slug];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const content = service[lang];
  const isArabic = lang === "ar";
  const Icon = Icons[service.icon] || Icons.Circle;

  const labels = {
    fr: { back: "Retour aux services", contact: "Plus d'informations ?", cta: "Nous contacter" },
    ar: { back: "العودة إلى الخدمات", contact: "لمزيد من المعلومات ؟", cta: "اتصل بنا" },
  };
  const t = labels[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <PageWrapper>
      <div className="bg-gray-50/50 min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/services"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-navy transition-colors mb-8 group"
          >
            <Icons.ChevronLeft className={cn("w-4 h-4 transition-transform group-hover:-translate-x-1", isArabic && "rotate-180 group-hover:translate-x-1")} />
            <span className="ms-1">{t.back}</span>
          </Link>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy/5 overflow-hidden border border-gray-100"
          >
            {/* Header Section */}
            <div className="relative p-8 md:p-12 pb-0 md:pb-0">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className={cn("text-3xl md:text-5xl text-navy mb-3", isArabic ? "font-semibold" : "font-bold tracking-tight")}>
                    {content.title}
                  </h1>
                  <div className="h-1.5 w-20 bg-orange-500 rounded-full" />
                </div>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
                {content.description}
              </p>
            </div>

            <div className="p-8 md:p-12 pt-12 md:pt-16">
              <div className="space-y-16">
                {content.sections.map((section, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <h2 className={cn("text-2xl text-navy mb-8 flex items-center gap-3", isArabic ? "font-semibold" : "font-bold")}>
                      <span className="w-2 h-2 rounded-full bg-navy/20" />
                      {section.title}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.content.map((item, itemIdx) => (
                        <li key={itemIdx} className="group flex items-start gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100/50 hover:border-navy/10 hover:shadow-lg hover:shadow-navy/5 transition-all duration-300">
                          <Icons.CheckCircle2 className="w-5 h-5 text-navy/40 group-hover:text-navy mt-1 flex-shrink-0 transition-colors" />
                          <span className="text-gray-700 text-[0.95rem] leading-relaxed font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Contact Footer */}
              <motion.div 
                variants={itemVariants}
                className="mt-20 p-8 rounded-[2rem] bg-navy text-white flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start"
              >
                <div>
                  <p className="text-navy-100 text-sm font-medium uppercase tracking-wider mb-1">{t.contact}</p>
                  <p className="text-xl font-semibold">{isArabic ? "نحن هنا لمساعدتكم في كل خطوة" : "Nous sommes là pour vous accompagner"}</p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.05] active:scale-95 whitespace-nowrap"
                >
                  {t.cta}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ServiceDetailPage;

