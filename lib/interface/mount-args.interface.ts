import { ContextArgs } from './context.interface';
import { QueueConsumer } from './message.interface';
import { RouteArgs } from './routing-args.interface';

export interface MountArgs {
  ctxArgs: ContextArgs;
  routeArgs: RouteArgs;
  app: any;
  assets: MountAssets;
}

export interface MountAssets {
  mqChannelTag: string;
  queueConsumer: QueueConsumer;
  applicationName: string;
}
