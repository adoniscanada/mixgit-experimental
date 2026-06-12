import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import type { AIFeedback } from "@/types";
import { feedbackTool } from "@/lib/anthropic";
import { rawToPseudocode } from "@/lib/scratch-pseudocode";
import connectDB from "@/lib/db";
import RemixModel from "@/models/Remix";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  await verifySession();

  // projectJsonData can be very large to send over the network,
  // instead, user can send Remix id and we query from DB
  const { remixId } = await req.json();

  if (!remixId) {
    return NextResponse.json(
      { error: "No remix ID provided" },
      { status: 400 },
    );
  }

  await connectDB();
  const remix = await RemixModel.findById(remixId).lean();

  if (!remix) {
    return NextResponse.json({ error: "Remix not found" }, { status: 404 });
  }

  const projectJsonData =
    remix.files.find((f) => f.fileType === "logic")?.data ?? "";

  let pseudocode: string;
  try {
    pseudocode = rawToPseudocode(projectJsonData);
  } catch {
    pseudocode = projectJsonData;
  }

  let message: Anthropic.Message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      tools: [feedbackTool],
      tool_choice: { type: "tool", name: "submit_feedback" },
      system: [
        {
          type: "text",
          text: `
    You are an export Scratch mentor for young learners.
    You are given the pseudocode of a project.json file.
    You provide constructive feedback that is friendly and enthusiastic.
    You can use markdown for code snippets, bold, italics, etc.
    Your language can be understood by young learners, and you keep sentences consise.
    You do not include emojis in your feedback.
    `,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `
        Remix Name: "${remix.name}"
        Remix Description: "${remix.description}"
        project.json: ${pseudocode}
        `,
        },
      ],
    });
  } catch (err) {
    console.error("Anthropic message creation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 502 },
    );
  }

  const toolUse = message.content.find((b) => b.type === "tool_use");
  const feedback = toolUse?.input as AIFeedback;

  return NextResponse.json({ feedback });
}
