import { EffectResult } from "../type";

export interface EffectResultInfo {
  result_id: string;
  original_id: string;
  user_id: string;
  effect_id: number;
  effect_name: string;
  prompt: string;
  url: string;
  running_time: number;
  status: string;
  credit: number;
  created_at: Date;
}

export function toEffectResultInfo(
  effectResult: EffectResult
): EffectResultInfo {
  return {
    result_id: effectResult.result_id,
    original_id: effectResult.original_id,
    user_id: effectResult.user_id,
    effect_id: effectResult.effect_id,
    effect_name: effectResult.effect_name,
    prompt: effectResult.prompt,
    url: effectResult.url,
    running_time: effectResult.running_time,
    status: effectResult.status,
    credit: effectResult.credit,
    created_at: effectResult.created_at,
  };
}

export function toEffectResultInfos(
  effectResults: EffectResult[]
): EffectResultInfo[] {
  return effectResults.map(toEffectResultInfo);
}
