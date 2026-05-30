(function () {

  // ---- State ----
  var images = [];
  var currentIndex = 0;
  var zoomScale = 1;
  var zoomTX = 0;
  var zoomTY = 0;
  var MIN_SCALE = 1;
  var MAX_SCALE = 4;

  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    images.push(img.src);
  });

  function img()      { return document.getElementById('lightboxImg'); }
  function overlay()  { return document.getElementById('lightbox'); }

  // ---- Zoom helpers ----
  function applyTransform() {
    img().style.transform = 'translate(' + zoomTX + 'px, ' + zoomTY + 'px) scale(' + zoomScale + ')';
    img().style.cursor = zoomScale > 1 ? 'grab' : 'zoom-in';
  }

  function clamp() {
    var maxX = (img().offsetWidth  * (zoomScale - 1)) / 2;
    var maxY = (img().offsetHeight * (zoomScale - 1)) / 2;
    zoomTX = Math.max(-maxX, Math.min(maxX, zoomTX));
    zoomTY = Math.max(-maxY, Math.min(maxY, zoomTY));
  }

  function resetZoom() {
    zoomScale = 1;
    zoomTX = 0;
    zoomTY = 0;
    img().style.transform = '';
    img().style.cursor = 'zoom-in';
    img().style.transition = '';
  }

  function changeScale(factor) {
    img().style.transition = 'transform 0.15s ease-out';
    zoomScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, zoomScale * factor));
    if (zoomScale === MIN_SCALE) { zoomTX = 0; zoomTY = 0; }
    clamp();
    applyTransform();
  }

  window.zoomIn  = function () { changeScale(1.3); };
  window.zoomOut = function () { changeScale(1 / 1.3); };

  // ---- Scroll to zoom ----
  overlay().addEventListener('wheel', function (e) {
    if (!overlay().classList.contains('open')) return;
    e.preventDefault();
    changeScale(e.deltaY > 0 ? 0.9 : 1.1);
  }, { passive: false });

  // ---- Mouse drag to pan ----
  var isDragging = false;
  var dragStart  = {};

  img().addEventListener('mousedown', function (e) {
    if (zoomScale <= 1) return;
    isDragging = true;
    dragStart  = { x: e.clientX, y: e.clientY, tx: zoomTX, ty: zoomTY };
    img().style.transition = 'none';
    img().style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    zoomTX = dragStart.tx + (e.clientX - dragStart.x);
    zoomTY = dragStart.ty + (e.clientY - dragStart.y);
    clamp();
    applyTransform();
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    img().style.transition = '';
    img().style.cursor = zoomScale > 1 ? 'grab' : 'zoom-in';
  });

  // ---- Pinch to zoom + single-finger pan ----
  var lastPinchDist  = null;
  var isTouchPanning = false;
  var touchPanStart  = {};

  function pinchDist(e) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  overlay().addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      lastPinchDist = pinchDist(e);
      isTouchPanning = false;
      e.preventDefault();
    } else if (e.touches.length === 1 && zoomScale > 1) {
      isTouchPanning = true;
      touchPanStart  = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: zoomTX, ty: zoomTY };
      e.preventDefault();
    }
  }, { passive: false });

  overlay().addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && lastPinchDist) {
      e.preventDefault();
      img().style.transition = 'none';
      var ratio = pinchDist(e) / lastPinchDist;
      zoomScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, zoomScale * ratio));
      if (zoomScale === MIN_SCALE) { zoomTX = 0; zoomTY = 0; }
      clamp();
      applyTransform();
      lastPinchDist = pinchDist(e);
    } else if (e.touches.length === 1 && isTouchPanning) {
      e.preventDefault();
      img().style.transition = 'none';
      zoomTX = touchPanStart.tx + (e.touches[0].clientX - touchPanStart.x);
      zoomTY = touchPanStart.ty + (e.touches[0].clientY - touchPanStart.y);
      clamp();
      applyTransform();
    }
  }, { passive: false });

  overlay().addEventListener('touchend', function (e) {
    if (e.touches.length < 2) lastPinchDist  = null;
    if (e.touches.length === 0) isTouchPanning = false;
  });

  // ---- Open / close / navigate ----
  var lastFocusedElement = null;

  window.openLightbox = function (index) {
    currentIndex = index;
    resetZoom();
    img().src = images[index];
    overlay().classList.add('open');
    document.body.style.overflow = 'hidden';
    lastFocusedElement = document.activeElement;
    // Move focus into lightbox
    overlay().querySelector('.lightbox-close').focus();
  };

  window.closeLightbox = function () {
    overlay().classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();
    // Return focus to the triggering element
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  window.closeLightboxOnBackdrop = function (e) {
    if (e.target === overlay()) window.closeLightbox();
  };

  window.lightboxMove = function (dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    resetZoom();
    img().src = images[currentIndex];
  };

  // ---- Focus trap inside lightbox ----
  overlay().addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(overlay().querySelectorAll('button'));
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  // ---- Keyboard ----
  document.addEventListener('keydown', function (e) {
    if (!overlay().classList.contains('open')) return;
    if (e.key === 'Escape')      window.closeLightbox();
    if (e.key === 'ArrowRight')  window.lightboxMove(-1);
    if (e.key === 'ArrowLeft')   window.lightboxMove(1);
    if (e.key === '+')           window.zoomIn();
    if (e.key === '-')           window.zoomOut();
  });

  // ---- Gallery keyboard accessibility ----
  document.querySelectorAll('.gallery-item').forEach(function (item, i) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'פתח תמונה ' + (i + 1));
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.openLightbox(i);
      }
    });
  });

  // ---- Close hamburger on nav link click ----
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      document.getElementById('mainNav').classList.remove('open');
    });
  });

})();
