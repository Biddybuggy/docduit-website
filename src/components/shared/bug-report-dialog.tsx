'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

// Fired by the footer "Report a bug" link (and any other trigger) to open this
// root-mounted dialog, mirroring OPEN_ONBOARDING_EVENT.
export const OPEN_BUG_REPORT_EVENT = 'docduit-open-bug-report';

const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024;

type ReportType = 'bug' | 'idea' | 'other';

// Strings live in-component (keyed by locale from the path) because this dialog
// is mounted in the non-localized root layout, same as OnboardingModal.
const CONTENT: Record<
  'id' | 'en',
  {
    title: string;
    description: string;
    types: Record<ReportType, string>;
    detailsLabel: string;
    detailsPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    screenshotLabel: string;
    submit: string;
    submitting: string;
    success: string;
    errorGeneric: string;
    errorEmpty: string;
    errorImageType: string;
    errorImageSize: string;
  }
> = {
  id: {
    title: 'Laporkan bug',
    description:
      'Menemukan yang tidak beres atau punya masukan? Beri tahu kami. Halaman dan info browser ikut terlampir otomatis.',
    types: { bug: 'Bug', idea: 'Ide', other: 'Lainnya' },
    detailsLabel: 'Apa yang terjadi?',
    detailsPlaceholder: 'Jelaskan masalah atau masukanmu…',
    emailLabel: 'Email (opsional)',
    emailPlaceholder: 'email@kamu.com',
    screenshotLabel: 'Lampirkan tangkapan layar (opsional)',
    submit: 'Kirim laporan',
    submitting: 'Mengirim…',
    success: 'Terima kasih! Laporanmu sudah terkirim.',
    errorGeneric: 'Gagal mengirim laporan. Coba lagi nanti.',
    errorEmpty: 'Mohon jelaskan masalahnya terlebih dahulu.',
    errorImageType: 'File harus berupa gambar.',
    errorImageSize: 'Ukuran gambar maksimal 3 MB.',
  },
  en: {
    title: 'Report a bug',
    description:
      'Found something broken or have feedback? Let us know. The page and browser info are attached automatically.',
    types: { bug: 'Bug', idea: 'Idea', other: 'Other' },
    detailsLabel: 'What happened?',
    detailsPlaceholder: 'Describe the issue or your feedback…',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'you@email.com',
    screenshotLabel: 'Attach a screenshot (optional)',
    submit: 'Send report',
    submitting: 'Sending…',
    success: 'Thanks! Your report has been sent.',
    errorGeneric: 'Could not send your report. Please try again later.',
    errorEmpty: 'Please describe the issue first.',
    errorImageType: 'The file must be an image.',
    errorImageSize: 'The image must be 3 MB or smaller.',
  },
};

export function BugReportDialog() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] === 'en' ? 'en' : 'id';
  const t = CONTENT[locale];

  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ReportType>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Open on the custom event from the footer/header triggers.
  useEffect(() => {
    const openDialog = () => setOpen(true);
    window.addEventListener(OPEN_BUG_REPORT_EVENT, openDialog);
    return () => window.removeEventListener(OPEN_BUG_REPORT_EVENT, openDialog);
  }, []);

  // Prefill the email for signed-in users when the dialog opens.
  useEffect(() => {
    if (open && !email && user?.email) setEmail(user.email);
  }, [open, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setType('bug');
    setDescription('');
    setWebsite('');
    if (fileRef.current) fileRef.current.value = '';
    // Keep the email prefill; clear it only if it wasn't from the session.
    if (!user?.email) setEmail('');
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error(t.errorEmpty);
      return;
    }

    const file = fileRef.current?.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t.errorImageType);
        return;
      }
      if (file.size > MAX_SCREENSHOT_BYTES) {
        toast.error(t.errorImageSize);
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('description', description);
      if (email.trim()) formData.append('email', email.trim());
      formData.append('pageUrl', window.location.href);
      formData.append('locale', locale);
      formData.append('userAgent', navigator.userAgent);
      formData.append('website', website);
      if (file) formData.append('screenshot', file);

      const res = await fetch('/api/bug-report', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || t.errorGeneric);
        return;
      }

      toast.success(t.success);
      reset();
      setOpen(false);
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            {(['bug', 'idea', 'other'] as ReportType[]).map((option) => (
              <button
                key={option}
                type='button'
                onClick={() => setType(option)}
                className={`flex-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  type === option
                    ? 'border-docduit-blue bg-docduit-blue text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t.types[option]}
              </button>
            ))}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='bug-report-details'>{t.detailsLabel}</Label>
            <Textarea
              id='bug-report-details'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.detailsPlaceholder}
              maxLength={4000}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='bug-report-email'>{t.emailLabel}</Label>
            <Input
              id='bug-report-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='bug-report-screenshot'>{t.screenshotLabel}</Label>
            <Input
              id='bug-report-screenshot'
              ref={fileRef}
              type='file'
              accept='image/*'
              className='cursor-pointer py-1.5 text-sm'
            />
          </div>

          {/* Honeypot: hidden from users, tempting to bots. */}
          <input
            type='text'
            tabIndex={-1}
            autoComplete='off'
            aria-hidden='true'
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className='hidden'
          />

          <Button
            variant='blue'
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
          >
            {loading ? t.submitting : t.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
