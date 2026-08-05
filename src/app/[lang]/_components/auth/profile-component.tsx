'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn, getInitials } from '@/lib/utils';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { User } from './authentication-section';
import { mutate } from 'swr';

interface ProfileComponentProps {
  vocabularies: any;
  userInfo: User | null;
  /**
   * Desktop header packs a lot in already, so there the trigger is the avatar
   * alone — name and email still show inside the dropdown. The mobile sheet has
   * room, so it keeps the full chip.
   */
  compact?: boolean;
}

export default function ProfileComponent({
  vocabularies,
  userInfo,
  compact = false,
}: ProfileComponentProps) {
  const { logout } = useAuth();
  const {
    common: { signOut },
  } = vocabularies;

  const router = useRouter();

  const params = useParams();
  const lang = params.lang as string;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          title={compact ? userInfo?.fullname : undefined}
          aria-label={compact ? userInfo?.fullname : undefined}
          className={cn(
            'flex items-center cursor-pointer hover:bg-black/15 rounded-lg',
            compact ? 'gap-1 p-1.5' : 'gap-1 p-4',
          )}
        >
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={userInfo?.picture} alt={userInfo?.fullname} />
            <AvatarFallback className='rounded-lg text-black'>
              {getInitials(userInfo?.fullname || '')}
            </AvatarFallback>
          </Avatar>
          {compact ? null : (
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {userInfo?.fullname}
              </span>
              <span className='truncate text-xs'>{userInfo?.username}</span>
            </div>
          )}
          <ChevronsUpDown className='size-4 shrink-0' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
        side='bottom'
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={userInfo?.picture} alt={userInfo?.fullname} />
              <AvatarFallback className='rounded-lg'>
                {getInitials(userInfo?.fullname || '')}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{userInfo?.fullname}</span>
              <span className='truncate text-xs'>{userInfo?.username}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            mutate('user-info', null, false);
            router.push(`/${lang}`);
          }}
        >
          <LogOut />
          {signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
