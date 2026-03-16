"use server";

import { z } from "zod";
import { and, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { clients, teams, teamMembers, users } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

// Zod schemas for input validation
const createClientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  contactInfo: z.string().optional(),
  billingInfo: z.string().optional(),
  notes: z.string().optional(),
});

const updateClientSchema = z.object({
  id: z.string().min(1, "Client id is required"),
  name: z.string().min(2, "Client name is required"),
  contactInfo: z.string().optional(),
  billingInfo: z.string().optional(),
  notes: z.string().optional(),
});

const archiveClientSchema = z.object({
  id: z.string().min(1, "Client id is required"),
});

function errorState(message: string) {
  return { ok: false, error: message };
}

async function getUserTenantAndRole() {
  const session = await getAuthSession();
  if (!session) return null;

  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!membership) return null;
  return { teamId: membership.teamId, role: membership.role };
}

// CREATE client
export async function createClient(_prevState: any, formData: FormData) {
  const parsed = createClientSchema.safeParse({
    name: formData.get("name"),
    contactInfo: formData.get("contactInfo") ?? "",
    billingInfo: formData.get("billingInfo") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid data");
  }

  const tenant = await getUserTenantAndRole();
  if (!tenant) return errorState("Unauthorized");
  if (tenant.role !== "admin" && tenant.role !== "manager") {
    return errorState("You do not have permission to add clients.");
  }

  const [client] = await db
    .insert(clients)
    .values({
      teamId: tenant.teamId,
      name: parsed.data.name,
      contactInfo: parsed.data.contactInfo ?? "",
      billingInfo: parsed.data.billingInfo ?? "",
      notes: parsed.data.notes ?? "",
      status: "active",
    })
    .returning();

  return {
    ok: true,
    client: {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      billingInfo: client.billingInfo,
      notes: client.notes,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    },
  };
}

// UPDATE client
export async function updateClient(_prevState: any, formData: FormData) {
  const parsed = updateClientSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    contactInfo: formData.get("contactInfo"),
    billingInfo: formData.get("billingInfo"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid data");
  }

  const tenant = await getUserTenantAndRole();
  if (!tenant) return errorState("Unauthorized");
  if (tenant.role !== "admin" && tenant.role !== "manager") {
    return errorState("You do not have permission to update clients.");
  }

  const [client] = await db
    .update(clients)
    .set({
      name: parsed.data.name,
      contactInfo: parsed.data.contactInfo ?? "",
      billingInfo: parsed.data.billingInfo ?? "",
      notes: parsed.data.notes ?? "",
      updatedAt: new Date(),
    })
    .where(
      and(eq(clients.id, parsed.data.id), eq(clients.teamId, tenant.teamId))
    )
    .returning();

  if (!client) return errorState("Client not found.");
  return {
    ok: true,
    client: {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      billingInfo: client.billingInfo,
      notes: client.notes,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    },
  };
}

// ARCHIVE client (set status=archived)
export async function archiveClient(_prevState: any, formData: FormData) {
  const parsed = archiveClientSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid data");
  }

  const tenant = await getUserTenantAndRole();
  if (!tenant) return errorState("Unauthorized");
  if (tenant.role !== "admin" && tenant.role !== "manager") {
    return errorState("You do not have permission to archive clients.");
  }

  const [client] = await db
    .update(clients)
    .set({
      status: "archived",
      updatedAt: new Date(),
    })
    .where(
      and(eq(clients.id, parsed.data.id), eq(clients.teamId, tenant.teamId))
    )
    .returning();

  if (!client) return errorState("Client not found.");
  return {
    ok: true,
    client: {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      billingInfo: client.billingInfo,
      notes: client.notes,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    },
  };
}

// READ clients (optionally filtered by search)
export async function listClients({ search = "" }: { search?: string } = {}) {
  const session = await getAuthSession();
  if (!session) return [];

  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!membership) return [];

  // Compose where-clause with/without search
  const conditions = [
    eq(clients.teamId, membership.teamId),
    eq(clients.status, "active"),
  ];
  if (search) {
    conditions.push(ilike(clients.name, `%${search}%`));
  }

  const rows = await db
    .select()
    .from(clients)
    .where(and(...conditions));

  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    contactInfo: c.contactInfo,
    billingInfo: c.billingInfo,
    notes: c.notes,
    status: c.status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}