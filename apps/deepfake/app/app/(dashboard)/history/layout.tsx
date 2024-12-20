import { type ReactNode } from "react";
import { type Metadata } from "next";
import { ValidationsProvider } from "@/components/validations-provider";
import { getUser, getValidations } from "@/lib/fetchers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  const validations = await getValidations(user.id);

  return <ValidationsProvider validations={validations} >{children}</ValidationsProvider>;
}
