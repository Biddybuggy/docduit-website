'use client';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

interface AuthButtonProps {
  vocabularies: any;
}

export default function AuthButton({ vocabularies }: AuthButtonProps) {
  const router = useRouter();
  const params = useParams();
  const {
    common: { signIn },
  } = vocabularies;

  const lang = (params.lang as string) === 'id' ? 'id' : 'en';
  const goToMaintenance = () => router.push(`/${lang}/under-maintenance`);

  return (
    <Button variant='red' onClick={goToMaintenance}>
      {signIn}
    </Button>
  );
}
