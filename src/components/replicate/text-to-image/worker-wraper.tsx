import Worker from "@/components/replicate/text-to-image/worker";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";

export default async function WorkerWraper(params: {
  effectId: string;
  multiLanguage: string;
  outputDefaultImage: string;
}) {
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  if (!effect) return null;
  return (
    <div className="flex flex-col w-full p-4 max-w-7xl rounded-lg mt-6">
      <Worker
        model={effect.model}
        effect_link_name={effect.link_name}
        version={effect.version}
        credit={effect.credit}
        defaultImage={params.outputDefaultImage}
        lang={params.multiLanguage}
      />
    </div>
  );
}
