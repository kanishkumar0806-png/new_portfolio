/* ==========================================================
   Kanish Kumar — Portfolio Scripts (v2)
   ========================================================== */

(function(){
  document.getElementById('year').textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- sticky nav shadow on scroll ----
  var topnav = document.getElementById('topnav');
  function onScrollNav(){
    topnav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ---- mobile menu toggle ----
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('.nav-link').forEach(function(link){
    link.addEventListener('click', function(){
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- scroll-spy active nav link ----
  var navLinks = document.querySelectorAll('.nav-links .nav-link');
  var sectionIds = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];
  var sections = sectionIds.map(function(id){ return document.getElementById(id); });

  function setActiveLink(){
    var pos = window.scrollY + 140;
    var activeIdx = 0;
    sections.forEach(function(sec, i){
      if(sec && sec.offsetTop <= pos){ activeIdx = i; }
    });
    var activeId = sectionIds[activeIdx];
    navLinks.forEach(function(link){
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- reveal-on-scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ revealIO.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // ---- skill bar fill on scroll into view ----
  var fills = document.querySelectorAll('.skill-fill');
  if('IntersectionObserver' in window){
    var fillIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.width + '%';
          fillIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function(f){ fillIO.observe(f); });
  } else {
    fills.forEach(function(f){ f.style.width = f.dataset.width + '%'; });
  }

  // ---- stat counters ----
  var counters = document.querySelectorAll('.stat-num');
  function animateCounter(el){
    var target = parseInt(el.dataset.count, 10) || 0;
    if(reduceMotion){ el.textContent = target; return; }
    var start = 0;
    var duration = 900;
    var startTime = null;
    function step(ts){
      if(startTime === null){ startTime = ts; }
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function(c){ counterIO.observe(c); });
  } else {
    counters.forEach(function(c){ c.textContent = c.dataset.count; });
  }

  // ---- contact form (no backend — opens the visitor's email client) ----
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();
    if(!name || !email || !message){
      status.textContent = 'Please fill in every field.';
      status.style.color = '#E15353';
      return;
    }
    var subject = encodeURIComponent('Portfolio contact from ' + name);
    var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:kanishkumar0806@gmail.com?subject=' + subject + '&body=' + body;
    status.style.color = '#14B8A6';
    status.textContent = 'Opening your email client…';
    form.reset();
  });
})();
