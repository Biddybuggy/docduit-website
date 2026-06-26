import Link from 'next/link';

export default function NotFound() {
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
          <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            404
          </h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Halaman Tidak Ditemukan
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <Link
            href='/id'
            style={{
              backgroundColor: '#1e293b',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </body>
    </html>
  );
}
