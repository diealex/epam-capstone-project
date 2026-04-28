const productContainer = document.querySelector(".product-grid");
const sizeFilter = document.getElementById("filter-size");
const colorFilter = document.getElementById("filter-color");
const categoryFilter = document.getElementById("filter-category");
const salesFilter = document.getElementById("filter-sale");
const clearFilters = document.querySelector(".btn-clear");

const searchInput = document.getElementById("search-models");
const sortSelect = document.getElementById("sort-products");
const paginationContainer = document.querySelector(".pagination");

const toggleBtn = document.getElementById('filters-toggle');
const filtersForm = document.getElementById('filters-form');
const hideBtn = document.getElementById('filters-hide');

let productsData = [];
let filteredProducts = [];

let curPage = 1;
const PRODUCTS_PER_PAGE = 12;

async function fetchProducts() {
  try {
    const response = await fetch("/assets/data.json");
    const jsonData = await response.json();
    productsData = jsonData.data;

    populateFilterOptions();
    applyFiltersAndRender();
    renderTopBest(productsData);
  } catch (error) {
    console.error("Error fetching product data:", error);
    productContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}

function populateFilterOptions() {
  const sizes = ["S", "M", "L", "XL", "S-L", "S, M, XL"];
  const colors = ["red", "blue", "green", "black", "grey", "yellow", "pink"];
  const categories = [
    "carry-ons",
    "suitcases",
    "luggage sets",
    "kids' luggage",
  ];

  fillSelect(sizeFilter, sizes);
  fillSelect(colorFilter, colors);
  fillSelect(categoryFilter, categories);
}

function fillSelect(selectElement, options) {
  if (!selectElement) {
    return;
  }
  selectElement.innerHTML =
    '<option value="">Choose option</option>' +
    options
      .map(
        (opt) =>
          `<option value="${opt}">${
            opt.charAt(0).toUpperCase() + opt.slice(1)
          }</option>`
      )
      .join("");
}

function renderAllProducts(products) {
  if (!productContainer) {
    return;
  }

  productContainer.innerHTML = "";

  if (!products || products.length === 0) {
    productContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
    <a href="/html/product.html?id=${product.id}" class="product-img-wrapper">
        ${product.salesStatus ? `<span class="badge-sale">SALE</span>` : ""}
        <img src="${product.imageUrl}" class="product-img" alt="${
      product.name
    }" loading="lazy" onerror="this.onerror=null; this.src='../images/default.jpg';"/>
    </a>    
        <h2 class="product-name">${product.name}</h2>
        <p class="product-price">$${product.price}</p>
        <button class="add-to-cart product-btn btn" data-id="${
          product.id
        }">Add to Cart</button>
      `;
    productContainer.appendChild(card);
  });
}

function filterProducts(baseData = productsData) {
  if (!sizeFilter) {
    return [...baseData];
  }
  const selectedSize = sizeFilter.value;
  const selectedColor = colorFilter.value;
  const selectedCategory = categoryFilter.value;
  const salesOnly = salesFilter.checked;
  const searchQuery = (searchInput?.value || "").trim().toLowerCase();

  return baseData.filter((product) => {
    let sizeMatch = true;

    if (selectedSize === "S-L") {
      sizeMatch = ["S", "M", "L"].includes(product.size);
    } else if (selectedSize === "S, M, XL") {
      sizeMatch = ["S", "M", "XL"].includes(product.size);
    } else {
      sizeMatch = selectedSize ? product.size === selectedSize : true;
    }

    const colorMatch = selectedColor ? product.color === selectedColor : true;
    const categoryMatch = selectedCategory
      ? product.category === selectedCategory
      : true;
    const salesMatch = salesOnly ? product.salesStatus === true : true;

    const searchMatch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery)
      : true;

    return (
      sizeMatch && colorMatch && categoryMatch && salesMatch && searchMatch
    );
  });
}

function sortProducts(list) {
  const val = (sortSelect?.value || "default").toLowerCase();

  switch (val) {
    case "popularity":
      return [...list].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
    case "rating":
      return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "price-low":
      return [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    case "price-high":
      return [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    default:
      return [...list];
  }
}

function getPagedItems(list, page = 1) {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  return list.slice(start, start + PRODUCTS_PER_PAGE);
}

function renderPaginationControls(listLength) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  if (listLength <= PRODUCTS_PER_PAGE) return;

  const totalPages = Math.ceil(listLength / PRODUCTS_PER_PAGE);

  const prev = document.createElement("button");
    prev.setAttribute("aria-current", "prev");
    prev.textContent = "<  PREV";
    prev.addEventListener("click", () => {
      curPage--;
      applyFiltersAndRender();
    });
  paginationContainer.appendChild(prev);
  
  if (curPage === 1) {
    prev.classList.add("hidden");
} else {
  prev.classList.remove("hidden");
}

const btnContainer = document.createElement("div");
btnContainer.classList.add("pages-container");

for (let i = 1; i <= totalPages; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  if (i === curPage) {
    btn.setAttribute("aria-current", "page");
  }
  btn.addEventListener("click", () => {
    curPage = i;
    applyFiltersAndRender();
  });
  btnContainer.appendChild(btn);
}
  paginationContainer.appendChild(btnContainer);

  const next = document.createElement("button");
    next.setAttribute("aria-current", "next");
    next.textContent = "NEXT  >";
    next.addEventListener("click", () => {
    curPage++;
    applyFiltersAndRender();
  });
  paginationContainer.appendChild(next);


if (curPage === totalPages) {
  next.classList.add("hidden");
} else {
  next.classList.remove("hidden");
}
  
}

function applyFiltersAndRender() {
  const filtered = filterProducts(productsData); // filter first
  const sorted = sortProducts(filtered); // then sort
  filteredProducts = sorted;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  if (curPage > totalPages) curPage = totalPages;

  const pageItems = getPagedItems(sorted, curPage);
  renderAllProducts(pageItems);
  renderPaginationControls(total);

  const resultsInfo = document.querySelector(".results-info");
  if (resultsInfo) {
    const start = total === 0 ? 0 : (curPage - 1) * PRODUCTS_PER_PAGE + 1;
    const end = Math.min(total, curPage * PRODUCTS_PER_PAGE);
    resultsInfo.textContent = `Showing ${start}-${end} of ${total} results`;
  }
}

[sizeFilter, colorFilter, categoryFilter, salesFilter]
  .filter((e) => (e ? true : false))
  .forEach((el) =>
    el.addEventListener("change", () => {
      curPage = 1;
      applyFiltersAndRender();
    })
  );

let searchDebounce;
searchInput?.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  curPage = 1;
  searchDebounce = setTimeout(() => applyFiltersAndRender(), 250);
});

sortSelect?.addEventListener("change", () => {
  curPage = 1;
  applyFiltersAndRender();
});

clearFilters?.addEventListener("click", () => {
  sizeFilter.value = "";
  colorFilter.value = "";
  categoryFilter.value = "";
  salesFilter.checked = false;
  curPage = 1;
  applyFiltersAndRender();
});

// show filters block
toggleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  filtersForm.classList.add('active');
  toggleBtn.classList.add('hidden');
});

// hide filters block
hideBtn.addEventListener('click', () => {
  filtersForm.classList.remove('active');
  toggleBtn.classList.remove('hidden');
});

fetchProducts();

/* -------------------------------------------
   Top Best Sets (5 random items)
-------------------------------------------- */

function renderTopBest(products) {
  const container = document.querySelector(".product-list");
  if (!container) {
    return;
  }
  const random = products.sort(() => 0.5 - Math.random()).slice(0, 5);

  container.innerHTML = "";

  random.forEach((p) => {
    const star = `
  <svg width="17" height="15">
    <use href="../images/icons.svg#rating"></use>
  </svg>
`;
    const filled = Math.round(p.rating) || 0; // ⭐ count
    const empty = 5 - filled;
    container.innerHTML += `
            <li class="top-best-product">
            <a class="mini-img-shadow" href="/html/product.html?id=${p.id}"><img src="${
      p.imageUrl
    }" alt="${
      p.name
    }" class="mini-img" onerror="this.onerror=null; this.src='../images/default.jpg';"></a>
    <div class="mini-wrapper">
    <h4><a href="/html/product.html?id=${p.id}" class="mini-name">${
      p.name
    }</a></h4>
                    <div class="mini-rating">
                      <span class="rating">${star.repeat(filled)}</span>
                      <span class="rating-empty">${star.repeat(empty)}</span>
                    </div>
                <p class="mini-price">$${p.price}</p>
    </div>                
            </li>
        `;
  });
}
