import Worker from "@/components/replicate/img-to-video/worker";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";

export default async function WorkerWraper(params: {
  effectId: string;
  promotion: string;
  lang: string;
}) {
  let effect: Effect | null = null;
  try {
    effect = await getEffectById(Number(params.effectId));
  } catch (_) {
    effect = null;
  }
  if (!effect) {
    effect = {
      id: 1,
      name: "Kling v2.1",
      type: 1,
      des: "",
      platform: "replicate",
      link: "https://replicate.com/kwaivgi/kling-v2.1/api",
      api: "kwaivgi/kling-v2.1",
      is_open: 1,
      link_name: "kling-v12",
      credit: 15,
      created_at: new Date(),
      model: "kwaivgi/kling-v2.1",
      version: "",
      pre_prompt: ""
    } as Effect;
  }
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
