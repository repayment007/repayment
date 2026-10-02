
      // Reveal on scroll
      const reveals = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.1 },
      );
      reveals.forEach((el) => observer.observe(el));

      // Counter animation
      function animateCounter(target, duration = 2500) {
        const el = document.getElementById("counter");
        let start = 0;
        const end = 41073743;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          el.textContent = "$" + Math.floor(start).toLocaleString();
        }, 16);
      }

      // Trigger counter when visible
      const counterEl = document.getElementById("counter");
      if (counterEl) {
        const counterObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                animateCounter();
                counterObs.disconnect();
              }
            });
          },
          { threshold: 0.5 },
        );
        counterObs.observe(counterEl);
      }

      // FAQ toggle
      function toggleFaq(btn) {
        const answer = btn.nextElementSibling;
        const chevron = btn.querySelector(".faq-chevron");
        const isOpen = answer.classList.contains("open");

        document
          .querySelectorAll(".faq-answer.open")
          .forEach((a) => a.classList.remove("open"));
        document
          .querySelectorAll(".faq-chevron.open")
          .forEach((c) => c.classList.remove("open"));

        if (!isOpen) {
          answer.classList.add("open");
          chevron.classList.add("open");
        }
      }

      // Scam pill selector
      const scamDescs = {
        "Binary Options":
          "Binary options scams involve fraudulent brokers who manipulate trading platforms to ensure clients lose money. Our team has extensive experience investigating such brokers through the ADR process.",
        "Digital Currency":
          "Digital currency scams range from fake exchanges to phishing attacks targeting crypto wallets. We trace blockchain transactions and identify perpetrators to help you build a recovery case.",
        Forex:
          "Forex scams target traders through unregulated brokers, signal services, or managed accounts. Our investigators are former forex industry professionals who know exactly how these schemes work.",
        "Stock Trading":
          "Stock trading scams use fake platforms and manipulated charts to steal from investors. Our reports expose the fraudsters and provide the evidence needed to pursue recovery.",
        "Property Scams":
          "Property scams can involve fake listings, title fraud, or offshore investment schemes. Our cross-border investigation capability is particularly effective for real estate fraud.",
        "Romance Scams":
          "Romance scammers build emotional relationships to extract money over months. We can trace payment flows and build a case profile even when the perpetrators operate from abroad.",
        "Credit Card Phishing":
          "Credit card phishing involves stolen card data used for unauthorized transactions. Our KYC and ADR expertise can help you dispute fraudulent charges and recover losses.",
        "Crypto Scams":
          "Crypto scams — from rug pulls to fake DeFi protocols — leave blockchain trails our experts can follow. Crypto tracing is one of our core specializations.",
        "Investment Fraud":
          "Investment fraud involves Ponzi schemes, fake funds, or unlicensed advisors. We investigate the company, its principals, and payment flows to build a comprehensive recovery case.",
        "Other Scams":
          "If your scam type is not listed, contact us for a free consultation. We have handled hundreds of unique fraud cases and our experts will assess whether recovery is possible.",
      };

      function setActiveScam(btn) {
        document
          .querySelectorAll(".scam-pill")
          .forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const desc =
          scamDescs[btn.textContent.trim()] || scamDescs["Other Scams"];
        const el = document.getElementById("scam-desc");
        if (el) {
          el.style.opacity = 0;
          setTimeout(() => {
            el.textContent = desc;
            el.style.opacity = 1;
            el.style.transition = "opacity .3s";
          }, 150);
        }
      }

      // Toast
      function showToast(msg) {
        const toast = document.getElementById("toast");
        document.getElementById("toast-msg").textContent = msg;
        toast.style.opacity = "1";
        toast.style.transform = "translateY(-8px)";
        toast.style.pointerEvents = "auto";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(0)";
          toast.style.pointerEvents = "none";
        }, 3500);
      }

      // Sticky nav shadow on scroll
      window.addEventListener("scroll", () => {
        const nav = document.getElementById("main-nav");
        if (nav) {
          nav.style.boxShadow =
            window.scrollY > 10 ? "0 4px 20px rgba(10,22,40,.1)" : "";
        }
      });
   
      
      
      
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                navy: "#0a1628",
                blue: "#1a3a6b",
                mid: "#1e4d8c",
                accent: "#2e6bce",
                light: "#4a90e2",
                gold: "#c9a84c",
                goldlt: "#e6c96e",
                offwhite: "#f4f6fa",
                gray: "#8a9ab5",
                border: "#d6dde8",
              },
            },
            fontFamily: {
              display: ['"Playfair Display"', "serif"],
              body: ['"DM Sans"', "sans-serif"],
            },
            animation: {
              "fade-up": "fadeUp 0.7s ease forwards",
              "fade-in": "fadeIn 0.5s ease forwards",
              "count-up": "countUp 2s ease forwards",
              "pulse-slow": "pulse 3s infinite",
            },
            keyframes: {
              fadeUp: {
                "0%": { opacity: 0, transform: "translateY(28px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
            },
          },
        },
      };
   