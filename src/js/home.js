const burgerBtn = document.querySelector(".burger-btn");
const overlay = document.querySelector(".mobile-overlay");
const closeBtn = document.querySelector(".mobile-close-btn");

burgerBtn.addEventListener("click", () => {
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.remove("active");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("active");
});

// Product showing logic
document.addEventListener("DOMContentLoaded", () => {
  fetch("../assets/data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((json) => {
      const products = json.data;
      renderProducts(products);
    })
    .catch((err) => console.error("Error loading products:", err));
});

function renderProducts(products) {
  const selectedContainer = document.querySelector(".selected-products-grid");
  const newContainer = document.querySelector(".new-products-grid");

  // Filter products by block
  const selected = products.filter((p) =>
    p.blocks.includes("Selected Products")
  );
  const newArrivals = products.filter((p) =>
    p.blocks.includes("New Products Arrival")
  );

  // Selected Products layout

  if (selectedContainer) {
    selected.forEach((p) => {
      const ext = p.imageUrl.substring(p.imageUrl.lastIndexOf(".") + 1);
      const filename = p.imageUrl.substring(0, p.imageUrl.lastIndexOf("."));
      const mobile = `${filename}-0.75x.${ext}`;
      const bigDesktop = `${filename}-2x.${ext}`;

      selectedContainer.innerHTML += `
      <article class="product-card">
      <a href="/html/product.html?id=${p.id}" class="product-img-wrapper product-img">
      ${p.salesStatus ? `<span class="badge-sale">sale</span>` : ""}
        <picture class="product-img">
                <source media="(min-width: 1440px)" srcset="${bigDesktop}">
                <source media="(min-width: 1024px)" srcset="${p.imageUrl}">
                <source media="(min-width: 768px)" srcset="${mobile}">
                <img src="${p.imageUrl}" alt="${p.name}" loading="lazy"/>
      </picture>
      </a>
        <h3 class="product-name"><a href="/html/product.html?id=${p.id}">${
        p.name
      }</a></h3>
        <p class="product-price">$${p.price}</p>
        <button href="#" class="btn add-to-cart product-btn" data-id="${
          p.id
        }">Add to Cart</button>
      </article>
    `;
    });
  }

  if (newContainer) {
    // New Products layout
    newArrivals.forEach((p) => {
      const ext = p.imageUrl.substring(p.imageUrl.lastIndexOf(".") + 1);
      const filename = p.imageUrl.substring(0, p.imageUrl.lastIndexOf("."));
      const mobile = `${filename}-0.75x.${ext}`;
      const bigDesktop = `${filename}-2x.${ext}`;
      newContainer.innerHTML += `
      <article class="product-card">
      <a href="./product.html?id=${p.id}" class="product-img-wrapper product-img">
      ${p.salesStatus ? `<span class="badge-sale">sale</span>` : ""}
        <picture>
                <source media="(min-width: 1440px)" srcset="${bigDesktop}">
                <source media="(min-width: 1024px)" srcset="${p.imageUrl}">
                <source media="(min-width: 768px)" srcset="${mobile}">
                <img src="${p.imageUrl}" alt="${p.name}" loading="lazy"/>
        </picture>
      </a>
        <h3 class="product-name"><a href="/html/product.html?id=${p.id}">${p.name}</a></h3>
        <p class="product-price">$${p.price}</p>
        <a href="/html/product.html?id=${
          p.id
        }" class="btn product-btn">View Product</a>
        
      </article>
    `;
    });
  }
}
