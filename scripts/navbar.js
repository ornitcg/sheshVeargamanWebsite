(function () {
  var navbar = document.getElementById('mainNav');
  var lastScrollY = window.scrollY;
  var threshold = 8;

  window.addEventListener('scroll', function () {
    var currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      navbar.classList.remove('navbar-hidden');
    } else if (currentScrollY > lastScrollY + threshold) {
      navbar.classList.add('navbar-hidden');
      navbar.classList.remove('open');
    } else if (currentScrollY < lastScrollY - threshold) {
      navbar.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
})();
