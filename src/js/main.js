// ---------------------
// MODAL WINDOW FOR LOGIN
// ---------------------
const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLogin");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passInput = document.getElementById("loginPassword");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");

import { saveCart, renderCart, renderCartCount } from './cart.js';
import { products, cart } from "./cart.js";

// OPEN
openBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

// SHOW/HIDE PASSWORD
togglePassword.addEventListener("click", () => {
  const type =
    passInput.getAttribute("type") === "password" ? "text" : "password";
  passInput.setAttribute("type", type);
});

// VALIDATION
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  // EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = "Enter a valid email address";
    valid = false;
  } else {
    emailError.textContent = "";
  }
  // PASSWORD
  if (!passInput.value.trim()) {
    passwordError.textContent = "Password is required";
    valid = false;
  } else {
    passwordError.textContent = "";
  }

  // SUBMIT SUCCESS
  if (valid) {
    modal.classList.remove("active");
    loginForm.reset();
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        // modal.classList.remove("active");
        e.stopPropagation();
      }
    });
  }
});


// === Add to cart by ID ===
export function addToCartById(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return console.error(`Product ${id} not found`);

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.name=product.name;
    existing.price=product.price;
    existing.quantity += 1;
  } else {
    // cart = [
    //   {
    //     id: product.id,
    //     quantity: 1,
    //   }, 
    //   ...cart
    // ];
    cart.push({
  id: product.id,
  quantity: 1,
});
  }
  saveCart();
  renderCartCount();
  renderCart();
}