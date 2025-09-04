import type { ButtonProps } from "@heroui/react";

export enum FrequencyEnum {
  Yearly = "yearly",
  Monthly = "monthly",
  OneTime = "onetime",
}

export enum TiersEnum {
  Basic = "basic",
  Standard = "standard",
  Premium = "premium",
}

export type Frequency = {
  key: FrequencyEnum;
  label: string;
  priceSuffix: string;
};

export type Tier = {
  key: TiersEnum;
  id: {
    [FrequencyEnum.Yearly]: number;
    [FrequencyEnum.Monthly]: number;
    [FrequencyEnum.OneTime]: number;
  };
  amount: {
    [FrequencyEnum.Yearly]: number;
    [FrequencyEnum.Monthly]: number;
    [FrequencyEnum.OneTime]: number;
  };
  interval: {
    [FrequencyEnum.Yearly]: string;
    [FrequencyEnum.Monthly]: string;
    [FrequencyEnum.OneTime]: string;
  };
  title: string;
  previousPrice?: {
    [FrequencyEnum.Yearly]: string;
    [FrequencyEnum.Monthly]: string;
    [FrequencyEnum.OneTime]: string;
  };
  price:
    | {
        [FrequencyEnum.Yearly]: string;
        [FrequencyEnum.Monthly]: string;
        [FrequencyEnum.OneTime]: string;
      }
    | string;
  priceSuffix?: string;
  href: string;
  description?: string;
  mostPopular?: boolean;
  featured?: boolean;
  features?: {
    [key in FrequencyEnum]: string[];
  };
  buttonText: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant: ButtonProps["variant"];
};
