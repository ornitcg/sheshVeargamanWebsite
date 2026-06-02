const CLOUD_NAME = 'dzcgfmw7v';
const TAG = 'ourBrides';

fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('wedding-gallery');
    const imageUrls = [];

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const imgEl = entry.target.querySelector('img');
        if (imgEl.complete) {
          imgEl.classList.add('loaded');
        } else {
          imgEl.addEventListener('load',  function() { imgEl.classList.add('loaded'); });
          imgEl.addEventListener('error', function() { imgEl.classList.add('loaded'); });
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

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
      observer.observe(item);
    });

    window.__cloudinaryImages = imageUrls;

    var msnry = new Masonry(gallery, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: true,
      gutter: 14
    });

    imagesLoaded(gallery, function() {
      msnry.layout();
    });
  });
