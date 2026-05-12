import { z } from 'zod';

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3).default('EUR'),
});

export type Money = z.infer<typeof MoneySchema>;

export function createMoney(amount: number, currency = 'EUR'): Money {
  return { amount, currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Incompatibilité de devises : ${a.currency} ≠ ${b.currency}`);
  }
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function multiplyMoney(money: Money, factor: number): Money {
  return { amount: money.amount * factor, currency: money.currency };
}
