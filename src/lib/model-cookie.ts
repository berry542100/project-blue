import { MODEL_COOKIE_NAME, resolveModelId, type ModelId } from "@/config/models";
import { cookies } from "next/headers";

export const MODEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function readModelFromCookie(): Promise<ModelId> {
  const cookieStore = await cookies();
  const value = cookieStore.get(MODEL_COOKIE_NAME)?.value;
  return resolveModelId(value);
}
