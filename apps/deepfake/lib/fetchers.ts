import { getSession } from "@/lib/utils/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/clients/prisma";

export async function getUser(): Promise<User> {
  const session = await getSession();

  if (!session) notFound();

  return session.user;
}

