import Navbar from "./Navbar";
import Footer from "./Footer";

function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-navy text-gray-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default PageWrapper;
