import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users, teamMembers } from "@/lib/db/schema";
import Client from "./client";
import { listClients } from "./actions";

export default async function ClientsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Get the current user's first name and role
  const [user] = await db
    .select({ firstName: users.firstName })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  const firstName = user?.firstName || "there";
  const role = membership?.role || "member";

  // Fetch clients for the current team (tenant)
  const clientsList = await listClients();

  return (
    <Client
      firstName={firstName}
      role={role}
      clients={clientsList}
    />
  );
}