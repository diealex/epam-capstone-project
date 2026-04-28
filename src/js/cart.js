import { addToCartById} from './main.js';

export let cart = JSON.parse(localStorage.getItem("cart")) || [];
export let products = [];

// === Fetch all products once (for lookup by ID) ===
fetch("../assets/data.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
  })
  .then((data) => {
    products = data.data; // assuming { "data": [ ... ] }
    renderCart(); // render immediately if cart page
    renderCartCount();
  })
  .catch((err) => console.error("❌ Error loading products:", err));

// === Save to localStorage ===
export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// === Remove product from cart ===
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  renderCartCount();
}

// === Update quantity ===
function updateQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(id);
  else saveCart();

  renderCart();
  renderCartCount();
}

// === Calculate totals ===
function calculateTotals() {
  const subTotal = cart.reduce((sum, i) => {
    const product = products.find(
      (p) => p.id === i.id
    );
    return sum + product.price * i.quantity;
  }, 0);

  const discount = subTotal > 3000 ? subTotal * 0.1 : 0;
  const shipping = subTotal > 0 ? 30 : 0;
  const total = subTotal - discount + shipping;
  return { subTotal, discount, shipping, total };
}

// === Render cart icon count ===
export function renderCartCount() {
  const el = document.querySelector(".cart-count");
  if (!el) return;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (totalItems > 0) {
    el.textContent = totalItems;
    el.style.display = "flex"; // show badge
  } else {
    el.textContent = "";
    el.style.display = "none"; // hide badge
  }
}

// === Render cart items (main section) ===
export function renderCart() {
  const container = document.querySelector(".cart-items-greed");
  const summary = document.querySelector(".checkout");
  if (!container || !summary) return; // skip if not on cart page

  if (cart.length === 0) {
    container.innerHTML =
      "<p>Your cart is empty. Use the catalog to add new items.</p>";
    summary.innerHTML = "";
    return;
  }

  // Render each cart item
  container.innerHTML = cart
    .map(i => ({ item: i, info: products.find(p => p.id === i.id) }))
    .filter(i => i.info ? true : false)
    .map(({ item, info: product }) => `
      <article class="cart-item" data-id="${item.id}">
   
        <img src="${product.imageUrl}" class="cart-img" alt="${product.name}" onerror="this.onerror=null; this.src='../images/default.jpg';"/>
          <h3 class="cart-title">${product.name}</h3>
          <p class="price">$${product.price}</p>

        <div class="quantity">
          <button data-action="decrease">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase">+</button>
        </div>
        <p class="total">$${product.price * item.quantity}</p>
        <button class="remove" data-action="remove">
         <svg width="20" height="22">
            <use href="../images/icons.svg#bin-icon"></use>
          </svg>
        </button>
      </article>
    `)
    .join("");

  // Update summary
  const { subTotal, discount, shipping, total } = calculateTotals();

  let summaryHTML = `
  <ul>
    <li class="checkout-item"><span>Subtotal:</span><span>$${subTotal}</span></li>
    <hr>
`;

  if (discount > 0) {
    summaryHTML += `<li class="checkout-item"><span>Discount:</span><span>$${discount}</span></li><hr>`;
  }

  summaryHTML += `
    <li class="checkout-item"><span>Shipping:</span><span>$${shipping}</span></li><hr>
    <li class="checkout-total"><span>Total: </span><span>$${total}</span></li>
  </ul>
  <button class="btn-checkout btn">Checkout</button>
`;

  summary.innerHTML = summaryHTML;
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-checkout")) {
    cart.length = 0; // очистить массив правильно
    saveCart();
    renderCart();
    renderCartCount();
    alert("Thank you for your purchase.");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".clear-cart")) {
    cart.length = 0; // правильная очистка массива
    saveCart();
    renderCart();
    renderCartCount();
  }
});

// === Handle button actions (delegation) ===
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const item = btn.closest(".cart-item");
  const id = item ? item.dataset.id : null;

  switch (btn.dataset.action) {
    case "increase":
      updateQuantity(id, 1);
      break;
    case "decrease":
      updateQuantity(id, -1);
      break;
    case "remove":
      removeFromCart(id);
      break;
  }

  if (btn.classList.contains("add-to-cart")) {
    addToCartById(btn.dataset.id);
    btn.textContent = "Added!";
    setTimeout(() => (btn.textContent = "Add to Cart"), 1000);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderCartCount();
});


