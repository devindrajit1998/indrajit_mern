import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const uploadSchema = z.object({
  fileBase64: z.string(),
  fileName: z.string(),
});

export const uploadToImageKit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data }) => {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.replace(/^["']|["']$/g, "");
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.replace(/^["']|["']$/g, "");
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/^["']|["']$/g, "");

    if (!privateKey) {
      throw new Error("IMAGEKIT_PRIVATE_KEY is not configured on the server.");
    }

    try {
      const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

      const formData = new FormData();
      formData.append("file", data.fileBase64);
      formData.append("fileName", data.fileName);
      formData.append("useUniqueFileName", "true");

      const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ImageKit API failed:", errorText);
        let errMsg = response.statusText;
        try {
          const parsed = JSON.parse(errorText);
          errMsg = parsed.message || errMsg;
        } catch {}
        throw new Error(`ImageKit upload failed: ${errMsg} (${response.status})`);
      }

      const result = await response.json();
      return {
        ok: true,
        url: result.url as string,
        fileId: result.fileId as string,
        name: result.name as string,
      };
    } catch (error) {
      console.error("Error in uploadToImageKit server function:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to upload file to ImageKit");
    }
  });
