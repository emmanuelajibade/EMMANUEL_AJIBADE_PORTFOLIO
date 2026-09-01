import ImageKit from "imagekit-javascript";

// Initialize ImageKit client with public key & URL endpoint
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

async function getImageKitAuthParams() {
  const response = await fetch("/api/imagekit-auth", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch ImageKit authentication parameters");
  }
  return response.json();
}

export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video" = "image"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);
  if (resourceType === "video") formData.append("resource_type", "video");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url as string;
}

export async function uploadToImageKit(file: File): Promise<string> {
  try {
    // 1. Fetch fresh auth params
    const authParams = await getImageKitAuthParams();
    // 2. Upload using SDK
    const result = await imagekit.upload({
      file,
      fileName: file.name,
      folder: "portfolio/designs",
      token: authParams.token,
      signature: authParams.signature,
      expire: authParams.expire,
    });
    return result.url;
  } catch (err) {
    // Fallback to Cloudinary if ImageKit fails (e.g., DNS/network)
    console.error("ImageKit upload failed, using Cloudinary:", err);
    return uploadToCloudinary(file, "image");
  }
}

export async function uploadMultipleToCloudinary(
  files: File[],
  resourceType: "image" | "video" = "image"
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadToCloudinary(file, resourceType));
  }
  return urls;
}