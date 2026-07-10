(function () {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-open");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-open"), 1800);
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.getAttribute("data-copy") || "";
      if (!button.dataset.copyLabel) button.dataset.copyLabel = button.textContent;
      const originalText = button.dataset.copyLabel;
      try {
        await navigator.clipboard.writeText(text);
        showToast("已复制：" + text);
      } catch (_) {
        showToast("地址：" + text);
      }
      if (button.tagName === "BUTTON") {
        button.textContent = "已复制";
        button.classList.add("is-copied");
        window.clearTimeout(button.copyTimer);
        button.copyTimer = window.setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("is-copied");
        }, 1200);
      }
    });
  });

  const terminalCards = Array.from(document.querySelectorAll("[data-terminal-card]"));
  const terminal = {
    name: document.querySelector("[data-terminal-name]"),
    desc: document.querySelector("[data-terminal-desc]"),
    status: document.querySelector("[data-terminal-status]"),
    online: document.querySelector("[data-terminal-online]"),
    version: document.querySelector("[data-terminal-version]"),
    pack: document.querySelector("[data-terminal-pack]"),
    address: document.querySelector("[data-terminal-address]"),
    rules: document.querySelector("[data-terminal-rules]"),
    copy: document.querySelector("[data-terminal-copy]"),
    icon: document.querySelector("[data-terminal-icon]")
  };

  function selectServer(card) {
    if (!card || !terminal.name) return;
    terminalCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    terminal.name.textContent = card.getAttribute("data-name") || "服务器";
    terminal.desc.textContent = card.getAttribute("data-desc") || "暂无说明。";
    terminal.status.textContent = card.getAttribute("data-status") || "—";
    terminal.online.textContent = card.getAttribute("data-online") || "—";
    terminal.version.textContent = card.getAttribute("data-version") || "—";
    terminal.pack.textContent = card.getAttribute("data-pack") || "不需要整合包";
    terminal.address.textContent = card.getAttribute("data-address") || "—";
    terminal.rules.textContent = card.getAttribute("data-rules") || "进入前请阅读社团服务器规则。";
    if (terminal.copy) {
      terminal.copy.setAttribute("data-copy", card.getAttribute("data-address") || "");
      terminal.copy.dataset.copyLabel = "复制地址";
      terminal.copy.textContent = "复制地址";
      terminal.copy.classList.remove("is-copied");
    }
    if (terminal.icon) {
      const icon = card.querySelector(".pixi");
      terminal.icon.className = icon ? icon.className : "pixi pixi-server";
    }
  }

  terminalCards.forEach((card) => {
    card.addEventListener("click", () => selectServer(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectServer(card);
      }
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]");
      const value = button.getAttribute("data-filter");
      group.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      document.querySelectorAll("[data-server-card]").forEach((card) => {
        const types = (card.getAttribute("data-type") || "").split(" ");
        card.style.display = value === "all" || types.includes(value) ? "" : "none";
      });
      const firstVisibleTerminalCard = terminalCards.find((card) => card.style.display !== "none");
      if (firstVisibleTerminalCard) selectServer(firstVisibleTerminalCard);
    });
  });

  const drawer = document.querySelector("[data-drawer]");
  const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
  if (drawer && drawerBackdrop) {
    const fields = {
      title: drawer.querySelector("[data-drawer-title]"),
      desc: drawer.querySelector("[data-drawer-desc]"),
      address: drawer.querySelector("[data-drawer-address]"),
      version: drawer.querySelector("[data-drawer-version]"),
      pack: drawer.querySelector("[data-drawer-pack]"),
      rules: drawer.querySelector("[data-drawer-rules]")
    };

    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawerBackdrop.classList.remove("is-open");
    }

    document.querySelectorAll("[data-drawer-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-server-card]");
        fields.title.textContent = card.getAttribute("data-name") || "服务器详情";
        fields.desc.textContent = card.getAttribute("data-desc") || "暂无说明。";
        fields.address.textContent = card.getAttribute("data-address") || "—";
        fields.version.textContent = card.getAttribute("data-version") || "—";
        fields.pack.textContent = card.getAttribute("data-pack") || "不需要整合包";
        fields.rules.textContent = card.getAttribute("data-rules") || "进入前请阅读社团服务器规则。";
        drawer.classList.add("is-open");
        drawerBackdrop.classList.add("is-open");
      });
    });

    drawerBackdrop.addEventListener("click", closeDrawer);
    drawer.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", closeDrawer));
  }

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    tabs.querySelectorAll("[data-tab-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-tab-target");
        tabs.querySelectorAll("[data-tab-target]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
          panel.classList.toggle("is-active", panel.id === target);
        });
      });
    });
  });

  document.querySelectorAll("[data-application-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = form.querySelector(".result");
      if (result) {
        result.textContent = "已收到申请。值班管理会按顺序处理。";
        result.classList.add("is-open");
      }
      showToast("申请已提交");
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      const backdrop = document.querySelector("[data-modal-backdrop]");
      if (modal) modal.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      try {
        sessionStorage.setItem("homeNoticeSeen", "1");
      } catch (_) {}
    });
  });

  const homeModal = document.querySelector("[data-home-modal]");
  const modalBackdrop = document.querySelector("[data-modal-backdrop]");
  if (homeModal && modalBackdrop) {
    let seen = false;
    try {
      seen = sessionStorage.getItem("homeNoticeSeen") === "1";
    } catch (_) {}
    if (!seen) {
      window.setTimeout(() => {
        homeModal.classList.add("is-open");
        modalBackdrop.classList.add("is-open");
      }, 450);
    }
    modalBackdrop.addEventListener("click", () => {
      homeModal.classList.remove("is-open");
      modalBackdrop.classList.remove("is-open");
      try {
        sessionStorage.setItem("homeNoticeSeen", "1");
      } catch (_) {}
    });
  }
})();
