import { useState } from "react";
import {
  HeartHandshake,
  Stethoscope,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Sparkles,
  Users,
  Banknote,
} from "lucide-react";
import { useLang } from "../../context/LangContext";
import { cn } from "../../lib/utils";

const SERVICE_ICONS = {
  HeartHandshake,
  Stethoscope,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Sparkles,
  Users,
  Banknote,
};

const getServices = (lang) => [
  {
    id: "aide-sociale",
    icon: "HeartHandshake",
    nameFr: "Aide Sociale",
    nameAr: "المساعدة الاجتماعية",
    descFr: "Soutien financier et moral",
    descAr: "دعم مالي ومعنوي",
  },
  {
    id: "couverture-medicale",
    icon: "Stethoscope",
    nameFr: "Couverture Médicale",
    nameAr: "التغطية الطبية",
    descFr: "Prise en charge des frais médicaux",
    descAr: "تغطية المصاريف الطبية",
  },
  {
    id: "aide-scolaire",
    icon: "GraduationCap",
    nameFr: "Aide Scolaire",
    nameAr: "المساعدة المدرسية",
    descFr: "Soutien à la scolarisation",
    descAr: "دعم التمدرس",
  },
  {
    id: "activites",
    icon: "Trophy",
    nameFr: "Activités Culturelles",
    nameAr: "الأنشطة الثقافية",
    descFr: "Sorties, voyages et sport",
    descAr: "رحلات وسفر ورياضة",
  },
  {
    id: "institution",
    icon: "ShieldCheck",
    nameFr: "Institution Officielle",
    nameAr: "مؤسسة رسمية",
    descFr: "Association reconnue",
    descAr: "جمعية معترف بها",
  },
  {
    id: "mission",
    icon: "Sparkles",
    nameFr: "Mission Sociale",
    nameAr: "المهمة الاجتماعية",
    descFr: "Bien-être des fonctionnaires",
    descAr: "رفاه الموظفين",
  },
  {
    id: "adherents",
    icon: "Users",
    nameFr: "1500+ Adhérents",
    nameAr: "+1500 منخرط",
    descFr: "Famille AOS active",
    descAr: "عائلة AOS النشطة",
  },
  {
    id: "prets",
    icon: "Banknote",
    nameFr: "Prêts Exceptionnels",
    nameAr: "القروض الاستثنائية",
    descFr: "Aide financière d'urgence",
    descAr: "مساعدة مالية طارئة",
  },
];

function HeroInfoPanel() {
  const { lang } = useLang();
  const services = getServices(lang);
  const [hoveredId, setHoveredId] = useState(null);

  const col1 = services.filter((_, i) => i % 3 === 0);
  const col2 = services.filter((_, i) => i % 3 === 1);
  const col3 = services.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex w-full max-w-xl mx-auto lg:mx-0 select-none">
      {/* ── Left: icon grid ── */}
      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Column 1 */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {col1.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              className="w-[72px] h-[80px] sm:w-[95px] sm:h-[105px] md:w-[115px] md:h-[125px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 — offset */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mt-[32px] sm:mt-[42px] md:mt-[52px]">
          {col2.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              className="w-[80px] h-[88px] sm:w-[106px] sm:h-[116px] md:w-[128px] md:h-[138px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 — offset */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mt-[16px] sm:mt-[22px] md:mt-[28px]">
          {col3.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              className="w-[76px] h-[84px] sm:w-[100px] sm:h-[110px] md:w-[122px] md:h-[132px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Right: service name list ── */}
      <div className="flex flex-col gap-2 sm:gap-3 pt-0 ps-4 sm:ps-5 flex-1 min-w-0">
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}



function ServiceCard({ service, className, hoveredId, onHover }) {
  const isActive = hoveredId === service.id;
  const isDimmed = hoveredId !== null && !isActive;
  const IconComponent = SERVICE_ICONS[service.icon] || ShieldCheck;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-all duration-400 border border-white/10 bg-white/5 backdrop-blur-sm",
        className,
        isDimmed ? "opacity-40 scale-95" : "opacity-100"
      )}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(service.id)}
      onTouchEnd={() => onHover(null)}
    >
      <div
        className={cn(
          "w-full h-full flex items-center justify-center transition-all duration-500",
          isActive
            ? "bg-brand-orange/20 text-brand-orange"
            : "bg-white/5 text-white/60"
        )}
      >
        <IconComponent
          size={24}
          strokeWidth={1.5}
          className="transition-transform duration-500"
        />
      </div>
    </div>
  );
}



function ServiceRow({ service, hoveredId, onHover }) {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const isActive = hoveredId === service.id;
  const isDimmed = hoveredId !== null && !isActive;
  const name = isArabic ? service.nameAr : service.nameFr;
  const desc = isArabic ? service.descAr : service.descFr;

  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-300",
        isDimmed ? "opacity-30" : "opacity-100"
      )}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(service.id)}
      onTouchEnd={() => onHover(null)}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-3 h-2 rounded-sm flex-shrink-0 transition-all duration-300",
            isActive ? "bg-brand-orange w-4" : "bg-white/20"
          )}
        />
        <span
          className={cn(
            "text-xs sm:text-sm md:text-base font-semibold leading-none tracking-tight transition-colors duration-300",
            isActive ? "text-white" : "text-white/60"
          )}
        >
          {name}
        </span>
      </div>

      <p
        className={cn(
          "mt-1 ps-5 text-[10px] sm:text-xs font-medium tracking-wide transition-colors duration-300",
          isActive ? "text-white/70" : "text-white/35"
        )}
      >
        {desc}
      </p>
    </div>
  );
}

export default HeroInfoPanel;
