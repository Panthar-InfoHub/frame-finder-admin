"use server";

import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.PROJECT_ID!,
  credentials: {
    client_email: process.env.CLIENT_EMAIL!,
    private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

interface BaseOptions {
  filename: string;
  contentType: string;
}

interface VendorOptions extends BaseOptions {
  rootFolder: "vendor";
  folderName: "frames" | "sunglasses" | "lens-packages" | "logo" | "banner";
}
interface UserOptions extends BaseOptions {
  rootFolder: "user";
  folderName: "profile" | "documents";
}
export type SignedUrlOptions = VendorOptions | UserOptions;
export type CloudfoldersType =
  | Omit<VendorOptions, keyof BaseOptions>
  | Omit<UserOptions, keyof BaseOptions>;

export async function getSignedUploadUrl({
  filename,
  contentType,
  rootFolder,
  folderName,
}: SignedUrlOptions) {
  const bucket = storage.bucket(process.env.BUCKET_NAME!);
  const file = bucket.file(`${rootFolder}/${folderName}/${Date.now()}-${filename}`);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000, // valid 5 min
    contentType,
  });

  return { url, path: file.name }; // return signed URL + final file path
}

export async function getSignedViewUrl(url: string) {
  try {
    const bucket = storage.bucket(process.env.BUCKET_NAME!);

    const file = bucket.file(url);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // valid for 1 hour
    });

    return signedUrl;
  } catch (error) {
    return url;
  }
}
