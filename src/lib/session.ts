import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireSiteOwner(siteId: string) {
  const user = await requireUser();

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { ownerId: true },
  });

  if (!site || site.ownerId !== user.id) {
    throw new Error("Forbidden");
  }

  return user;
}
