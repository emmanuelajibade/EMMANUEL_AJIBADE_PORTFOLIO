import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim();
  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
  const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim();

  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json(
      { error: "Missing ImageKit env vars" },
      { status: 500 }
    );
  }

  
  try {
    const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
    const params = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      token: params.token,
      signature: params.signature,
      expire: params.expire,
    });
  } catch (error) {
    console.error("ImageKit auth generation failed:", error);
    return NextResponse.json(
      { error: "ImageKit auth generation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "portfolio/uploads",
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    return NextResponse.json(
      { error: "ImageKit direct upload failed" },
      { status: 500 }
    );
  }
}