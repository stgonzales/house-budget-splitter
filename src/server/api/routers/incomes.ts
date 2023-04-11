import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const incomesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.outcome.findMany();
  }),
  getByMonth: publicProcedure
    .input(
      z.object({
        monthIdx: z.number().min(0).max(11),
        year: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.income.findMany({
        where: {
          monthIdx: input.monthIdx,
          AND: {
            month: {
              year: input.year,
            },
          },
        },
      });
    }),
  getTotalByMonth: publicProcedure
    .input(
      z.object({
        monthIdx: z.number().min(0).max(11),
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.income.findMany({
        where: {
          monthIdx: input.monthIdx,
          AND: {
            month: {
              year: input.year,
            },
          },
        },
      });
      return res.reduce((acc, curr) => acc + curr.amount, 0);
    }),
});
