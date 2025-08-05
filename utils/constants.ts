import { Currency, SubscriptionInterval } from "./types";

export const currencies: Currency[] = ["USD", "EUR", "GBP", "CAD", "AUD", "EGP"];
export const reminderOptions: number[] = [1, 3, 7, 14];
export const intervalOptions = ["Weekly", "Monthly", "Quarterly", "Yearly"];

export const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  EGP: "E£"
};

export const intervalLabels: Record<SubscriptionInterval, string> = {
  monthly: "per month",
  quarterly: "per quarter",
  yearly: "per year",
};
