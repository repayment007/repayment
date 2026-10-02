/**
 * Global Component Loader & Manager for Repayment
 * Dynamically loads header.html and footer.html into placeholders
 * Handles mobile navigation, auth state injection, and active link detection
 */

(function () {
  // Embedded HTML Fallbacks (Used if file:// protocol blocks network fetch)
  const FALLBACK_HEADER = `
<nav id="main-nav" class="sticky top-0 z-40 shadow-sm bg-white">
  <div class="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
    <a href="index.html" class="flex items-center gap-2">
      <img src="repayment-logo.png" alt="Repayment" class="h-9 w-auto">
    </a>

    <div class="hidden lg:flex items-center gap-7">
      <a href="Testimonials.html" class="nav-link" data-nav="testimonials">Testimonials</a>
      <a href="index.html#services" class="nav-link" data-nav="services">Services</a>
      <a href="About.html" class="nav-link" data-nav="about">About Us</a>
      <a href="index.html#faq" class="nav-link" data-nav="faq">FAQ</a>
      <div id="desktop-auth" class="flex items-center gap-4 ml-2 border-l border-brand-border pl-6"></div>
    </div>

    <div class="flex items-center gap-3">
      <a href="index.html#contact" class="hidden lg:inline-flex btn-primary px-5 py-2.5 text-sm rounded-lg font-semibold" style="width: auto">Get Your Money Back</a>
      <button id="hamburger" class="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle Navigation">
        <svg class="w-5 h-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  <div id="mobile-menu" class="lg:hidden border-t border-brand-border bg-white px-5 py-4 space-y-3">
    <a href="Testimonials.html" class="block nav-link py-2" data-nav="testimonials">Testimonials</a>
    <a href="index.html#services" class="block nav-link py-2" data-nav="services">Services</a>
    <a href="About.html" class="block nav-link py-2" data-nav="about">About Us</a>
    <a href="index.html#faq" class="block nav-link py-2" data-nav="faq">FAQ</a>
    <div id="mobile-auth" class="pt-2 border-t border-brand-border"></div>
    <a href="index.html#contact" class="block btn-primary text-center py-3 rounded-lg mt-2">Get Your Money Back</a>
  </div>
</nav>
`;

  const FALLBACK_FOOTER = `
<footer class="py-14">
  <div class="max-w-7xl mx-auto px-5">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b footer-divider">
      <div>
        <a href="index.html" class="flex items-center gap-2 mb-4">
          <img src="repayment-logo-white.png" alt="Repayment" class="h-9 w-auto">
        </a>
        <p class="text-sm leading-relaxed mb-5">
          Empowering victims of online fraud with the tools and expert guidance to reclaim what is rightfully theirs.
        </p>
        <div class="flex gap-3">
          <a href="#" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition" title="Facebook">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
          </a>
          <a href="#" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition" title="Twitter">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
          </a>
          <a href="#" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition" title="YouTube">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon fill="#0a1628" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
          </a>
        </div>
      </div>

      <div>
        <p class="footer-heading">Sitelinks</p>
        <ul class="space-y-2 text-sm">
          <li><a href="Testimonials.html">Testimonials</a></li>
          <li><a href="index.html#contact">Contact Us</a></li>
          <li><a href="About.html">About Us</a></li>
          <li><a href="index.html#faq">FAQ</a></li>
          <li><a href="#">Affiliate Page</a></li>
          <li><a href="#">Sitemap</a></li>
        </ul>
      </div>

      <div>
        <p class="footer-heading">Services</p>
        <ul class="space-y-2 text-sm">
          <li><a href="index.html#services">Cyber Investigation</a></li>
          <li><a href="index.html#services">Crypto Asset Tracing</a></li>
          <li><a href="index.html#services">Binary Options</a></li>
          <li><a href="index.html#services">Forex Scam Recovery</a></li>
          <li><a href="index.html#services">Romance Scam</a></li>
          <li><a href="index.html#services">Stock Trading Scams</a></li>
        </ul>
      </div>

      <div>
        <p class="footer-heading">Contact</p>
        <ul class="space-y-2.5 text-sm">
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <a href="mailto:support@repayment.com" class="hover:text-white transition">support@repayment.com</a>
          </li>
          <li class="flex items-center gap-2 text-xs text-blue-200/80">
            <svg class="w-4 h-4 shrink-0 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Mon – Fri: 08:00 – 18:00 GMT</span>
          </li>
          <li class="flex items-center gap-2 text-xs text-blue-200/80">
            <svg class="w-4 h-4 shrink-0 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            <span>100% Online & Worldwide</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="pt-8">
      <div class="flex flex-wrap gap-5 mb-6 text-xs">
        <a href="#" class="hover:text-white transition">Terms & Conditions</a>
        <a href="#" class="hover:text-white transition">Privacy Policy</a>
        <a href="#" class="hover:text-white transition">Legal</a>
        <a href="#" class="hover:text-white transition">Black List / Imposters</a>
        <a href="#" class="hover:text-white transition">Directory of Law Enforcement Agencies</a>
      </div>

      <div class="text-xs leading-relaxed space-y-2 border-t footer-divider pt-6">
        <p>Repayment Ltd., American company No. 515711653, is authorized and regulated inAmerican & operates globally. In Australia (ARBN 678 842 236) & are an AFCA member. In the EU, we provide full support services in compliance with applicable laws. In the UK, we operate under an FCA-recognized legal exclusion. In the US, we're approved to operate and follow applicable compliance requirements.</p>
        <p class="text-gray-600"><strong class="text-gray-500">Disclaimer:</strong> Services are limited to blockchain analysis, crypto tracing, investigative reports & advice or advocacy in referrals to law enforcement and civil counsel. We do not provide financial services, asset/fund management, or investment advice. Private firms cannot reverse blockchain transactions, issue seizure orders, or independently freeze exchange accounts.</p>
        <p class="text-gray-600 mt-4">© 2024 Repayment. All rights reserved. DMCA Protected.</p>
      </div>
    </div>
  </div>
</footer>
`;



  function initHeaderInteractions() {
    // 1. Mobile menu toggle
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (hamburger && mobileMenu) {
      hamburger.onclick = function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle("open");
      };
      
      // Close menu when clicking outside
      document.addEventListener("click", function (e) {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
          mobileMenu.classList.remove("open");
        }
      });
    }

    // 2. Sticky nav box-shadow on scroll
    const nav = document.getElementById("main-nav");
    if (nav) {
      window.addEventListener("scroll", function () {
        nav.style.boxShadow = window.scrollY > 10 ? "0 4px 20px rgba(10,22,40,.1)" : "";
      });
    }

    // 3. Highlight current page nav item
    const path = window.location.pathname.toLowerCase();
    let currentNavKey = "";
    if (path.includes("about")) {
      currentNavKey = "about";
    } else if (path.includes("testimonial")) {
      currentNavKey = "testimonials";
    }

    if (currentNavKey) {
      document.querySelectorAll(`[data-nav="${currentNavKey}"]`).forEach(function (el) {
        el.classList.add("text-brand-accent", "font-semibold");
      });
    }
  }

  function updateAuthUI() {
    const desktopAuth = document.getElementById("desktop-auth");
    const mobileAuth = document.getElementById("mobile-auth");
    if (!desktopAuth && !mobileAuth) return;

    const authenticated = window.auth && typeof window.auth.isAuthenticated === "function" && window.auth.isAuthenticated();

    if (authenticated) {
      const logoutBtnDesktop = `<button onclick="window.auth.logoutUser()" class="nav-link font-semibold text-red-500 hover:text-red-600 transition">Logout</button>`;
      const logoutBtnMobile = `<button onclick="window.auth.logoutUser()" class="block w-full text-left nav-link py-2 text-red-500 font-semibold">Logout</button>`;
      if (desktopAuth) desktopAuth.innerHTML = logoutBtnDesktop;
      if (mobileAuth) mobileAuth.innerHTML = logoutBtnMobile;
    } else {
      const loginLinksDesktop = `
        <a href="login.html" class="nav-link font-semibold">Login</a>
        <a href="register.html" class="btn-outline px-4 py-2 text-sm rounded-lg font-semibold">Sign Up</a>
      `;
      const loginLinksMobile = `
        <a href="login.html" class="block nav-link py-2 font-semibold">Login</a>
        <a href="register.html" class="block nav-link py-2 font-semibold">Sign Up</a>
      `;
      if (desktopAuth) desktopAuth.innerHTML = loginLinksDesktop;
      if (mobileAuth) mobileAuth.innerHTML = loginLinksMobile;
    }
  }

  let headerInjected = false;
  let footerInjected = false;

  function injectComponents() {
    const headerPlaceholder = document.getElementById("site-header");
    if (headerPlaceholder && !headerInjected) {
      headerInjected = true;
      headerPlaceholder.outerHTML = FALLBACK_HEADER;
      initHeaderInteractions();
      updateAuthUI();
    }

    const footerPlaceholder = document.getElementById("site-footer");
    if (footerPlaceholder && !footerInjected) {
      footerInjected = true;
      footerPlaceholder.outerHTML = FALLBACK_FOOTER;
    }

    window.updateAuthUI = updateAuthUI;

    if (headerInjected && footerInjected) {
      document.dispatchEvent(new CustomEvent("components:loaded"));
    }
  }

  // 1. Run immediately if placeholders are already parsed in the DOM
  injectComponents();

  // 2. Also hook into DOMContentLoaded to catch if script was placed in <head>
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectComponents);
  }

  // 3. Fallback check on window load
  window.addEventListener("load", injectComponents);
})();
