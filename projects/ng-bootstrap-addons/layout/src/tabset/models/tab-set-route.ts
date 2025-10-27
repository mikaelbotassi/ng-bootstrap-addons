import { Route } from "@angular/router";
import { Type } from "@angular/core";
import { TabsetLayoutComponent } from "../components/tabset-layout.component";
import { TabsetManagerService } from "../services/tabset-manager.service";
import { TabSetInitializerGuard } from "../guards/tab-set-initializer.guard";
import { TabAutoOpenGuard } from "../guards/tab-auto-open.guard";
import { TabRoute } from "./tab-route";

export class TabSetRoute implements Route {
  tabs: TabRoute[];
  path?: string;
  title?: Route['title'];
  component: Type<any>;
  children: Route['children'];
  providers?: Route['providers'];
  resolve?: Route['resolve'];
  canActivate?: Route['canActivate'];

  constructor(route: Omit<TabSetRoute, 'component' | 'children'>) {
    this.tabs = route.tabs;
    this.path = route.path;
    this.title = route.title;
    this.component = TabsetLayoutComponent;
    this.children = route.tabs;
    this.providers = [...(route.providers ?? []), TabsetManagerService];
    this.resolve = route.resolve;
    this.canActivate = [
      ...(route.canActivate ?? []),
      TabSetInitializerGuard(this.tabs),
      TabAutoOpenGuard(this.tabs),
    ];
  }
}