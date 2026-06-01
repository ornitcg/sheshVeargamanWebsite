const CLOUD_NAME = 'dzcgfmw7v';
const TAG = 'ourBrides';

fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('wedding-gallery');
    data.resources.forEach((img, index) => {
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.${img.format}`;
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.onclick = () => openLightbox(index);
      item.innerHTML = `<img src="${url}" alt="כלה ${index + 1}" loading="lazy">`;
      gallery.appendChild(item);
    });
  });
