import { Route } from "@angular/router";
import { MonitoringPageGuard } from "app-lib";

export const monitoringRoutes: Route[] = [
  {
    path: "anonymous",
    loadChildren: () =>
      import(`./anonymous-dashboard/anonymous-dashboard.module`).then(
        m => m.AnonymousDashboardModule
      ),
    runGuardsAndResolvers: "always",
    canActivate: [MonitoringPageGuard],
    data: {
      username: ["anonymous"]
    }
  },
  {
    path: "supervisor",
    loadChildren: () =>
      import(`./supervisor-dashboard/supervisor-dashboard.module`).then(
        m => m.SupervisorDashboardModule
      ),
    runGuardsAndResolvers: "always",
    canActivate: [MonitoringPageGuard],
    data: {
      username: ["supervisor"]
    }
  },
  {
    path: "tech",
    loadChildren: () =>
      import(`./tech-dashboard/tech-dashboard.module`).then(
        m => m.TechDashboardModule
      ),
    runGuardsAndResolvers: "always",
    canActivate: [MonitoringPageGuard],
    data: {
      username: ["tech"]
    }
  },
  {
    path: "admin",
    loadChildren: () =>
      import(`./admin-dashboard/admin-dashboard.module`).then(
        m => m.AdminDashboardModule
      ),
    runGuardsAndResolvers: "always",
    canActivate: [MonitoringPageGuard],
    data: {
      username: ["admin"]
    }
  },
  {
    path: "**",
    redirectTo: "anonymous"
  }
];
