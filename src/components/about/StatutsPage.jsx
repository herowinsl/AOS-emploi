import { useLang } from "../../context/LangContext";
import { cadreAssociatifContent } from "../../data/cadreAssociatifContent";
import DocumentLayout from "../layout/DocumentLayout";

export default function StatutsPage() {
  const { lang } = useLang();
  const data = cadreAssociatifContent[lang].statuts;

  return <DocumentLayout data={data} />;
}
