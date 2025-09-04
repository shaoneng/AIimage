"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
  Tab,
  Tabs,
} from "@heroui/react";
import { cn } from "@heroui/react";

import { FrequencyEnum } from "@/components/price/pricing-types";
import { frequencies, tiers } from "@/components/price/pricing-tiers";
import { useAppContext } from "@/contexts/app";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies.find((f) => f.key === FrequencyEnum.Yearly) || frequencies[0]
  );
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);
    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  const handleCheckout = async (
    plan_id: number,
    amount: number,
    interval: string
  ) => {
    try {
      setLoading(true);

      const params = {
        plan_id: plan_id,
        amount: amount,
        interval: interval,
        user_uuid: user?.uuid,
        user_email: user?.email,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (response.status === 401) {
        onOpen();
        return;
      }

      if (response.status === 500) {
        const errorMessage = data.error || "Checkout failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      if (!data || !data.session?.url) {
        toast.error("Invalid response from server");
        return;
      }

      router.push(data.session.url);
    } catch (e) {
      console.error("Checkout failed:", e);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex  flex max-w-4xl flex-col items-center">
      <div
        aria-hidden="true"
        className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl md:right-20 md:h-auto md:w-auto md:px-36"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex max-w-4xl flex-col text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600 text-center">
          Pick Your Best Plan of AI Video Generator
        </h2>
        <Spacer y={4} />
      </div>
      <Spacer y={8} />
      <Tabs
        classNames={{
          tabList: "border-1 max-w-full sm:max-w-none",
          cursor: "bg-blue-500",
          tab: [
            "data-[hover-unselected=true]:opacity-90",
            "group",
            "data-[selected=true] > * text-white",
            "data-[selected=false] > * text-black",
            "px-2 sm:px-4", // Add padding that's smaller on mobile
          ].join(" "),
          tabContent:
            "group-data-[selected=true]:text-white group-data-[selected=false]:text-black text-xs sm:text-base", // Make text smaller on mobile
        }}
        radius="full"
        color="secondary"
        onSelectionChange={onFrequencyChange}
        defaultSelectedKey={FrequencyEnum.Yearly}
      >
        <Tab
          key={FrequencyEnum.Yearly}
          aria-label="Pay Yearly"
          className="pr-0.5"
          title={
            <div className="flex items-center gap-1 sm:gap-2">
              <p>Pay Yearly</p>
              <Chip
                color="secondary"
                variant="flat"
                className="bg-blue-200 text-blue-700 text-xs sm:text-sm"
              >
                Save 30% 🔥
              </Chip>
            </div>
          }
        />
        <Tab key={FrequencyEnum.Monthly} title="Pay Monthly" />
        <Tab key={FrequencyEnum.OneTime} title="Pay as you go" />
      </Tabs>
      <Spacer y={8} />
      {/* <Countdown /> */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-8 md:mx-0">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            isBlurred
            className={cn("bg-white p-3 border-1 border-blue-300", {
              "border-blue-500": tier.mostPopular,
            })}
            shadow="md"
          >
            {tier.mostPopular ? (
              <Chip
                className="absolute right-4 top-4 bg-blue-500 text-white"
                color="secondary"
                variant="flat"
              >
                Most Popular
              </Chip>
            ) : null}
            <CardHeader className="flex flex-col items-start gap-2 pb-6">
              <h3 className="text-large font-medium">{tier.title}</h3>
              {/* <p className="text-medium text-default-500">{tier.description}</p> */}
            </CardHeader>
            <Divider />
            <CardBody className="gap-8">
              <p className="flex items-baseline gap-1 pt-2">
                {typeof tier.price !== "string" &&
                  tier.previousPrice?.[selectedFrequency.key] && (
                    <span className="text-xl line-through text-default-400">
                      {tier.previousPrice[selectedFrequency.key]}
                    </span>
                  )}
                <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent">
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[selectedFrequency.key]}
                </span>
                {typeof tier.price !== "string" ? (
                  <span className="text-small font-medium text-default-400">
                    {tier.priceSuffix
                      ? `/${tier.priceSuffix}/${selectedFrequency.priceSuffix}`
                      : `/${selectedFrequency.priceSuffix}`}
                  </span>
                ) : null}
              </p>
              <ul className="flex flex-col gap-2">
                {tier.features?.[selectedFrequency.key].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icon
                      className="text-indigo-500"
                      icon="ci:check"
                      width={24}
                    />
                    <p className="text-default-500">{feature}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              {loading ? (
                <Button fullWidth isLoading>
                  Loading...
                </Button>
              ) : (
                <Button
                  fullWidth
                  as={Link}
                  className={`${
                    tier.buttonText === "Coming Soon"
                      ? "bg-gray-500 opacity-50 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white`}
                  href={tier.href}
                  variant={tier.buttonVariant}
                  isDisabled={tier.buttonText === "Coming Soon"}
                  onPress={() =>
                    tier.buttonText !== "Coming Soon" &&
                    handleCheckout(
                      tier.id[selectedFrequency.key],
                      tier.amount[selectedFrequency.key],
                      tier.interval[selectedFrequency.key]
                    )
                  }
                >
                  {tier.buttonText}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
