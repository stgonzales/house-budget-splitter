import { createTRPCRouter } from "@/server/api/trpc";
import { outcomeRouter } from "@/server/api/routers/outcome";
import { incomesRouter } from "@/server/api/routers/incomes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  outcome: outcomeRouter,
  incomes: incomesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
