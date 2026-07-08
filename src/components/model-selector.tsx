"use client";

import {
  DEFAULT_MODEL_ID,
  MODELS,
  resolveModelId,
  type ModelId,
} from "@/config/models";
import {
  getSelectedModelId,
  setSelectedModelId,
} from "@/lib/model-cookie-client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ModelSelector() {
  const t = useTranslations("models");
  const [selectedModel, setSelectedModel] = useState<ModelId>(DEFAULT_MODEL_ID);

  useEffect(() => {
    setSelectedModel(getSelectedModelId());
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const modelId = resolveModelId(event.target.value);
    setSelectedModel(modelId);
    setSelectedModelId(modelId);
  }

  return (
    <select
      value={selectedModel}
      onChange={handleChange}
      aria-label={t("selectorLabel")}
      className="max-w-[7.5rem] cursor-pointer truncate rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-white/60 outline-none transition-colors hover:border-white/[0.14] hover:text-white/80 focus:border-[#3B82F6]/45 focus:text-white/80 sm:max-w-[8.5rem]"
    >
      {MODELS.map((model) => (
        <option
          key={model.id}
          value={model.id}
          className="bg-[#050816] text-white"
        >
          {t(model.labelKey)}
        </option>
      ))}
    </select>
  );
}
