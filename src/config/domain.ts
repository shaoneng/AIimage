export type DomainConfig = typeof domainConfig;

export const domainConfig = {
  main: process.env.NEXT_PUBLIC_DOMAIN || "https://xxxx.com",
};

export const getDomain = () => domainConfig.main;