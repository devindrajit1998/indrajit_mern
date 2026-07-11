import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await addDoc(collection(db, "contact_messages"), {
        name: data.name,
        email: data.email,
        message: data.message,
        created_at: new Date().toISOString(),
      });
      return { ok: true as const };
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
      throw new Error(error instanceof Error ? error.message : "Failed to save message to database");
    }
  });

