import { z } from "zod";

export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPostSchema = z.object({
  content: z.string().min(1).max(400).trim(),
  image: z
    .any()
    .optional()
    .refine((file) => {
      return file?.size ?? 0 <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine((file) => {
      return file?.type ? ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type) : true;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>

