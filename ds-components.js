// ============================================================================
// AGE MODAL COMPONENT
// ============================================================================

class DSAgeModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.init();
    }

    static get observedAttributes() {
        return ["min-age", "theme"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.init();
        }
    }

    getAttributes() {
        this.minAge = parseInt(this.getAttribute("min-age")) || 18;
        this.theme = this.getAttribute("theme") || "default";
        this.storageKey = `age_verified_${this.minAge}`;
    }

    init() {
        this.getAttributes();

        if (localStorage.getItem(this.storageKey)) {
            return;
        }

        this.render();
        this.showModal();
    }

    render() {
        const styles = this.getStyles();
        const template = this.getTemplate();

        this.shadowRoot.innerHTML = `
      ${styles}
      ${template}
    `;

        this.bindEvents();
    }

    getStyles() {
        const themes = {
            default: {
                primary: "#2563eb",
                secondary: "#dc2626",
                background: "#ffffff",
                text: "#1f2937",
                border: "#e5e7eb",
                shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                borderRadius: "12px",
                animation: "slideIn 0.3s ease-out",
            },
            dark: {
                primary: "#3b82f6",
                secondary: "#ef4444",
                background: "#0f172a",
                text: "#f8fafc",
                border: "#1e293b",
                shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.1)",
                borderRadius: "16px",
                animation:
                    "fadeInScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            },
            elegant: {
                primary: "#7c3aed",
                secondary: "#dc2626",
                background: "linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)",
                text: "#111827",
                border: "#e5e7eb",
                shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "20px",
                animation: "slideUp 0.5s ease-out",
            },
        };

        const colors = themes[this.theme] || themes.default;

        return `
      <style>
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: ${
              this.theme === "dark"
                  ? "rgba(0, 0, 0, 0.9)"
                  : this.theme === "elegant"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(0, 0, 0, 0.8)"
          };
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ${this.theme === "dark" ? "backdrop-filter: blur(10px);" : ""}
        }

        .modal-content {
          background: ${colors.background};
          border-radius: ${colors.borderRadius};
          padding: 32px;
          max-width: 480px;
          width: 90%;
          text-align: center;
          box-shadow: ${colors.shadow};
          border: 1px solid ${colors.border};
          animation: ${colors.animation};
        }

        .modal-title {
          font-size: ${this.theme === "dark" ? "32px" : "28px"};
          font-weight: 700;
          color: ${colors.text};
          margin: 0 0 16px 0;
          line-height: 1.2;
          ${
              this.theme === "dark"
                  ? "text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "background: linear-gradient(135deg, #111827 0%, #374151 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
                  : ""
          }
        }

        .modal-description {
          font-size: 16px;
          color: ${colors.text};
          margin: 0 0 32px 0;
          line-height: 1.6;
          opacity: ${this.theme === "dark" ? "0.9" : "0.8"};
          ${this.theme === "elegant" ? "font-weight: 500;" : ""}
        }

        .buttons-container {
          display: flex;
          gap: ${this.theme === "dark" ? "20px" : "16px"};
          justify-content: center;
          flex-wrap: wrap;
          ${this.theme === "elegant" ? "margin: 0 -8px;" : ""}
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: ${colors.primary};
          color: white;
          ${
              this.theme === "dark"
                  ? "box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);"
                  : ""
          }
        }

        .btn-primary:hover {
          background: ${
              this.theme === "elegant"
                  ? "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)"
                  : colors.primary + "dd"
          };
          transform: translateY(-2px);
          ${
              this.theme === "dark"
                  ? "box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.6);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);"
                  : ""
          }
        }

        .btn-secondary {
          background: ${colors.secondary};
          color: white;
          ${
              this.theme === "dark"
                  ? "box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.4);"
                  : ""
          }
        }

        .btn-secondary:hover {
          background: ${colors.secondary}dd;
          transform: translateY(-2px);
          ${
              this.theme === "dark"
                  ? "box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.6);"
                  : ""
          }
        }

        .error-message {
          color: ${colors.secondary};
          font-size: 14px;
          margin-top: 16px;
          font-weight: 500;
          display: none;
          ${
              this.theme === "dark"
                  ? "text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "font-weight: 600; padding: 8px 16px; background: rgba(220, 38, 38, 0.1); border-radius: 8px; border-left: 4px solid #dc2626;"
                  : ""
          }
        }

        .age-badge {
          display: inline-block;
          background: ${
              this.theme === "elegant"
                  ? "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
                  : colors.primary
          };
          color: white;
          padding: ${this.theme === "dark" ? "6px 16px" : "4px 12px"};
          border-radius: ${this.theme === "dark" ? "25px" : "20px"};
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          ${
              this.theme === "dark"
                  ? "box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);"
                  : ""
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: ${this.theme === "dark" ? "28px 24px" : "24px 20px"};
            margin: 20px;
            ${this.theme === "elegant" ? "border-radius: 16px;" : ""}
          }
          
          .buttons-container {
            flex-direction: column;
            gap: ${this.theme === "dark" ? "16px" : "12px"};
          }
          
          .btn {
            width: 100%;
            ${this.theme === "dark" ? "padding: 14px 24px;" : ""}
          }
          
          .modal-title {
            font-size: ${this.theme === "dark" ? "28px" : "24px"};
          }
        }
      </style>
    `;
    }

    getTemplate() {
        return `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="age-badge">${this.minAge}+</div>
          <h2 class="modal-title">Age Restriction</h2>
          <p class="modal-description">
            Access to this website is restricted to persons who have reached the age of ${this.minAge} years.
            <br><br>
            Please confirm that you are ${this.minAge} years old or older.
          </p>
          
          <div class="buttons-container">
            <button class="btn btn-primary" id="confirm-age">
              I am ${this.minAge} or older
            </button>
            <button class="btn btn-secondary" id="deny-age">
              I am under ${this.minAge}
            </button>
          </div>
          
          <div class="error-message" id="error-message">
            Access denied. You must be at least ${this.minAge} years old to enter this website.
          </div>
        </div>
      </div>
    `;
    }

    bindEvents() {
        const confirmBtn = this.shadowRoot.getElementById("confirm-age");
        const denyBtn = this.shadowRoot.getElementById("deny-age");
        const errorMessage = this.shadowRoot.getElementById("error-message");

        confirmBtn.addEventListener("click", () => {
            localStorage.setItem(this.storageKey, "true");
            this.hideModal();
        });

        denyBtn.addEventListener("click", () => {
            errorMessage.style.display = "block";
            denyBtn.disabled = true;
            denyBtn.style.opacity = "0.6";
            denyBtn.style.cursor = "not-allowed";
        });
    }

    showModal() {
        document.body.style.overflow = "hidden";
    }

    hideModal() {
        this.remove();
        document.body.style.overflow = "";
    }

    static create(options = {}) {
        const modal = document.createElement("ds-age-modal");
        if (options.minAge) modal.setAttribute("min-age", options.minAge);
        if (options.theme) modal.setAttribute("theme", options.theme);
        return modal;
    }
}

customElements.define("ds-age-modal", DSAgeModal);

// ============================================================================
// GAMBLING HELP ORGANIZATIONS LOGOS COMPONENT
// ============================================================================

class DSGamblingHelpLogos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.init();
    }

    static get observedAttributes() {
        return ["organizations", "theme", "layout"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.init();
        }
    }

    getAttributes() {
        this.organizations = this.getAttribute("organizations") || "all";
        this.theme = this.getAttribute("theme") || "default";
        this.layout = this.getAttribute("layout") || "grid";
    }

    init() {
        this.getAttributes();
        this.render();
    }

    render() {
        const styles = this.getStyles();
        const template = this.getTemplate();

        this.shadowRoot.innerHTML = `
      ${styles}
      ${template}
    `;
    }

    getStyles() {
        const themes = {
            default: {
                background: "transparent",
                text: "#374151",
                border: "#e5e7eb",
                shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            dark: {
                background: "#1f2937",
                text: "#f9fafb",
                border: "#374151",
                shadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            },
            elegant: {
                background: "linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)",
                text: "#111827",
                border: "#d1d5db",
                shadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            },
        };

        const colors = themes[this.theme] || themes.default;

        return `
      <style>
        .help-logos-container {
          background: ${colors.background};
          padding: ${this.theme === "dark" ? "32px" : "24px"};
          border-radius: ${this.theme === "elegant" ? "16px" : "12px"};
          border: 1px solid ${colors.border};
          box-shadow: ${colors.shadow};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .help-logos-title {
          font-size: ${this.theme === "dark" ? "24px" : "20px"};
          font-weight: 700;
          color: ${colors.text};
          text-align: center;
          margin: 0 0 24px 0;
          ${
              this.theme === "dark"
                  ? "text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);"
                  : ""
          }
          ${
              this.theme === "elegant"
                  ? "background: linear-gradient(135deg, #111827 0%, #374151 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
                  : ""
          }
        }

        .help-logos-subtitle {
          font-size: 14px;
          color: ${colors.text};
          text-align: center;
          margin: 0 0 32px 0;
          opacity: 0.7;
          line-height: 1.5;
        }

        .logos-grid {
          display: grid;
          grid-template-columns: ${
              this.layout === "horizontal"
                  ? "repeat(auto-fit, minmax(160px, 1fr))"
                  : "repeat(auto-fit, minmax(180px, 1fr))"
          };
          gap: ${this.layout === "horizontal" ? "20px" : "28px"};
          align-items: center;
          justify-items: center;
        }

        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: ${colors.text};
          transition: all 0.3s ease;
          padding: 24px;
          border-radius: 12px;
          min-width: 160px;
          min-height: 160px;
          background: rgba(191, 219, 254, 0.7);
          border: 1px solid rgba(147, 197, 253, 0.4);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }

        .logo-item:hover {
          transform: translateY(-4px);
          box-shadow: ${colors.hoverShadow};
          background: rgba(191, 219, 254, 0.9);
          border-color: rgba(147, 197, 253, 0.6);
        }

        .logo-image {
          width: 120px;
          height: 120px;
          object-fit: contain;
          filter: ${
              this.theme === "dark" ? "brightness(0.9) contrast(1.1)" : "none"
          };
        }

        .help-info {
          margin-top: 24px;
          padding: 16px;
          background: ${
              this.theme === "dark"
                  ? "rgba(59, 130, 246, 0.1)"
                  : this.theme === "elegant"
                  ? "rgba(124, 58, 237, 0.1)"
                  : "rgba(59, 130, 246, 0.05)"
          };
          border-radius: 8px;
          border-left: 4px solid ${
              this.theme === "dark"
                  ? "#3b82f6"
                  : this.theme === "elegant"
                  ? "#7c3aed"
                  : "#2563eb"
          };
        }

        .help-info-title {
          font-size: 14px;
          font-weight: 600;
          color: ${colors.text};
          margin: 0 0 8px 0;
        }

        .help-info-text {
          font-size: 13px;
          color: ${colors.text};
          opacity: 0.8;
          line-height: 1.4;
          margin: 0;
        }

        @media (max-width: 768px) {
          .logos-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
          }
          
          .logo-item {
            padding: 20px;
            min-width: 140px;
            min-height: 140px;
          }
          
          .logo-image {
            width: 100px;
            height: 100px;
          }
          
          .help-logos-title {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .logos-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .logo-item {
            padding: 20px;
            min-width: 140px;
            min-height: 140px;
          }
          
          .logo-image {
            width: 100px;
            height: 100px;
          }
        }
      </style>
    `;
    }

    getTemplate() {
        const organizations = this.getOrganizationsList();
        const logosHTML = organizations
            .map(
                (org) => `
      <a href="${org.url}" class="logo-item" target="_blank" rel="noopener noreferrer" title="${org.name}">
        <img src="${org.logo}" alt="${org.name}" class="logo-image" loading="lazy">
      </a>
    `
            )
            .join("");

        return `
      <div class="help-logos-container">
        <h3 class="help-logos-title">Gambling Help Organizations</h3>
        <p class="help-logos-subtitle">Professional help and support for gambling addiction</p>
        
        <div class="logos-grid">
          ${logosHTML}
        </div>
        
        <div class="help-info">
          <div class="help-info-title">Need Help?</div>
          <div class="help-info-text">
            If you or someone you know is struggling with gambling, these organizations provide confidential support, 
            counseling, and resources to help overcome addiction and regain control.
          </div>
        </div>
      </div>
    `;
    }

    getOrganizationsList() {
        const allOrganizations = {
            "gamblers-anonymous": {
                name: "Gamblers Anonymous",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/gamblers-anonymous.png",
                url: "https://www.gamblersanonymous.org/",
            },
            gamcare: {
                name: "GamCare",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/gamcare.svg",
                url: "https://www.gamcare.org.uk/",
            },
            "gambling-therapy": {
                name: "Gambling Therapy",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/gambling-therapy.svg",
                url: "https://www.gamblingtherapy.org/",
            },
            "national-council": {
                name: "National Council",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/national-council.svg",
                url: "https://www.ncpgambling.org/",
            },
            "be-gamble-aware": {
                name: "BeGambleAware",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/be-gamble-aware.webp",
                url: "https://www.begambleaware.org/",
            },
            "responsible-gambling": {
                name: "Responsible Gambling",
                logo: "https://cdn.jsdelivr.net/gh/ts-mykyta/ds-cdn/logos/responsible-gambling.svg",
                url: "https://www.responsiblegambling.org/",
            },
        };

        if (this.organizations === "all") {
            return Object.values(allOrganizations);
        }

        // Parse comma-separated list
        const requestedOrgs = this.organizations
            .split(",")
            .map((org) => org.trim());
        return requestedOrgs
            .map((orgKey) => allOrganizations[orgKey])
            .filter((org) => org !== undefined);
    }

    static create(options = {}) {
        const component = document.createElement("ds-gambling-help-logos");
        if (options.organizations)
            component.setAttribute("organizations", options.organizations);
        if (options.theme) component.setAttribute("theme", options.theme);
        if (options.layout) component.setAttribute("layout", options.layout);
        return component;
    }
}

customElements.define("ds-gambling-help-logos", DSGamblingHelpLogos);

if (typeof module !== "undefined" && module.exports) {
    module.exports = { DSAgeModal, DSGamblingHelpLogos };
}
