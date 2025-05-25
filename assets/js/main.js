document.addEventListener('DOMContentLoaded', () => {
  const contentContainer = document.querySelector('.content');

  const updateActiveLink = (page) => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      }
    });
  };

  const attachReadMoreHandlers = () => {
    document.querySelectorAll('.read-more-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.getAttribute('data-page');
        if (page) {
          loadPage(page);
        }
      });
    });
  };

  const loadPage = async (page) => {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error(`Failed to load ${page}`);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('.content');

      if (newContent) {
        contentContainer.style.opacity = 0;
        setTimeout(() => {
          contentContainer.innerHTML = newContent.innerHTML;
          contentContainer.scrollTop = 0;
          contentContainer.style.opacity = 1;
          attachReadMoreHandlers();
        }, 300);
        updateActiveLink(page);
      } else {
        contentContainer.innerHTML = "<p class='text-danger'>Couldn't load content.</p>";
      }
    } catch (error) {
      console.error("Navigation error:", error);
      contentContainer.innerHTML = `<p class="text-danger">Error loading ${page}</p>`;
    }
  };

  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('a[data-page]');
    if (target) {
      event.preventDefault();
      const page = target.getAttribute('data-page');
      if (page) {
        loadPage(page);
      }
    }
  });

  document.addEventListener("click", (e) => {
    const target = e.target.closest("a[href^='#']");
    if (target && !target.hasAttribute("data-page")) {
      e.preventDefault();
      const section = document.querySelector(target.getAttribute("href"));
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.classList.contains('contact-form')) {
      e.preventDefault();

      const name = form.querySelector("#name")?.value.trim() || "";
      const email = form.querySelector("#email")?.value.trim() || "";
      const message = form.querySelector("#message")?.value.trim() || "";

      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      alert(`Thank you, ${name}! Your message has been sent successfully.`);
      form.reset();
    }
  });

  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      const isActive = sidebar.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = 'auto';
    });
  });

  attachReadMoreHandlers();
});
