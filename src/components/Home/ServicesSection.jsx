import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import SkeletonCard from "../common/SkeletonCard";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";
import ServiceCard from "../services/ServiceCard";
import homeContent from "../../mocks/home.json";
import { useLang } from "../../context/LangContext";

/**
 * @param {{
 *  services: Array<object>
 *  loading: boolean
 *  error: string | null
 *  onRetry: () => void
 * }} props
 */
function ServicesSection({ services, loading, error, onRetry }) {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = homeContent.sections.services;

  const title = isArabic ? t.title_ar : t.title_fr;
  const subtitle = isArabic ? t.subtitle_ar : t.subtitle_fr;
  const cta = isArabic ? t.cta_ar : t.cta_fr;
  const emptyMessage = isArabic ? "لا توجد خدمات متاحة حالياً." : "Aucun service disponible.";
  const retryLabel = isArabic ? "إعادة المحاولة" : "Reessayer";
  const badge = isArabic ? "خدمات عملية" : "Prestations prioritaires";

  const marqueeItems = services.length > 0 ? [...services, ...services] : [];

  return (
    <section className="bg-gray-soft py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={title} subtitle={subtitle} badge={badge} isArabic={isArabic} />

        <div className="mt-12">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <SkeletonCard count={4} />
            </div>
          ) : null}
          {!loading && error ? (
            <ErrorBanner message={error} onRetry={onRetry} retryLabel={retryLabel} />
          ) : null}
          {!loading && !error && services.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : null}
          {!loading && !error && services.length > 0 && (
            <div className="marquee overflow-hidden py-6 sm:py-8" dir="ltr" style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}>
              <div className="marquee-track flex gap-6 w-max group">
                {marqueeItems.map((service, i) => (
                  <div key={`${service.id}-a-${i}`} className="w-[280px] flex-shrink-0">
                    <ServiceCard service={service} />
                  </div>
                ))}
                {/* Duplicated set — hidden from screen readers */}
                <div aria-hidden="true" className="flex gap-6">
                  {marqueeItems.map((service, i) => (
                    <div key={`${service.id}-b-${i}`} className="w-[280px] flex-shrink-0">
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-light"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
