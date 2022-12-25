import Router from 'express-serve-static-core';

export interface Route {
  name: string;
  router: typeof Router;
}

export interface RouteArgs {
  routes: Array<Route>;
}
