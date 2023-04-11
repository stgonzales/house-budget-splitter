import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const monthRouter = createTRPCRouter({
  getMonthOutcomes: publicProcedure
    .input(
      z.object({
        monthIdx: z.number().min(0).max(11),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.month.findMany({
        where: {
          index: input.monthIdx,
        },
        select: {
          id: true,
        },
      });
    }),
});
