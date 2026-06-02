const CLOUD_NAME = 'dzcgfmw7v';
const TAG = 'ourBrides';

fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('wedding-gallery');
    const imageUrls = [];

    data.resources.forEach((img, index) => {
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.${img.format}`;
      imageUrls.push(url);

      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'פתח תמונה ' + (index + 1));
      item.onclick = () => openLightbox(index);
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
      item.innerHTML = `<img src="${url}" alt="כלה ${index + 1}" loading="lazy">`;
      gallery.appendChild(item);
    });

    window.__cloudinaryImages = imageUrls;
  });
