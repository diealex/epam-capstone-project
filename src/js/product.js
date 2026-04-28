import { addToCartById } from "./main.js";

/* ----------------------------
   Load JSON + Render Product
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  fetch("../assets/data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((json) => {
      const products = json.data;
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      renderProduct(product);
      renderRelated(products, productId);
      setupQuantityControls();
      setupAddToCart(product);
    })
    .catch((err) => console.error("Error loading products:", err));
});

/* -------------------------------------------
   Render MAIN PRODUCT SECTION dynamically
-------------------------------------------- */

function renderProduct(product) {
  console.log("rendering");
  const container = document.getElementById("productContainer");
  const ext = product.imageUrl.substring(product.imageUrl.lastIndexOf(".") + 1);
  const filename = product.imageUrl.substring(
    0,
    product.imageUrl.lastIndexOf(".")
  );
  const mobile = `${filename}-0.75x.${ext}`;
  const bigDesktop = `${filename}-2x.${ext}`;

  // calculation rating stars

  const star = `
  <svg width="17" height="15">
    <use href="../images/icons.svg#rating"></use>
  </svg>
`;
  const filled = Math.round(product.rating) || 0; // stars count
  const empty = 5 - filled;

  container.innerHTML = `
       <div class="product">
            <div class="product-gallery">
                <picture class="product-main-img">
                <source id="prod_big_img_s1" media="(min-width: 1440px)" class="product-main-img" srcset="${bigDesktop}">
                <source id="prod_big_img_s2" media="(min-width: 1024px)" class="product-main-img" srcset="${
                  product.imageUrl
                }">
                <source id="prod_big_img_s3" media="(min-width: 768px)" srcset="${mobile}">
                <img src="${product.imageUrl}" class="product-main-img" alt="${
    product.name
  }" loading="lazy" onerror="this.onerror=null; document.getElementById('prod_big_img_s1').srcset=document.getElementById('prod_big_img_s2').srcset=document.getElementById('prod_big_img_s3').srcset=this.src='../images/default.jpg';"/>
        </picture>
                    <img src="../images/product/products/product1.png" class="product-thumb" alt="Yellow suitcase thumbnail">
                    <img src="../images/product/products/product2.png" class="product-thumb" alt="Open suitcase thumbnail">
                    <img src="../images/product/products/product3.png" class="product-thumb" alt="Black suitcase thumbnail">
                    <img src="../images/product/products/product4.png" class="product-thumb" alt="Black suitcase thumbnail">
            </div>

            <div class="product-info">
              <div class="product-main-info">
                <h2 class="product-title">${product.name}</h2>
                <div class="product-rating">
                    <span class="rating">${star.repeat(filled)}</span>
                    <span class="rating-empty">${star.repeat(empty)}</span>
                    <span class="reviews-count">(${product.reviews} Clients Review)</span>
                </div>
                <p class="product-price">$${product.price}</p>
              </div>
                <p class="product-description">The new Global Explorer Max Comfort Suitcase Pro is a bold reimagining of
travel essentials, designed to elevate every journey. Made with at least 30%
recycled materials, its lightweight yet impact-resistant shell combines eco-
conscious innovation with rugged durability.</p>

<p class="product-description">The ergonomic handle and GlideMotion spinner wheels ensure effortless  
mobility while making a statement in sleek design. Inside, the modular  
compartments and adjustable straps keep your belongings secure and 
neatly organized, no matter the destination.</p>

                <form class="product-options">
                    <label>
                        Size
                        <select><option value="${product.size}">${
    product.size
  }</option></select>
                    </label>

                    <label>
                        Color
                        <select><option value="${product.color}">${
    product.color
  }</option></select>
                    </label>

                    <label>
                        Category
                        <select><option value="${product.category}">${
    product.category
  }</option></select>
                    </label>

                    <div class="add-to-cart-row">
                        <div class="qty-selector">
                            <button type="button" class="qty-minus">-</button>
                            <input type="number" value="1" min="1" class="qty-input">
                            <button type="button" class="qty-plus">+</button>
                        </div>
                        <button id="add-to-cart-btn" class="btn" type="button">Add To Cart</button>
                    </div>

                </form>
                <div class="payment-icons">
                    <p>Payment:</p>
                    <img src="../images/product/visa.svg" alt="payment with visa" width="47" height="15" />
                    <img src="../images/product/american-express.svg" alt="payment with american-express" width="60"
                        height="20" />
                    <img src="../images/product/mastercard.svg" alt="payment with mastercard" width="33" height="28" />
                    <img src="../images/product/paypal.svg" alt="payment with paypal" width="60" height="17" />
                </div>
            </div>
            
        </div>
    `;
}

/* -------------------------------------------
   Quantity selector
-------------------------------------------- */

function setupQuantityControls() {
  const minus = document.querySelector(".qty-minus");
  const plus = document.querySelector(".qty-plus");
  const input = document.querySelector(".qty-input");

  minus.addEventListener("click", () => {
    input.value = Math.max(1, Number(input.value) - 1);
  });

  plus.addEventListener("click", () => {
    input.value = Number(input.value) + 1;
  });
}

/* -------------------------------------------
   Add To Cart
-------------------------------------------- */

function setupAddToCart(product) {
  const btn = document.querySelector("#add-to-cart-btn");

  btn.addEventListener("click", function () {
    const qty = Number(document.querySelector(".qty-input").value);
    addToCartById(product.id, qty, btn);
  })
};

/* -------------------------------------------
   You May Also Like (4 random items)
-------------------------------------------- */

function renderRelated(products, currentId) {
  const container = document.querySelector(".product-grid");
  const others = products.filter((p) => p.id !== currentId);
  const random = others.sort(() => 0.5 - Math.random()).slice(0, 4);

  container.innerHTML = "";

  random.forEach((p) => {
    container.innerHTML += `
            <article class="product-card">
                <a href="/html/product.html?id=${
                  p.id
                }" class="product-img-wrapper">
                ${p.salesStatus ? `<span class="badge-sale">sale</span>` : ""}
                    <img src="${p.imageUrl}" class="product-img" alt="${
      p.name
    }" onerror="this.onerror=null; this.src='../images/default.jpg';">
                </a>
                <h3 class="product-name"><a href="/html/product.html?id=${
                  p.id
                }">${p.name}</a></h3>
                <p class="product-price">$${p.price}</p>
                <a class="product-btn btn" href="/html/product.html?id=${
                  p.id
                }">View</a>
            </article>
        `;
  });
}

/* ----------------------------
   Reviews Tab Submission
----------------------------- */
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.getElementById("reviewForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = document.getElementById("formMsg");
  const review = this.review.value.trim();
  const name = this.name.value.trim();
  const email = this.email.value.trim();

  if (!review || !name || !email) {
    msg.textContent = "Please fill in all required fields.";
    msg.style.color = "red";
    return;
  }
  msg.textContent = "Review submitted successfully!";
  msg.style.color = "green";
  this.reset();
});

/* -----------------------------------
  Accordeon for tabs on mobile layout
-------------------------------------- */

const accordionTitles = document.querySelectorAll('.accordion-title');

accordionTitles.forEach(title => {
  title.addEventListener('click', () => {
    const parent = title.parentElement;

    document.querySelectorAll('.tab-content').forEach(item => {
      if (item !== parent) item.classList.remove('active');
    });

    parent.classList.toggle('active');
  });
});