import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per month" },
  {
    key: FrequencyEnum.OneTime,
    label: "Pay One Time",
    priceSuffix: "one time",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 5,
      [FrequencyEnum.OneTime]: 1,
    },
    amount: {
      [FrequencyEnum.Monthly]: 1490,
      [FrequencyEnum.Yearly]: 15000,
      [FrequencyEnum.OneTime]: 1590,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Basic",
    price: {
      yearly: "$11.9",
      monthly: "$14.9",
      onetime: "$15.9",
    },
    previousPrice: {
      yearly: "$15.9",
      monthly: "$15.9",
      onetime: "",
    },
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For starters and hobbyists that want to try out.",
    features: {
      yearly: ["1000 credits per year", "All tools available", "Email support"],
      monthly: [
        "100 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "100 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Standard,
    id: {
      [FrequencyEnum.Yearly]: 6,
      [FrequencyEnum.Monthly]: 3,
      [FrequencyEnum.OneTime]: 9,
    },
    amount: {
      [FrequencyEnum.Yearly]: 28800,
      [FrequencyEnum.Monthly]: 2790,
      [FrequencyEnum.OneTime]: 2990,
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Standard",
    description: "For enthusiasts that want to try out.",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "$23.9",
      monthly: "$27.9",
      onetime: "$29.9",
    },
    previousPrice: {
      yearly: "$29.9",
      monthly: "$29.9",
      onetime: "",
    },
    featured: false,
    features: {
      yearly: ["2000 credits per year", "All tools available", "Email support"],
      monthly: [
        "200 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "200 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Premium,
    id: {
      [FrequencyEnum.Yearly]: 8,
      [FrequencyEnum.Monthly]: 4,
      [FrequencyEnum.OneTime]: 11,
    },
    amount: {
      [FrequencyEnum.Yearly]: 47000,
      [FrequencyEnum.Monthly]: 4390,
      [FrequencyEnum.OneTime]: 4890,
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Premium",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "For professionals that want to try out.",
    price: {
      yearly: "$38.9",
      monthly: "$43.9",
      onetime: "$48.9",
    },
    previousPrice: {
      yearly: "$48.9",
      monthly: "$48.9",
      onetime: "",
    },
    priceSuffix: "",
    features: {
      yearly: ["4200 credits per year", "All tools available", "Email support"],
      monthly: [
        "400 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "400 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
