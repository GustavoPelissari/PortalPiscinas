const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const currentPath = window.location.pathname.split("/").pop() || "index.html";

const syncMenuState = (isOpen) => {
  body.dataset.menuOpen = isOpen ? "true" : "false";

  if (!menuToggle) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
};

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMenu = () => {
  if (!menuToggle) {
    return;
  }

  syncMenuState(false);
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.dataset.menuOpen === "true";
    syncMenuState(!isOpen);
  });
}

navLinks.forEach((link) => {
  const target = link.dataset.nav;
  if (target === currentPath || (currentPath === "" && target === "index.html")) {
    link.classList.add("is-active");
  }

  link.addEventListener("click", closeMenu);
});

document.querySelectorAll("[data-close-menu]").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (body.dataset.menuOpen !== "true" || !header) {
    return;
  }

  if (!header.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  },
  { passive: true }
);

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();
syncMenuState(body.dataset.menuOpen === "true");

const revealTargets = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const form = document.querySelector("#contact-form");

if (form) {
  const feedback = form.querySelector(".form-feedback");
  const whatsappButton = form.querySelector("[data-send-whatsapp]");

  const buildMessage = () => {
    const data = new FormData(form);
    const nome = data.get("nome")?.toString().trim() || "";
    const telefone = data.get("telefone")?.toString().trim() || "";
    const cidade = data.get("cidade")?.toString().trim() || "";
    const interesse = data.get("interesse")?.toString().trim() || "";
    const mensagem = data.get("mensagem")?.toString().trim() || "";

    return [
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Cidade: ${cidade}`,
      `Interesse: ${interesse}`,
      "",
      "Mensagem:",
      mensagem,
    ].join("\n");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const subject = encodeURIComponent("Novo contato pelo site - Portal Piscinas");
    const bodyMessage = encodeURIComponent(buildMessage());
    window.location.href = `mailto:edsonportalpiscinas@hotmail.com?subject=${subject}&body=${bodyMessage}`;

    if (feedback) {
      feedback.textContent = "Seu aplicativo de e-mail foi aberto com a mensagem preenchida.";
    }
  });

  if (whatsappButton) {
    whatsappButton.addEventListener("click", () => {
      if (!form.reportValidity()) {
        return;
      }

      const message = encodeURIComponent(buildMessage());
      window.open(`https://wa.me/5544984050625?text=${message}`, "_blank", "noopener");

      if (feedback) {
        feedback.textContent = "Abrimos o WhatsApp com a mensagem pronta para você enviar.";
      }
    });
  }
}
