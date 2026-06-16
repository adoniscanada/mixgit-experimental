import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifySession();

    await connectDB();

    const body = await request.json();

    const existingUser = await User.findById(session.userId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body.imagePath === null && existingUser.imagePath) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: existingUser.imagePath,
        }),
      );
    }

    const user = await User.findByIdAndUpdate(
      session.userId,
      {
        imagePath: body.imagePath,
      },
      {
        new: true,
      },
    );

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Avatar update error:", error);

    return NextResponse.json(
      {
        error: "Failed to update avatar",
      },
      {
        status: 500,
      },
    );
  }
}
