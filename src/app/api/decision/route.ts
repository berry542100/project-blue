import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  MODEL_COOKIE_NAME,
  resolveModelId,
  type ModelId,
} from "@/config/models";
import { callAI } from "@/lib/ai/provider";
import { parseAIDecisionResult } from "@/lib/ai/parse-response";
import { MODEL_COOKIE_MAX_AGE } from "@/lib/model-cookie";

type DecisionRequestBody = {
  input?: string;
  model?: string;
};

function resolveRequestModel(
  bodyModel: string | undefined,
  cookieModel: string | undefined,
): ModelId {
  return resolveModelId(bodyModel ?? cookieModel);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DecisionRequestBody;
    const input = body.input?.trim();

    if (!input) {
      return NextResponse.json(
        { success: false, message: "Input is required" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const cookieModel = cookieStore.get(MODEL_COOKIE_NAME)?.value;
    const modelId = resolveRequestModel(body.model, cookieModel);
    const rawResult = await callAI(input, modelId);
    const result = parseAIDecisionResult(rawResult);

    const response = NextResponse.json({
      success: true,
      result,
      model: modelId,
    });

    response.cookies.set(MODEL_COOKIE_NAME, modelId, {
      path: "/",
      maxAge: MODEL_COOKIE_MAX_AGE,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);

    const message =
      error instanceof SyntaxError
        ? "Invalid AI response format"
        : "AI request failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      },
    );
  }
}
