import html2canvas from 'html2canvas';

export const handleDownloadImage = async (id: string) => {
  try {
    const element = document.getElementById(id) as HTMLElement;

    await new Promise((resolve) => {
      const images = element.getElementsByTagName('img');
      let loaded = 0;
      if (images.length === 0) {
        resolve(true);
        return;
      }
      Array.from(images).forEach((img) => {
        if (img.complete && img.naturalHeight > 0) {
          loaded++;
        } else {
          img.onload = () => {
            loaded++;
            if (loaded === images.length) resolve(true);
          };
          img.onerror = () => {
            loaded++;
            if (loaded === images.length) resolve(true);
          };
        }
        // Selesaikan jika semua gambar sudah dicek
        if (loaded === images.length) resolve(true);
      });
    });

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const link = document.createElement('a');
    link.download = `Cetakan Hasil Kosultasi - ${new Date().toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      },
    )} WIB.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};
