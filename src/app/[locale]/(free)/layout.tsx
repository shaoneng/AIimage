import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-100 via-white to-indigo-100">
      <Navbar />
      {children}
      <Footer locale={locale} />
      <Toaster richColors position="top-center" theme="light" duration={3000} />
    </div>
  );
}
