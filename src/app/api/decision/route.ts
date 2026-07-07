import { NextResponse } from "next/server";
import {
  AIConfigurationError,
  AIUpstreamError,
  logAIError,
} from "@/lib/ai/errors";
import { callAI } from "@/lib/ai/provider";
import { parseAIDecisionResult } from "@/lib/ai/parse-response";

export const runtime = "nodejs";
export const maxDuration = 60;

type DecisionRequestBody = {
  input?: string;
};

type ErrorResponse = {
  success: false;
  message: string;
  code?: string;
  detail?: string;
};

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
  try {
    const body = (await req.json()) as DecisionRequestBody;
    const input = body.input?.trim();

    if (!input) {
      return buildErrorResponse("Input is required", 400, "INPUT_REQUIRED");
    }

    console.info(
      "[ProjectBlue AI]",
      JSON.stringify({
        event: "decision_request_start",
        model: "qwen",
        inputLength: input.length,
      }),
    );

    const rawResult = await callAI(input);
    const result = parseAIDecisionResult(rawResult);

    console.info(
      "[ProjectBlue AI]",
      JSON.stringify({
        event: "decision_request_success",
        model: "qwen",
        resultFields: Object.keys(result),
      }),
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    logAIError("api/decision", error, { model: "qwen" });

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
