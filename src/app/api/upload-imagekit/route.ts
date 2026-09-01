import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();

    if (!privateKey) {
      return NextResponse.json({ error: "Missing ImageKit private key" }, { status: 500 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("fileName", file.name);
    uploadFormData.append("folder", "portfolio/uploads");

    const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
      body: uploadFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ImageKit direct API upload failed:", data);
      return NextResponse.json(
        { error: data?.message || "ImageKit direct upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("ImageKit direct upload failed:", error);
    return NextResponse.json(
      { error: "ImageKit direct upload failed" },
      { status: 500 }
    );
  }
}
