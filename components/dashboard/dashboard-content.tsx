"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Circle,
  DollarSign,
  FolderKanban,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

type Metric = {
  label: string;
  value: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type OnboardingStep = {
  title: string;
  description: string;
  href: string;
  done: boolean;
};

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MockProject = {
  id: string;
  name: string;
  owner: string;
  status: string;
};

const metrics: Metric[] = [
  { label: "Clients Managed", value: "73", trend: "+8.2%", icon: Users, description: "vs last month" },
  { label: "Active Projects", value: "18", trend: "+6.1%", icon: FolderKanban, description: "vs last month" },
  { label: "Revenue (invoices)", value: "$12,480", trend: "+14.7%", icon: DollarSign, description: "vs last month" },
  { label: "Growth Rate", value: "9.4%", trend: "+2.5%", icon: TrendingUp, description: "vs last month" },
];

const onboardingSteps: OnboardingStep[] = [
  { title: "Complete your agency profile", description: "Add your agency details and branding.", href: "/dashboard/settings", done: false },
  { title: "Add your first client", description: "Start by onboarding a client into AgencySync.", href: "/dashboard/clients", done: false },
  { title: "Create your first project", description: "Set up a billable project for a client.", href: "/dashboard/projects", done: false },
  { title: "Invite your team", description: "Collaborate by sending invitations.", href: "/dashboard/team", done: false },
];

const recentActivity: ActivityItem[] = [
  { title: "Client onboarded", detail: "Brightly Media joined AgencySync", time: "10 min ago", icon: Users },
  { title: "Project marked complete", detail: "SEO Revamp marked as complete", time: "2 hr ago", icon: FolderKanban },
  { title: "Invoice paid", detail: "INV-2981 - $1,800.00 paid", time: "3 hr ago", icon: DollarSign },
  { title: "Team invited", detail: "2 users invited to AgencySync", time: "5 hr ago", icon: Users },
  { title: "Comment added", detail: "Feedback on Q3 Web Redesign", time: "7 hr ago", icon: Activity },
];

const quickActions = [
  { label: "Add Client", href: "/dashboard/clients/new", icon: Users },
  { label: "New Project", href: "/dashboard/projects/new", icon: FolderKanban },
  { label: "Invite Team", href: "/dashboard/team", icon: Activity },
];

const weeklyData = [
  { day: "Mon", users: 13, revenue: 1200 },
  { day: "Tue", users: 18, revenue: 1480 },
  { day: "Wed", users: 11, revenue: 1290 },
  { day: "Thu", users: 22, revenue: 1610 },
  { day: "Fri", users: 15, revenue: 1320 },
  { day: "Sat", users: 10, revenue: 980 },
  { day: "Sun", users: 8, revenue: 890 },
];

const monthlyRevenue = [
  { month: "Jan", value: 8240 },
  { month: "Feb", value: 10380 },
  { month: "Mar", value: 9210 },
  { month: "Apr", value: 11860 },
  { month: "May", value: 13420 },
  { month: "Jun", value: 12800 },
  { month: "Jul", value: 14450 },
  { month: "Aug", value: 15820 },
  { month: "Sep", value: 14600 },
  { month: "Oct", value: 15980 },
  { month: "Nov", value: 17600 },
  { month: "Dec", value: 12480 },
];

const initialMockProjects: MockProject[] = [
  { id: "p-1", name: "Web Redesign for Brightly Media", owner: "Chirag", status: "Ongoing" },
  { id: "p-2", name: "SEO Revamp for Nova Partners", owner: "Chirag", status: "In Review" },
  { id: "p-3", name: "Brand Refresh for OrbitWave", owner: "Chirag", status: "Completed" },
];

function BarChart({ data }: { data: typeof weeklyData }) {
  const maxUsers = Math.max(...data.map((d) => d.users));

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-[140px]">
        {data.map((d) => {
          const height = (d.users / maxUsers) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">{d.users}</span>
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary min-h-[4px]"
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {data.map((d) => (
          <div key={d.day} className="flex-1 text-center text-[10px] text-muted-foreground">
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}

function AreaChart({ data }: { data: typeof monthlyRevenue }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value)) * 0.8;
  const range = maxVal - minVal;
  const w = 400;
  const h = 140;
  const padding = 4;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (w - padding * 2),
    y: h - padding - ((d.value - minVal) / range) * (h - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[140px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGradient)" />
        <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between px-1">
        {data.filter((_, i) => i % 2 === 0).map((d) => (
          <span key={d.month} className="text-[10px] text-muted-foreground">{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function matchesQuery(query: string, ...fields: string[]): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(q));
}

export function DashboardContent({ greeting, firstName }: { greeting: string; firstName: string }) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<MockProject[]>(initialMockProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<MockProject | null>(null);

  const filteredMetrics = useMemo(
    () => (query ? metrics.filter((m) => matchesQuery(query, m.label, m.value, m.description)) : metrics),
    [query]
  );

  const filteredSteps = useMemo(
    () => (query ? onboardingSteps.filter((s) => matchesQuery(query, s.title, s.description)) : onboardingSteps),
    [query]
  );

  const filteredActivity = useMemo(
    () => (query ? recentActivity.filter((a) => matchesQuery(query, a.title, a.detail)) : recentActivity),
    [query]
  );

  const showMetrics = filteredMetrics.length > 0;
  const showOnboarding = filteredSteps.length > 0;
  const showCharts = !query || matchesQuery(query, "performance", "chart", "graph", "revenue", "engagement", "weekly", "monthly");
  const showActivity = filteredActivity.length > 0;
  const showCrudExample =
    !query || matchesQuery(query, "crud", "dialog", "modal", "project", "create", "edit");
  const noResults = !showMetrics && !showOnboarding && !showCharts && !showActivity && !showCrudExample;

  function openCreateDialog() {
    setEditingProject(null);
    setDialogOpen(true);
  }

  function openEditDialog(project: MockProject) {
    setEditingProject(project);
    setDialogOpen(true);
  }

  function handleSaveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const owner = String(formData.get("owner") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!name || !owner || !status) return;

    if (editingProject) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? { ...project, name, owner, status }
            : project
        )
      );
    } else {
      setProjects((prev) => [{ id: `p-${Date.now()}`, name, owner, status }, ...prev]);
    }

    setDialogOpen(false);
  }

  return (
    <>
      {/* Welcome banner */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome to your AgencySync workspace—your hub for client, project, and agency management.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1.5"
                  disabled={action.href === "#"}
                >
                  <Link href={action.href}>
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your agency workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-muted/50 border-muted-foreground/15 focus-visible:border-border focus-visible:bg-background"
          />
        </div>
      </div>

      {noResults && (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try a different search term or clear the filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metric cards */}
      {showMetrics && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription className="text-sm font-medium">{metric.label}</CardDescription>
                  <div className="rounded-md bg-muted p-2">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="rounded-md px-1.5 py-0 text-xs font-medium text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/15 border-0"
                    >
                      {metric.trend}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{metric.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Middle section */}
      {(showOnboarding || showCharts) && (
        <div className="mb-8 grid gap-6 lg:grid-cols-5">
          {showOnboarding && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Getting Started</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    0 / {onboardingSteps.length}
                  </Badge>
                </div>
                <CardDescription>Begin your AgencySync journey by setting up your agency workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {filteredSteps.map((step) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                  >
                    {step.done ? (
                      <CheckCircle2 className="size-[18px] shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="size-[18px] shrink-0 text-muted-foreground/40" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none">{step.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {showCharts && (
            <Card className={showOnboarding ? "lg:col-span-3" : "lg:col-span-5"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Weekly Client Activity</CardTitle>
                    <CardDescription>New client signups and projects launched</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium">
                    48 activities
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart data={weeklyData} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Revenue chart */}
      {showCharts && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Revenue Overview</CardTitle>
                  <CardDescription>Monthly invoice totals in AgencySync</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tracking-tight">$12,480</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+14.7% from last month</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChart data={monthlyRevenue} />
            </CardContent>
          </Card>
        </div>
      )}

      {showCrudExample && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Client Projects</CardTitle>
                  <CardDescription>
                    Create and update agency projects (mock, not persisted)
                  </CardDescription>
                </div>
                <Button size="sm" onClick={openCreateDialog}>
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-md border border-border/70 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Owner: {project.owner} • Status: {project.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(project)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add Project"}
                </DialogTitle>
                <DialogDescription>
                  This is sample data for demonstration only. Projects are not saved to your AgencySync account.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    name="name"
                    defaultValue={editingProject?.name ?? ""}
                    placeholder="OrbitWave Website"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-owner">Owner</Label>
                  <Input
                    id="project-owner"
                    name="owner"
                    defaultValue={editingProject?.owner ?? ""}
                    placeholder="Chirag"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-status">Status</Label>
                  <Input
                    id="project-status"
                    name="status"
                    defaultValue={editingProject?.status ?? "Ongoing"}
                    placeholder="Ongoing"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProject ? "Save Changes" : "Add Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Activity feed */}
      {showActivity && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Latest agency events and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled>
                View all
                <ArrowUpRight className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {filteredActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.title}-${item.time}`}>
                    <div className="flex items-center gap-4 py-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    {i < filteredActivity.length - 1 ? <Separator /> : null}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}