import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  MODEL_COOKIE_NAME,
  resolveModelId,
  type ModelId,
} from "@/config/models";
import {
  AIConfigurationError,
  AIUpstreamError,
  logAIError,
} from "@/lib/ai/errors";
import { callAI } from "@/lib/ai/provider";
import { parseAIDecisionResult } from "@/lib/ai/parse-response";
import { MODEL_COOKIE_MAX_AGE } from "@/lib/model-cookie";

export const runtime = "nodejs";
export const maxDuration = 60;

type DecisionRequestBody = {
  input?: string;
  model?: string;
};

type ErrorResponse = {
  success: false;
  message: string;
  code?: string;
  detail?: string;
};

function resolveRequestModel(
  bodyModel: string | undefined,
  cookieModel: string | undefined,
): ModelId {
  return resolveModelId(bodyModel ?? cookieModel);
}

function buildErrorResponse(
  message: string,
  status: number,
  code?: string,
  detail?: string,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(code ? { code } : {}),
      ...(detail ? { detail } : {}),
    },
    { status },
  );
}

export async function POST(req: Request) {
  let modelId: ModelId | undefined;

  try {
    const body = (await req.json()) as DecisionRequestBody;
    const input = body.input?.trim();

    if (!input) {
      return buildErrorResponse("Input is required", 400, "INPUT_REQUIRED");
    }

    const cookieStore = await cookies();
    const cookieModel = cookieStore.get(MODEL_COOKIE_NAME)?.value;
    modelId = resolveRequestModel(body.model, cookieModel);

    console.info(
      "[ProjectBlue AI]",
      JSON.stringify({
        event: "decision_request_start",
        modelId,
        inputLength: input.length,
      }),
    );

    const rawResult = await callAI(input, modelId);
    const result = parseAIDecisionResult(rawResult);

    console.info(
      "[ProjectBlue AI]",
      JSON.stringify({
        event: "decision_request_success",
        modelId,
        resultFields: Object.keys(result),
      }),
    );

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
    logAIError("api/decision", error, { modelId });

    if (error instanceof AIConfigurationError) {
      return buildErrorResponse(
        "AI service is not configured",
        503,
        error.code,
        error.message,
      );
    }

    if (error instanceof AIUpstreamError) {
      return buildErrorResponse("AI request failed", 502, error.code);
    }

    if (error instanceof SyntaxError) {
      return buildErrorResponse(
        "Invalid AI response format",
        500,
        "AI_PARSE_ERROR",
      );
    }

    return buildErrorResponse("AI request failed", 500, "AI_REQUEST_FAILED");
  }
}
