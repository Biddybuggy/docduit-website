import { z } from 'zod';
import {
  MAX_CHAT_HISTORY_ITEM_LENGTH,
  MAX_CHAT_HISTORY_ITEMS,
  MAX_CHAT_MESSAGE_LENGTH,
  detectPromptInjection,
  sanitizeUserMessage,
} from '../sanitize-ai-input';

const historyItemSchema = z.object({
  pertanyaan: z
    .string()
    .trim()
    .min(1)
    .max(MAX_CHAT_HISTORY_ITEM_LENGTH)
    .transform(sanitizeUserMessage),
  jawaban: z
    .string()
    .trim()
    .min(1)
    .max(MAX_CHAT_HISTORY_ITEM_LENGTH)
    .transform(sanitizeUserMessage),
});

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(MAX_CHAT_MESSAGE_LENGTH, 'Message is too long')
    .transform(sanitizeUserMessage)
    .refine((value) => !detectPromptInjection(value), {
      message: 'Message contains disallowed instruction patterns.',
    }),
  userId: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9._-]+$/, 'Invalid userId format')
    .optional(),
  history: z.array(historyItemSchema).max(MAX_CHAT_HISTORY_ITEMS).optional(),
  stream: z.boolean().optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export const singleChatRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Question is required')
    .max(MAX_CHAT_MESSAGE_LENGTH, 'Question is too long')
    .transform(sanitizeUserMessage)
    .refine((value) => !detectPromptInjection(value), {
      message: 'Question contains disallowed instruction patterns.',
    }),
  conversation_id: z.string().trim().max(128).nullable().optional(),
});

export type SingleChatRequestInput = z.infer<typeof singleChatRequestSchema>;
