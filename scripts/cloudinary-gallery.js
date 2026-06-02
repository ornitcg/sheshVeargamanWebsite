const CLOUD_NAME = 'dzcgfmw7v';
const TAG = 'ourBrides';

fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('wedding-gallery');
    const imageUrls = [];

    var numCols = window.innerWidth <= 700 ? 2 : window.innerWidth <= 900 ? 3 : 4;
    var cols = [];
    for (var i = 0; i < numCols; i++) {
      var col = document.createElement('div');
      col.className = 'masonry-col';
      gallery.appendChild(col);
      cols.push(col);
    }

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

    data.resources.forEach(function(img, index) {
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
      cols[index % numCols].appendChild(item);
      observer.observe(item);
    });

    window.__cloudinaryImages = imageUrls;
  });
