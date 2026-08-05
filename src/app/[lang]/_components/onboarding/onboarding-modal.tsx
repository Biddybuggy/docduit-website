'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Calculator,
  LineChart,
  MessageCircleHeart,
  LucideIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Persisted so the welcome tour only ever auto-shows once per browser —
// including for logged-out / repeat visitors. Mirrors COOKIE_CONSENT_KEY.
export const ONBOARDING_SEEN_KEY = 'docduit_onboarding_seen';

// Dispatched by the header "Take a tour" button to re-open on demand,
// bypassing the seen flag (same pattern as the cookie-consent event).
export const OPEN_ONBOARDING_EVENT = 'docduit-open-onboarding';

type Step = { icon: LucideIcon; title: string; description: string };

// Strings live in-component (keyed by locale) because this modal is mounted in
// the non-localized root layout, which has no dictionary — same approach as
// the cookie-consent banner.
const CONTENT: Record<
  'id' | 'en',
  { steps: Step[]; skip: string; back: string; next: string; done: string }
> = {
  id: {
    skip: 'Lewati',
    back: 'Kembali',
    next: 'Lanjut',
    done: 'Mulai',
    steps: [
      {
        icon: Sparkles,
        title: 'Selamat datang di Docduit',
        description:
          'Solusi keuangan di ujung jari. Yuk kenali fitur-fitur utama yang bisa membantumu merencanakan keuangan.',
      },
      {
        icon: Calculator,
        title: 'Kalkulator Tabungan',
        description:
          'Hitung berapa yang perlu kamu tabung tiap bulan untuk liburan, kendaraan, pernikahan, gadget, dan lainnya.',
      },
      {
        icon: LineChart,
        title: 'Financial Twin Simulator',
        description:
          'Simulasikan masa depan keuanganmu dalam tiga skenario dan lihat langkah terbaik untuk mencapai tujuanmu.',
      },
      {
        icon: MessageCircleHeart,
        title: 'Konsultasi AI',
        description:
          'Ngobrol dengan asisten AI kami untuk mendapatkan “resep” keuangan yang sesuai dengan kondisimu.',
      },
    ],
  },
  en: {
    skip: 'Skip',
    back: 'Back',
    next: 'Next',
    done: 'Get started',
    steps: [
      {
        icon: Sparkles,
        title: 'Welcome to Docduit',
        description:
          'Financial solutions at your fingertips. Let’s walk through the main tools that help you plan your money.',
      },
      {
        icon: Calculator,
        title: 'Savings Calculators',
        description:
          'Work out how much to save each month for a vacation, a vehicle, a wedding, gadgets, and more.',
      },
      {
        icon: LineChart,
        title: 'Financial Twin Simulator',
        description:
          'Simulate your financial future across three scenarios and see the best moves to reach your goal.',
      },
      {
        icon: MessageCircleHeart,
        title: 'AI Consultation',
        description:
          'Chat with our AI assistant to get a financial “prescription” tailored to your situation.',
      },
    ],
  },
};

export function OnboardingModal() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] === 'en' ? 'en' : 'id';
  const content = CONTENT[locale];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // Auto-show once on first visit.
  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_SEEN_KEY)) {
        setOpen(true);
      }
    } catch {
      // Storage unavailable (private mode, etc.) — skip the auto tour.
    }
  }, []);

  // Manual re-open from the header button, regardless of the seen flag.
  useEffect(() => {
    const openTour = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(OPEN_ONBOARDING_EVENT, openTour);
    return () => window.removeEventListener(OPEN_ONBOARDING_EVENT, openTour);
  }, []);

  const markSeen = () => {
    try {
      localStorage.setItem(ONBOARDING_SEEN_KEY, 'yes');
    } catch {
      // ignore
    }
  };

  const finish = () => {
    markSeen();
    setOpen(false);
    setStep(0);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) finish();
    else setOpen(true);
  };

  const isLast = step === content.steps.length - 1;
  const current = content.steps[step];
  const Icon = current.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='items-center text-center sm:text-center'>
          <div className='mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-docduit-lightblue text-docduit-blue'>
            <Icon size={28} />
          </div>
          <DialogTitle className='text-center'>{current.title}</DialogTitle>
          <DialogDescription className='text-center'>
            {current.description}
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-center gap-2 py-2'>
          {content.steps.map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step
                  ? 'w-5 bg-docduit-blue'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <DialogFooter className='flex-row items-center justify-between gap-2 sm:justify-between'>
          {step === 0 ? (
            <Button variant='link' onClick={finish}>
              {content.skip}
            </Button>
          ) : (
            <Button variant='link' onClick={() => setStep((s) => s - 1)}>
              {content.back}
            </Button>
          )}
          <Button
            variant='blue'
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          >
            {isLast ? content.done : content.next}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
