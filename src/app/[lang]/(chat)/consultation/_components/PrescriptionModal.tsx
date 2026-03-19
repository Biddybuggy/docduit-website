'use client';

import { handleDownloadImage } from '@/lib/handleDownloadImage';
import { Download, X, Loader, Dot } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export interface IResep {
  profile?: string;
  text?: string;
  allocation?: string[];
}

interface PrescriptionModalProps {
  onClose: () => void;
  resep: IResep;
  isMarried: boolean;
}

const PrescriptionModal = ({
  onClose,
  resep,
  isMarried,
}: PrescriptionModalProps) => {
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const handleDownload = () => {
    try {
      setDownloadLoading(true);
      handleDownloadImage('resep');
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const bagCount = isMarried ? 6 : 3;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-50 overflow-y-auto p-4 sm:p-10'>
      <div className='w-full max-w-full sm:max-w-[450px] mt-4 pt-8'>
        <div className='w-full flex items-center justify-between mb-2 px-4 bg-inherit'>
          {downloadLoading ? (
            <Loader className='animate-spin' />
          ) : (
            <Download onClick={handleDownload} className='cursor-pointer' />
          )}
          <X onClick={onClose} className='cursor-pointer' />
        </div>

        <div className='bg-[#f9e9ab]' id='resep'>
          <h2 className='text-lg sm:text-3xl font-bold text-center pt-6'>
            PRESCRIPTION
          </h2>
          <h3 className='text-base sm:text-xl font-semibold text-center'>
            Docduit - Dokter Urusan Duit
          </h3>

          <div className='mt-4 border-t-4 border-black p-4 sm:p-6'>
            {resep.profile ? (
              <p className='text-base sm:text-xl text-center'>
                Profile Resiko:{' '}
                <span className='font-semibold'>{resep.profile}</span>
              </p>
            ) : (
              <h4 className='text-sm sm:text-base font-semibold text-center'>
                KOMENTAR
              </h4>
            )}
            <div
              className={`mt-2 ${resep.profile ? 'text-left' : 'text-center'}`}
            >
              <p className='text-sm sm:text-base'>{resep.text}</p>
            </div>

            {resep.allocation && resep.allocation.length > 0 && (
              <div className='mt-4 text-left'>
                <p className='font-semibold text-sm sm:text-base'>Alokasi:</p>
                <div className='mt-1'>
                  {resep.allocation.map((item, index) => (
                    <div key={index} className='text-sm sm:text-base'>
                      {'\u25CF'} {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='mt-4 text-center border-t-4 border-black p-4 sm:p-6'>
            {[...Array(bagCount)].map((_, index) => (
              <span key={index} className='inline-block mx-1'>
                <Image
                  src={'/illustrations/resep/bag.svg'}
                  width={35}
                  height={35}
                  className='sm:w-[50px] sm:h-[50px]'
                  alt={'bag'}
                />
              </span>
            ))}
            <div className='mt-4'>
              <p className='text-sm sm:text-base'>
                {`Kamu sebaiknya punya simpanan dana darurat sebesar ${bagCount}x gaji bulanan`}
              </p>
            </div>
          </div>

          <div className='mt-4 text-center border-t-4 border-black p-4 sm:p-6'>
            <div className='flex justify-center items-end gap-6'>
              <div className='flex flex-col items-center gap-4'>
                <Image
                  src={'/illustrations/resep/tabungan1.svg'}
                  width={65}
                  height={65}
                  className='sm:w-[80px] sm:h-[80px]'
                  alt={'bag1'}
                />
                <p className='font-semibold text-sm sm:text-base'>
                  Rekening Tabungan
                </p>
              </div>
              <div className='flex flex-col items-center gap-4'>
                <Image
                  src={'/illustrations/resep/tabungan2.svg'}
                  width={69}
                  height={69}
                  className='sm:w-[84px] sm:h-[84px]'
                  alt={'bag2'}
                />
                <p className='font-semibold text-sm sm:text-base'>
                  Rekening Transaksi
                </p>
              </div>
            </div>
            <p className='mt-2 text-sm sm:text-base'>
              Penting untuk memiliki dua rekening terpisah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
