import ImageKit from "imagekit-javascript";

// Initialize ImageKit client with public key & URL endpoint
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

interface ImageKitAuthParams {
  token: string;
  signature: string;
  expire: number;
}

async function getImageKitAuthParams(): Promise<ImageKitAuthParams> {
  const response = await fetch("/api/imagekit-auth", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch ImageKit authentication parameters");
  }
  const params: ImageKitAuthParams = await response.json();
  if (!params.token || !params.signature || !params.expire) {
    throw new Error("ImageKit authentication response is incomplete");
  }
  return params;
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

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });
  const data: { secure_url?: string; error?: { message?: string } } = await res.json();
  if (!res.ok || data.error || !data.secure_url) {
    throw new Error(data.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  return data.secure_url;
}

export async function uploadToImageKit(file: File): Promise<string> {
  const authParams = await getImageKitAuthParams();
  const result = await imagekit.upload({
    file,
    fileName: file.name,
    folder: "portfolio/designs",
    token: authParams.token,
    signature: authParams.signature,
    expire: authParams.expire,
  });
  if (!result.url) {
    throw new Error("ImageKit did not return an uploaded image URL");
  }
  return result.url;
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