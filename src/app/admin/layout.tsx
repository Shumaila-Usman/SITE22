import { ToastContainer } from "@/components/admin/ui";

export const metadata = { title: "Admin — Megacore International" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
