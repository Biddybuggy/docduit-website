'use client';

import { usePathname } from 'next/navigation';
import { Bug } from 'lucide-react';
import { OPEN_BUG_REPORT_EVENT } from '@/components/shared/bug-report-dialog';

// Discreet footer trigger that opens the root-mounted BugReportDialog via a
// window event (same pattern as the header "Take a tour" button).
export default function ReportBugLink() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] === 'en' ? 'en' : 'id';
  const label = locale === 'en' ? 'Report a bug' : 'Laporkan bug';

  return (
    <button
      type='button'
      onClick={() => window.dispatchEvent(new Event(OPEN_BUG_REPORT_EVENT))}
      className='flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline'
    >
      <Bug className='h-4 w-4' />
      {label}
    </button>
  );
}
