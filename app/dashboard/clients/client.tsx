"use client";

import { useState, useMemo } from "react";
import {
  createClient,
  updateClient,
  archiveClient,
} from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Pencil, Archive, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ClientRecord = {
  id: string;
  name: string;
  contactInfo: string;
  billingInfo: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ClientProps = {
  firstName: string;
  role: string;
  clients: ClientRecord[];
};

type ActionState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; message?: string }
  | { status: "error"; message: string };

const EMPTY_CLIENT: Partial<ClientRecord> = {
  name: "",
  contactInfo: "",
  billingInfo: "",
  notes: "",
};

export default function Client({ firstName, role, clients }: ClientProps) {
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "archive" | null>(null);
  const [selectedClient, setSelectedClient] = useState<Partial<ClientRecord>>(EMPTY_CLIENT);

  const [actionState, setActionState] = useState<ActionState>({ status: "idle" });
  const [clientList, setClientList] = useState<ClientRecord[]>(clients);

  // List filtered by search
  const filteredClients = useMemo(
    () =>
      clientList.filter((client) =>
        (client.name + client.contactInfo + client.billingInfo + (client.notes || ""))
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [clientList, search]
  );

  function openDialog(mode: "add" | "edit", client?: ClientRecord) {
    setSelectedClient(client ?? EMPTY_CLIENT);
    setDialogMode(mode);
    setShowDialog(true);
    setActionState({ status: "idle" });
  }
  function openArchiveDialog(client: ClientRecord) {
    setSelectedClient(client);
    setDialogMode("archive");
    setShowDialog(true);
    setActionState({ status: "idle" });
  }
  function closeDialog() {
    setShowDialog(false);
    setDialogMode(null);
    setSelectedClient(EMPTY_CLIENT);
    setActionState({ status: "idle" });
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionState({ status: "pending" });
    const formData = new FormData(e.currentTarget);
    const res = await createClient({}, formData);
    if (res.ok) {
      setClientList((prev) => [res.client, ...prev]);
      setActionState({ status: "success" });
      closeDialog();
    } else {
      setActionState({ status: "error", message: res.error || "Could not add client." });
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionState({ status: "pending" });
    const formData = new FormData(e.currentTarget);
    formData.append("id", selectedClient.id || "");
    const res = await updateClient({}, formData);
    if (res.ok) {
      setClientList((prev) =>
        prev.map((c) => (c.id === res.client.id ? res.client : c))
      );
      setActionState({ status: "success" });
      closeDialog();
    } else {
      setActionState({ status: "error", message: res.error || "Could not update client." });
    }
  }

  async function handleArchive(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionState({ status: "pending" });
    const formData = new FormData();
    formData.append("id", selectedClient.id || "");
    const res = await archiveClient({}, formData);
    if (res.ok) {
      setClientList((prev) => prev.filter((c) => c.id !== selectedClient.id));
      setActionState({ status: "success" });
      closeDialog();
    } else {
      setActionState({ status: "error", message: res.error || "Could not archive client." });
    }
  }

  // Permission control for mutate actions
  const canEdit = role === "admin" || role === "manager";

  // Render empty state helper
  if (!clientList.length && !search) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <UserPlus className="mb-4 text-primary h-10 w-10" />
        <h2 className="text-xl font-semibold">No clients yet</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Start building your agency’s client list. Add your first client now to begin project and contract workflows with AgencySync.
        </p>
        {canEdit && (
          <Button onClick={() => openDialog("add")} size="lg">
            Add Client
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Search, add, edit, and archive your agency’s clients. All data is scoped securely to your account.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-60"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {canEdit && (
            <Button onClick={() => openDialog("add")} className="ml-2">
              Add Client
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Billing Info</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              {canEdit && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 6 : 5} className="text-center text-muted-foreground">
                  No clients match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    <span className={cn("text-sm", !client.contactInfo && "italic text-muted-foreground")}>
                      {client.contactInfo || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm", !client.billingInfo && "italic text-muted-foreground")}>
                      {client.billingInfo || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm", !client.notes && "italic text-muted-foreground")}>
                      {client.notes || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status === "active" ? "default" : "secondary"}
                      className={client.status !== "active" ? "bg-gray-200 text-gray-600" : ""}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog("edit", client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openArchiveDialog(client)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDialog} onOpenChange={closeDialog}>
        {(dialogMode === "add" || dialogMode === "edit") && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add Client" : "Edit Client"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Add a new agency client. All fields (except name) are optional and can be updated later."
                  : "Update client information and notes."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={dialogMode === "add" ? handleAdd : handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="client-name">Name</Label>
                <Input id="client-name" name="name" placeholder="Agency client name" required defaultValue={selectedClient.name || ""} />
              </div>
              <div>
                <Label htmlFor="client-contact-info">Contact Info</Label>
                <Input id="client-contact-info" name="contactInfo" placeholder="Contact email or details" defaultValue={selectedClient.contactInfo || ""} />
              </div>
              <div>
                <Label htmlFor="client-billing-info">Billing Info</Label>
                <Input id="client-billing-info" name="billingInfo" placeholder="Billing details" defaultValue={selectedClient.billingInfo || ""} />
              </div>
              <div>
                <Label htmlFor="client-notes">Notes</Label>
                <Input id="client-notes" name="notes" placeholder="Private notes" defaultValue={selectedClient.notes || ""} />
              </div>

              {actionState.status === "pending" && (
                <div className="flex gap-2 text-primary items-center text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              )}
              {actionState.status === "error" && (
                <div className="text-destructive text-sm">{actionState.message}</div>
              )}

              <DialogFooter>
                <Button variant="ghost" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={actionState.status === "pending"}>
                  {dialogMode === "add" ? "Add" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}

        {dialogMode === "archive" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive Client</DialogTitle>
              <DialogDescription>
                Are you sure you want to archive <b>{selectedClient.name}</b>? This will hide the client from lists but will not delete any data (safe to restore in backend if needed).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleArchive} className="space-y-4">
              {actionState.status === "pending" && (
                <div className="flex gap-2 text-primary items-center text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Archiving...
                </div>
              )}
              {actionState.status === "error" && (
                <div className="text-destructive text-sm">{actionState.message}</div>
              )}

              <DialogFooter>
                <Button variant="ghost" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={actionState.status === "pending"}>
                  Archive
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}