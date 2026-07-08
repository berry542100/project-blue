"use client";

import {
  DEFAULT_MODEL_ID,
  MODEL_COOKIE_NAME,
  resolveModelId,
  type ModelId,
} from "@/config/models";

export const MODEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function getSelectedModelId(): ModelId {
  if (typeof document === "undefined") {
    return DEFAULT_MODEL_ID;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${MODEL_COOKIE_NAME}=`));

  if (!match) {
    return DEFAULT_MODEL_ID;
  }

  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return resolveModelId(value);
}

export function setSelectedModelId(modelId: ModelId) {
  document.cookie = `${MODEL_COOKIE_NAME}=${encodeURIComponent(modelId)}; path=/; max-age=${MODEL_COOKIE_MAX_AGE}; SameSite=Lax`;
}
