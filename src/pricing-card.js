const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host { display: block; max-width: 400px; margin: 16px auto; font-family: Arial, sans-serif; }
    .pricing {
      width: 100%;
      background-color: #fff;
      box-shadow: 0 0 10px #ccc;
      padding: 16px;
      text-align: left;
      box-sizing: border-box;
      border-radius: 6px;
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }

    .price {
      font-size: 18px;
      color: green;
      margin: 0 0 12px 0;
    }

    .features {
      list-style: none;
      padding-left: 0;
      margin: 0 0 12px 0;
    }

    .features li {
      padding: 6px 0;
      border-bottom: 1px solid #eee;
    }

    .btn {
      background: blue;
      color: white;
      padding: 10px 20px;
      border: none;
      margin-top: 10px;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn:hover { background: darkblue; cursor: pointer; }
  </style>

  <div class="pricing">
    <h2 class="title"></h2>
    <p class="price"></p>

    <ul class="features">
      <!-- feature items inserted by component -->
    </ul>

    <button class="btn" part="cta"></button>
  </div>
`;

class PricingCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["title", "price", "features", "button-text"];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const title = this.getAttribute("title") || "";
    const price = this.getAttribute("price") || "";
    const buttonText = this.getAttribute("button-text") || "Start";

    const featuresAttr = this.getAttribute("features");
    const ul = this.shadowRoot.querySelector("ul.features");

    // Clear existing items
    ul.innerHTML = "";
    if (featuresAttr) {
      const items = featuresAttr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      items.forEach((it) => {
        const li = document.createElement("li");
        li.textContent = it;
        ul.appendChild(li);
      });
    } else {
      // Fallback: copy any light DOM <ul> content into the shadow
      const slottedLists = this.querySelectorAll("ul");
      slottedLists.forEach((list) => {
        list.querySelectorAll("li").forEach((li) => {
          const clone = li.cloneNode(true);
          ul.appendChild(clone);
        });
      });
    }

    this.shadowRoot.querySelector(".title").textContent = title;
    this.shadowRoot.querySelector(".price").textContent = price;
    const btn = this.shadowRoot.querySelector(".btn");
    btn.textContent = buttonText;

    btn.onclick = () => {
      this.dispatchEvent(
        new CustomEvent("cta", {
          detail: { title, price },
          bubbles: true,
          composed: true,
        })
      );
    };
  }
}

customElements.define("pricing-card", PricingCard);

export default PricingCard;
