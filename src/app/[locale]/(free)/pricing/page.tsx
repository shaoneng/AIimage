import Price from "@/components/price/app";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "Pricing.seo", "pricing");
}

export default function () {
  return (
    <div className="flex flex-col items-center px-3 md:px-0 mb-24 pt-16 md:pt-24">
      <div className="flex flex-col items-center w-full max-w-7xl mx-10">
        <Price />
      </div>
    </div>
  );
}
