import html2canvas from 'html2canvas';

export const handleDownloadImage = async (id: string, fileName?: string) => {
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
        // Complete if all images have been checked
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
    // Callers are expected to pass a localized `fileName`; this is only a
    // language-neutral fallback.
    link.download = fileName ?? 'Docduit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};
