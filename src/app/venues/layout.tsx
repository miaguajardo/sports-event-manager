import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
