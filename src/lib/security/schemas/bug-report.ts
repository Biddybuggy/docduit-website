import { z } from 'zod';
import { sanitizeUserMessage } from '../sanitize-ai-input';

export const MAX_BUG_REPORT_LENGTH = 4000;
// Vercel serverless functions cap the request body at ~4.5MB; keep margin so a
// screenshot plus the form fields stay under the limit.
export const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024;

export function isAllowedScreenshot(file: File): boolean {
  return file.type.startsWith('image/') && file.size <= MAX_SCREENSHOT_BYTES;
}

export const bugReportSchema = z.object({
  type: z.enum(['bug', 'idea', 'other']).default('bug'),
  description: z
    .string()
    .trim()
    .min(1, 'Please describe the issue.')
    .max(MAX_BUG_REPORT_LENGTH, 'Description is too long.')
    .transform(sanitizeUserMessage),
  // Optional contact email. Empty string is treated as "not provided".
  email: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().email('Enter a valid email.').max(320).optional(),
  ),
  pageUrl: z.string().trim().max(2048).optional(),
  locale: z.enum(['en', 'id']).optional(),
  userAgent: z.string().trim().max(1024).optional(),
  // Honeypot: real users never fill this. Bots that autofill every field will.
  // Kept lax here so the route can silently drop (200 OK) rather than 400.
  website: z.string().max(200).optional(),
});

export type BugReportInput = z.infer<typeof bugReportSchema>;
