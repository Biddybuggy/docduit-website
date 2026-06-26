import { z } from 'zod';

export const MAX_INVOICE_FILES = 10;
export const MAX_INVOICE_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_INVOICE_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
]);

const ALLOWED_INVOICE_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.txt',
  '.csv',
  '.png',
  '.jpg',
  '.jpeg',
]);

export const invoiceWorkflowFormSchema = z.object({
  execute: z.enum(['true', 'false']).optional(),
  lang: z.enum(['en', 'id']).optional(),
  calendar: z.enum(['true', 'false']).optional(),
  csv: z.enum(['true', 'false']).optional(),
  fileIds: z
    .string()
    .trim()
    .max(2048)
    .optional()
    .transform((value) => {
      if (!value) return [] as string[];

      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];

        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, MAX_INVOICE_FILES);
      } catch {
        return [];
      }
    }),
});

export function isAllowedInvoiceFile(file: File): boolean {
  if (file.size <= 0 || file.size > MAX_INVOICE_FILE_BYTES) {
    return false;
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = [...ALLOWED_INVOICE_EXTENSIONS].some((ext) =>
    lowerName.endsWith(ext),
  );

  if (!hasAllowedExtension) {
    return false;
  }

  if (file.type && !ALLOWED_INVOICE_MIME_TYPES.has(file.type.toLowerCase())) {
    // Some browsers send empty or generic MIME types; allow if extension matches.
    return hasAllowedExtension;
  }

  return true;
}

export function sanitizeInvoiceFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 180);
}
