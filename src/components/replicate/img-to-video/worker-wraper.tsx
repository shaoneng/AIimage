import Worker from "@/components/replicate/img-to-video/worker";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";

export default async function WorkerWraper(params: {
  effectId: string;
  promotion: string;
  lang: string;
}) {
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  if (!effect) return null;
  return (
    <div className="flex flex-col w-full max-w-7xl rounded-lg md:mt-6 ">
      <Worker
        model={effect?.model}
        credit={effect?.credit}
        version={effect?.version}
        effect_link_name={effect?.link_name}
        prompt={effect?.pre_prompt}
        promotion={params.promotion}
        lang={params.lang}
      />
    </div>
  );
}
