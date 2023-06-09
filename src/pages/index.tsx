import { type ReactNode, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { type Outcome, Income } from "@prisma/client";

import { api } from "@/utils/api";
import { formatDay, formatMonthAndYear, formatPounds } from "@/utils/helpers";
import { Main } from "@/components";

export type DateState = {
  year: number;
  monthIdx: number;
  totalIncome: number;
  totalOutcome: number;
};

const Home: NextPage = () => {
  const [globals, setGlobals] = useState<Pick<DateState, "year" | "monthIdx">>({
    year: new Date().getFullYear(),
    monthIdx: new Date().getMonth(),
  });

  const { data: outcomes } = api.outcome.getByMonth.useQuery({
    year: globals.year,
    monthIdx: globals.monthIdx,
  });

  const { data: incomes } = api.incomes.getByMonth.useQuery({
    year: globals.year,
    monthIdx: globals.monthIdx,
  });

  const totalIncome = incomes?.reduce((acc, crr) => acc + crr.amount, 0) || 0;
  const totalOutcome =
    outcomes
      ?.sort((a, b) => a.due_date - b.due_date)
      .reduce((acc, crr) => acc + crr.amount, 0) || 0;

  const handlePreviousMonth = () => {
    const nextMonthIdx = globals.monthIdx >= 1 ? globals.monthIdx - 1 : 11;
    const nextYear = globals.monthIdx >= 1 ? globals.year : globals.year - 1;

    setGlobals({
      year: nextYear,
      monthIdx: nextMonthIdx,
    });
  };

  const handleNextMonth = () => {
    const previosMonthIdx = globals.monthIdx <= 10 ? globals.monthIdx + 1 : 0;
    const previousYear =
      globals.monthIdx <= 10 ? globals.year : globals.year + 1;

    setGlobals({
      year: previousYear,
      monthIdx: previosMonthIdx,
    });
  };

  return (
    <>
      <Head>
        <title>House Budget Splitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Container>
          <Header year={globals.year} monthIdx={globals.monthIdx} />
          <Actions next={handleNextMonth} previous={handlePreviousMonth} />
          <div className="sm:flex sm:gap-4">
            {!!outcomes?.length && <Outcome outcomes={outcomes} />}
            {!!incomes?.length && <Income income={incomes} />}
          </div>
        </Container>
      </Main>
      <Footer totalIncome={totalIncome} totalOutcome={totalOutcome} />
    </>
  );
};

const Header: React.FC<{ year: number; monthIdx: number }> = ({
  year,
  monthIdx,
}) => {
  return (
    <header className="mb-4 flex w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-white">
        {formatMonthAndYear(year, monthIdx)}
      </h1>
    </header>
  );
};

const Container: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="m-auto flex max-w-7xl flex-col gap-12 px-4 py-16">
      {children}
    </div>
  );
};

const Outcome: React.FC<{ outcomes: Outcome[] }> = ({ outcomes }) => {
  return (
    <div className="mb-4 flex flex-1 flex-col items-center gap-6 text-white sm:mb-0">
      <p className="text-2xl">OUTCOME</p>
      {outcomes.map((b, i) => {
        if (b.amount === 0) return null;
        return (
          <div
            key={i}
            className="text- flex w-full items-center justify-between gap-8 rounded-lg bg-slate-500 px-4 py-4"
          >
            <p className="flex-1 font-bold">{b.description}</p>
            <p className="text-sm">{formatPounds(+b.amount)}</p>
            <p className="text-sm">{formatDay(b.due_date)}</p>
            <p className="text-sm">{b.account}</p>
          </div>
        );
      })}
    </div>
  );
};

const Income: React.FC<{ income: Income[] }> = ({ income }) => {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 text-white">
      <p className="text-2xl">INCOME</p>
      {income.map((b, i) => {
        if (b.amount === 0) return null;
        return (
          <div
            key={i}
            className="text- flex w-full items-center justify-between gap-8 rounded-lg bg-slate-500 px-4 py-4"
          >
            <p className="flex-1 font-bold">{b.name}</p>
            <p className="text-sm">{formatPounds(+b.amount)}</p>
          </div>
        );
      })}
    </div>
  );
};

const Actions: React.FC<{
  next: () => void;
  previous: () => void;
}> = ({ next, previous }) => {
  return (
    <div className="flex w-full justify-between">
      <button
        className="rounded-lg bg-slate-300 px-4 py-2 font-bold hover:bg-slate-600"
        onClick={previous}
      >
        PREVIOUS
      </button>
      <button
        className="rounded-lg bg-slate-300 px-4 py-2 font-bold hover:bg-slate-600"
        onClick={next}
      >
        NEXT
      </button>
    </div>
  );
};

const Footer: React.FC<{ totalIncome: number; totalOutcome: number }> = ({
  totalIncome,
  totalOutcome,
}) => {
  return (
    <footer className="fixed bottom-0 m-auto flex w-screen flex-col items-center justify-center gap-2 bg-slate-900 py-4">
      <div className="flex gap-4">
        <p className="text-center text-xl font-extrabold text-white">
          Total Income {formatPounds(totalIncome)}
        </p>
        <p className="text-center text-xl font-extrabold text-white">|</p>
        <p className="text-center text-xl font-extrabold text-white">
          Total Outcome {formatPounds(totalOutcome)}
        </p>
      </div>
    </footer>
  );
};

export default Home;
