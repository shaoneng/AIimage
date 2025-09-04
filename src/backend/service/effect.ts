
import { Effect } from "@/backend/type/type";
import { listByType } from "@/backend/models/effect";
import { getById } from "@/backend/models/effect";

export async function listEffectByType(type: number): Promise<Effect[]> {
  return await listByType(type);
}

export async function getEffectById(id: number): Promise<Effect | null> {
  const effect = await getById(id);
  return effect;
}
