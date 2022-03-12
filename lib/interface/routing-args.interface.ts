import { Router } from 'express';

export interface Route {
  name: string;
  router: Router;
}

export interface RouteArgs {
  routes: Array<Route>;
}
