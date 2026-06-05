import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Popup from "@/components/Popup";
import DisableRscPrefetch from "@/components/DisableRscPrefetch";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DisableRscPrefetch />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Popup />
    </>
  );
}
