const CLOUD_NAME = 'dzcgfmw7v';
const TAG = 'ourBrides';

fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('wedding-gallery');
    const imageUrls = [];
    const isEnglish = document.documentElement.lang === 'en';

    var numCols = window.innerWidth <= 700 ? 2 : window.innerWidth <= 900 ? 3 : 4;
    var cols = [];
    for (var i = 0; i < numCols; i++) {
      var col = document.createElement('div');
      col.className = 'masonry-col';
      gallery.appendChild(col);
      cols.push(col);
    }

    function getShortestCol() {
      return cols.reduce(function(min, col) {
        return col.offsetHeight < min.offsetHeight ? col : min;
      }, cols[0]);
    }

    data.resources.forEach(function(img, index) {
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.${img.format}`;
      imageUrls.push(url);

      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', (isEnglish ? 'Open image ' : 'פתח תמונה ') + (index + 1));
      item.onclick = function() { openLightbox(index); };
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
      const altText = isEnglish
        ? 'Modest bridal gown, bride ' + (index + 1)
        : 'כלה בשמלת כלה צנועה ' + (index + 1);
      item.innerHTML = '<img src="' + url + '" alt="' + altText + '" loading="lazy">';

      var imgEl = item.querySelector('img');

      // Place round-robin initially so the element is in the DOM
      // and lazy loading can trigger when scrolled into view
      cols[index % numCols].appendChild(item);

      imgEl.addEventListener('load', function() {
        // Image dimensions are now known — move to shortest column
        // The item is still invisible (opacity:0), so the move is seamless
        var shortest = getShortestCol();
        if (item.parentNode !== shortest) {
          shortest.appendChild(item);
        }
        imgEl.classList.add('loaded');
      });

      imgEl.addEventListener('error', function() {
        imgEl.classList.add('loaded');
      });
    });

    window.__cloudinaryImages = imageUrls;
  });
