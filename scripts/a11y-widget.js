(function () {
  var FONT_STEPS = [90, 100, 110, 120, 130];
  var fontIndex = 1;
  var highContrast = false;

  var saved = JSON.parse(localStorage.getItem('a11y') || '{}');
  if (saved.fontIndex !== undefined) fontIndex = saved.fontIndex;
  if (saved.highContrast !== undefined) highContrast = saved.highContrast;

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
    "  }\n" +
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
    "  html.a11y-contrast { filter: contrast(1.6); }\n";

  function savePrefs() {
    localStorage.setItem('a11y', JSON.stringify({ fontIndex: fontIndex, highContrast: highContrast }));
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = FONT_STEPS[fontIndex] + '%';
  }

  function applyContrast() {
    document.documentElement.classList.toggle('a11y-contrast', highContrast);
  }

  function updateButtons() {
    var contrastBtn = document.getElementById('a11y-contrast-btn');
    var fontUpBtn = document.getElementById('a11y-font-up');
    var fontDownBtn = document.getElementById('a11y-font-down');
    if (contrastBtn) contrastBtn.classList.toggle('active', highContrast);
    if (fontUpBtn) fontUpBtn.classList.toggle('active', fontIndex > 1);
    if (fontDownBtn) fontDownBtn.classList.toggle('active', fontIndex < 1);
  }

  function reset() {
    fontIndex = 1;
    highContrast = false;
    applyFontSize();
    applyContrast();
    updateButtons();
    savePrefs();
  }

  function init() {
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var widget = document.createElement('div');
    widget.id = 'a11y-widget';
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
        '<button id="a11y-reset">איפוס</button>' +
      '</div>' +
      '<div id="a11y-btn-wrap">' +
        '<button id="a11y-btn" aria-label="פתח תפריט נגישות" aria-expanded="false">♿</button>' +
        '<button id="a11y-dismiss" aria-label="סגור ווידג\'ט נגישות" title="הסתר">✕</button>' +
      '</div>';

    document.body.appendChild(widget);

    var btn = document.getElementById('a11y-btn');
    var panel = document.getElementById('a11y-panel');
    var dismissBtn = document.getElementById('a11y-dismiss');

    btn.addEventListener('click', function () {
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

    document.getElementById('a11y-reset').addEventListener('click', reset);

    document.addEventListener('click', function (e) {
      if (!widget.contains(e.target)) {
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    applyFontSize();
    applyContrast();
    updateButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
