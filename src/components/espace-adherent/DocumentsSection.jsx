import React from "react";
import { useLang } from "../../context/LangContext";
import { dashboardContent } from "./dashboardContent";
import { Card, CardContent } from "../ui/card";
import { FileText, Download, Search } from "lucide-react";
import Button from "../common/Button";

const DocumentsSection = () => {
  const { lang } = useLang();
  const t = dashboardContent[lang].documents;
  const isArabic = lang === "ar";

  const docs = [
    { id: 1, title: "Formulaire d'adhésion", titleAr: "نموذج الانخراط", type: "PDF", size: "1.2 MB" },
    { id: 2, title: "Demande de prêt social", titleAr: "طلب قرض اجتماعي", type: "PDF", size: "850 KB" },
    { id: 3, title: "Convention RAM 2026", titleAr: "اتفاقية الخطوط الملكية المغربية 2026", type: "PDF", size: "2.4 MB" },
    { id: 4, title: "Guide de l'adhérent", titleAr: "دليل المنخرط", type: "PDF", size: "5.1 MB" },
  ];

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {docs.map((doc) => {
          const title = isArabic ? doc.titleAr : doc.title;

          return (
            <Card
              key={doc.id}
              className="overflow-hidden border-none shadow-lg shadow-navy/5 transition-all hover:shadow-xl hover:shadow-navy/10"
            >
              <CardContent className="p-0">
                <div
                  dir={isArabic ? "rtl" : "ltr"}
                  className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 p-3 sm:p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold leading-5 text-navy sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      {doc.type} • {doc.size}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      aria-label={isArabic ? "تحميل الوثيقة" : "Télécharger le document"}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-gray-200 p-0 transition-colors hover:bg-navy hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsSection;