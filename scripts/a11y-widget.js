(function () {
  var FONT_STEPS = [90, 100, 110, 120, 130];
  var fontIndex = 1;
  var highContrast = false;
  var noMotion = false;
  var highlightLinks = false;

  var saved = JSON.parse(localStorage.getItem('a11y') || '{}');
  if (saved.fontIndex !== undefined) fontIndex = saved.fontIndex;
  if (saved.highContrast !== undefined) highContrast = saved.highContrast;
  if (saved.noMotion !== undefined) noMotion = saved.noMotion;
  if (saved.highlightLinks !== undefined) highlightLinks = saved.highlightLinks;

  var css = "\n" +
    "  #a11y-widget {\n" +
    "    position: fixed;\n" +
    "    bottom: 28px;\n" +
    "    left: 20px;\n" +
    "    z-index: 9999;\n" +
    "  }\n" +
    "  #a11y-btn-wrap {\n" +
    "    position: relative;\n" +
    "    display: inline-block;\n" +
    "    cursor: grab;\n" +
    "  }\n" +
    "  #a11y-btn-wrap:active { cursor: grabbing; }\n" +
    "  #a11y-btn {\n" +
    "    width: 52px;\n" +
    "    height: 52px;\n" +
    "    border-radius: 50%;\n" +
    "    background: #8b5555;\n" +
    "    color: #fff;\n" +
    "    border: 3px solid #fff;\n" +
    "    cursor: pointer;\n" +
    "    font-size: 22px;\n" +
    "    box-shadow: 0 2px 12px rgba(0,0,0,0.25);\n" +
    "    display: flex;\n" +
    "    align-items: center;\n" +
    "    justify-content: center;\n" +
    "    transition: transform 0.2s;\n" +
    "  }\n" +
    "  #a11y-btn:hover, #a11y-btn:focus {\n" +
    "    transform: scale(1.1);\n" +
    "    outline: 3px solid #8b5555;\n" +
    "    outline-offset: 3px;\n" +
    "  }\n" +
    "  #a11y-dismiss {\n" +
    "    position: absolute;\n" +
    "    top: -6px;\n" +
    "    right: -6px;\n" +
    "    width: 20px;\n" +
    "    height: 20px;\n" +
    "    border-radius: 50%;\n" +
    "    background: #fff;\n" +
    "    border: 1.5px solid #ccc;\n" +
    "    color: #888;\n" +
    "    font-size: 11px;\n" +
    "    cursor: pointer;\n" +
    "    display: flex;\n" +
    "    align-items: center;\n" +
    "    justify-content: center;\n" +
    "    line-height: 1;\n" +
    "    padding: 0;\n" +
    "    opacity: 0;\n" +
    "    transition: opacity 0.2s;\n" +
    "  }\n" +
    "  #a11y-btn-wrap:hover #a11y-dismiss,\n" +
    "  #a11y-dismiss:focus {\n" +
    "    opacity: 1;\n" +
    "  }\n" +
    "  #a11y-dismiss:hover {\n" +
    "    background: #f5f5f5;\n" +
    "    color: #333;\n" +
    "    opacity: 1;\n" +
    "  }\n" +
    "  #a11y-panel {\n" +
    "    position: absolute;\n" +
    "    bottom: 62px;\n" +
    "    left: 0;\n" +
    "    background: #fff;\n" +
    "    border: 1.5px solid #F3DAD8;\n" +
    "    border-radius: 14px;\n" +
    "    padding: 10px 8px;\n" +
    "    box-shadow: 0 6px 24px rgba(0,0,0,0.13);\n" +
    "    display: none;\n" +
    "    min-width: 190px;\n" +
    "    direction: rtl;\n" +
    "  }\n" +
    "  #a11y-panel.open { display: block; }\n" +
    "  #a11y-panel-title {\n" +
    "    font-size: 13px;\n" +
    "    color: #8b5555;\n" +
    "    text-align: center;\n" +
    "    margin: 0 0 8px;\n" +
    "    font-weight: bold;\n" +
    "    font-family: inherit;\n" +
    "  }\n" +
    "  .a11y-option {\n" +
    "    display: flex;\n" +
    "    align-items: center;\n" +
    "    gap: 10px;\n" +
    "    width: 100%;\n" +
    "    text-align: right;\n" +
    "    background: none;\n" +
    "    border: none;\n" +
    "    padding: 9px 12px;\n" +
    "    cursor: pointer;\n" +
    "    font-size: 15px;\n" +
    "    border-radius: 9px;\n" +
    "    color: #1a1a1a;\n" +
    "    font-family: inherit;\n" +
    "    transition: background 0.15s;\n" +
    "    box-sizing: border-box;\n" +
    "  }\n" +
    "  .a11y-option:hover, .a11y-option:focus {\n" +
    "    background: #fdf4f3;\n" +
    "    outline: none;\n" +
    "  }\n" +
    "  .a11y-option.active { background: #F3DAD8; }\n" +
    "  .a11y-icon { font-size: 17px; min-width: 24px; }\n" +
    "  #a11y-reset {\n" +
    "    width: calc(100% - 16px);\n" +
    "    margin: 8px 8px 0;\n" +
    "    background: #F3DAD8;\n" +
    "    border: none;\n" +
    "    border-radius: 9px;\n" +
    "    padding: 8px;\n" +
    "    cursor: pointer;\n" +
    "    font-size: 13px;\n" +
    "    color: #1a1a1a;\n" +
    "    font-family: inherit;\n" +
    "    display: block;\n" +
    "  }\n" +
    "  #a11y-reset:hover { background: #e8c5c2; }\n" +
    "  html.a11y-contrast { filter: contrast(1.6); }\n" +
    "  html.a11y-no-motion *, html.a11y-no-motion *::before, html.a11y-no-motion *::after {\n" +
    "    animation-duration: 0.001ms !important;\n" +
    "    animation-iteration-count: 1 !important;\n" +
    "    transition-duration: 0.001ms !important;\n" +
    "    scroll-behavior: auto !important;\n" +
    "  }\n" +
    "  html.a11y-links a {\n" +
    "    text-decoration: underline !important;\n" +
    "    outline: 2px solid #8b5555 !important;\n" +
    "    outline-offset: 2px !important;\n" +
    "    border-radius: 2px;\n" +
    "  }\n";

  function savePrefs() {
    localStorage.setItem('a11y', JSON.stringify({ fontIndex: fontIndex, highContrast: highContrast, noMotion: noMotion, highlightLinks: highlightLinks }));
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = FONT_STEPS[fontIndex] + '%';
  }

  function applyContrast() {
    document.documentElement.classList.toggle('a11y-contrast', highContrast);
  }

  function applyNoMotion() {
    document.documentElement.classList.toggle('a11y-no-motion', noMotion);
  }

  function applyHighlightLinks() {
    document.documentElement.classList.toggle('a11y-links', highlightLinks);
  }

  function updateButtons() {
    var contrastBtn = document.getElementById('a11y-contrast-btn');
    var fontUpBtn = document.getElementById('a11y-font-up');
    var fontDownBtn = document.getElementById('a11y-font-down');
    var noMotionBtn = document.getElementById('a11y-no-motion-btn');
    var linksBtn = document.getElementById('a11y-links-btn');
    if (contrastBtn) contrastBtn.classList.toggle('active', highContrast);
    if (fontUpBtn) fontUpBtn.classList.toggle('active', fontIndex > 1);
    if (fontDownBtn) fontDownBtn.classList.toggle('active', fontIndex < 1);
    if (noMotionBtn) noMotionBtn.classList.toggle('active', noMotion);
    if (linksBtn) linksBtn.classList.toggle('active', highlightLinks);
  }

  function reset() {
    fontIndex = 1;
    highContrast = false;
    noMotion = false;
    highlightLinks = false;
    applyFontSize();
    applyContrast();
    applyNoMotion();
    applyHighlightLinks();
    updateButtons();
    savePrefs();
  }

  function init() {
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var widget = document.getElementById('a11y-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'a11y-widget';
      document.body.prepend(widget);
    }
    widget.innerHTML =
      '<div id="a11y-panel" role="dialog" aria-label="אפשרויות נגישות">' +
        '<p id="a11y-panel-title">נגישות</p>' +
        '<button class="a11y-option" id="a11y-font-up">' +
          '<span class="a11y-icon">א+</span> הגדל טקסט' +
        '</button>' +
        '<button class="a11y-option" id="a11y-font-down">' +
          '<span class="a11y-icon">א−</span> הקטן טקסט' +
        '</button>' +
        '<button class="a11y-option" id="a11y-contrast-btn">' +
          '<span class="a11y-icon">◑</span> ניגודיות גבוהה' +
        '</button>' +
        '<button class="a11y-option" id="a11y-no-motion-btn">' +
          '<span class="a11y-icon">⏸</span> עצור אנימציות' +
        '</button>' +
        '<button class="a11y-option" id="a11y-links-btn">' +
          '<span class="a11y-icon">🔗</span> הדגש קישורים' +
        '</button>' +
        '<button id="a11y-reset">איפוס</button>' +
      '</div>' +
      '<div id="a11y-btn-wrap">' +
        '<button id="a11y-btn" aria-label="פתח תפריט נגישות" aria-expanded="false">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="white" aria-hidden="true">' +
            '<path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>' +
          '</svg>' +
        '</button>' +
        '<button id="a11y-dismiss" aria-label="סגור ווידג\'ט נגישות" title="הסתר">✕</button>' +
      '</div>';

    var btn = document.getElementById('a11y-btn');
    var panel = document.getElementById('a11y-panel');
    var dismissBtn = document.getElementById('a11y-dismiss');

    // --- Drag ---
    var isDragging = false, didDrag = false;
    var dragStartX, dragStartY, widgetStartX, widgetStartY;

    var savedPos = JSON.parse(localStorage.getItem('a11y-pos') || 'null');
    if (savedPos) {
      widget.style.left   = savedPos.left;
      widget.style.top    = savedPos.top;
      widget.style.bottom = 'auto';
      widget.style.right  = 'auto';
    }

    function startDrag(clientX, clientY) {
      var rect = widget.getBoundingClientRect();
      widget.style.left   = rect.left + 'px';
      widget.style.top    = rect.top  + 'px';
      widget.style.bottom = 'auto';
      widget.style.right  = 'auto';
      dragStartX   = clientX;
      dragStartY   = clientY;
      widgetStartX = rect.left;
      widgetStartY = rect.top;
      isDragging   = true;
      didDrag      = false;
      document.body.style.userSelect = 'none';
    }

    function onDrag(clientX, clientY) {
      if (!isDragging) return;
      var dx = clientX - dragStartX;
      var dy = clientY - dragStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true;
      if (!didDrag) return;
      var newX = Math.max(0, Math.min(window.innerWidth  - widget.offsetWidth,  widgetStartX + dx));
      var newY = Math.max(0, Math.min(window.innerHeight - widget.offsetHeight, widgetStartY + dy));
      widget.style.left = newX + 'px';
      widget.style.top  = newY + 'px';
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      document.body.style.userSelect = '';
      if (didDrag) {
        localStorage.setItem('a11y-pos', JSON.stringify({ left: widget.style.left, top: widget.style.top }));
      }
    }

    var btnWrap = document.getElementById('a11y-btn-wrap');
    btnWrap.addEventListener('mousedown',  function (e) { startDrag(e.clientX, e.clientY); });
    btnWrap.addEventListener('touchstart', function (e) { startDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    document.addEventListener('mousemove',  function (e) { onDrag(e.clientX, e.clientY); });
    document.addEventListener('touchmove',  function (e) { if (isDragging && didDrag) e.preventDefault(); onDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    document.addEventListener('mouseup',   endDrag);
    document.addEventListener('touchend',  endDrag);
    // --- End Drag ---

    btn.addEventListener('click', function () {
      if (didDrag) return;
      var isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    dismissBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      widget.style.display = 'none';
    });

    document.getElementById('a11y-font-up').addEventListener('click', function () {
      if (fontIndex < FONT_STEPS.length - 1) { fontIndex++; applyFontSize(); updateButtons(); savePrefs(); }
    });

    document.getElementById('a11y-font-down').addEventListener('click', function () {
      if (fontIndex > 0) { fontIndex--; applyFontSize(); updateButtons(); savePrefs(); }
    });

    document.getElementById('a11y-contrast-btn').addEventListener('click', function () {
      highContrast = !highContrast;
      applyContrast();
      updateButtons();
      savePrefs();
    });

    document.getElementById('a11y-no-motion-btn').addEventListener('click', function () {
      noMotion = !noMotion;
      applyNoMotion();
      updateButtons();
      savePrefs();
    });

    document.getElementById('a11y-links-btn').addEventListener('click', function () {
      highlightLinks = !highlightLinks;
      applyHighlightLinks();
      updateButtons();
      savePrefs();
    });

    document.getElementById('a11y-reset').addEventListener('click', reset);

    document.addEventListener('click', function (e) {
      if (!widget.contains(e.target)) {
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    applyFontSize();
    applyContrast();
    applyNoMotion();
    applyHighlightLinks();
    updateButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
