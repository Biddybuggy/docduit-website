'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='id'>
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          backgroundColor: '#f9fafb',
          color: '#111827',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Terjadi Kesalahan
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#1e293b',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
