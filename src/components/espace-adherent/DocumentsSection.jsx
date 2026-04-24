import React from "react";
import { useLang } from "../../context/LangContext";
import { dashboardContent } from "./dashboardContent";
import { FileText, Search } from "lucide-react"; // Keep FileText for consistency/aesthetics in the table row

const DocumentsSection = () => {
  const { lang } = useLang();
  const t = dashboardContent[lang].documents;
  const isArabic = lang === "ar";

  const docs = [
    { id: 1, title: "Formulaire d'adhésion", titleAr: "نموذج الانخراط", type: "PDF", size: "1.2 MB", downloadLink: "/path/to/formulaire.pdf" },
    { id: 2, title: "Demande de prêt social", titleAr: "طلب قرض اجتماعي", type: "PDF", size: "850 KB", downloadLink: "/path/to/pret.pdf" },
    { id: 3, title: "Convention RAM 2026", titleAr: "اتفاقية الخطوط الملكية المغربية 2026", type: "PDF", size: "2.4 MB", downloadLink: "/path/to/convention.pdf" },
    { id: 4, title: "Guide de l'adhérent", titleAr: "دليل المنخرط", type: "PDF", size: "5.1 MB", downloadLink: "/path/to/guide.pdf" },
  ];

  const handleDownload = (doc) => {
    window.open(doc.downloadLink, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className={`text-2xl text-navy ${isArabic ? "font-semibold" : "font-bold"}`}>
            {t.title}
          </h2>
          <p className="mt-1 text-gray-500">{t.description}</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isArabic ? "بحث عن وثيقة..." : "Rechercher un document..."}
            className="w-full rounded-xl border border-gray-200 py-2 ps-10 pe-4 outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg shadow-navy/5">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "اسم الوثيقة" : "Document Name"}
              </th>
              <th
                scope="col"
                className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "النوع" : "Type"}
              </th>
              <th
                scope="col"
                className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? "text-right" : "text-left"}`}
              >
                {isArabic ? "الحجم" : "Size"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {docs.map((doc) => {
              const title = isArabic ? doc.titleAr : doc.title;
              return (
                <tr
                  key={doc.id}
                  onClick={() => handleDownload(doc)}
                  className="group cursor-pointer transition-colors hover:bg-gray-50"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-navy">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      {title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                    {doc.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                    {doc.size}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsSection;