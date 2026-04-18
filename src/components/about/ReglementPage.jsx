import { useLang } from "../../context/LangContext";
import { cadreAssociatifContent } from "../../data/cadreAssociatifContent";
import DocumentLayout from "../layout/DocumentLayout";

export default function ReglementPage() {
  const { lang } = useLang();
  const data = cadreAssociatifContent[lang].reglement;

  return <DocumentLayout data={data} />;
}
