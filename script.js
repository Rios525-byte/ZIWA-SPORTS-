/* -------------------------
   ZIWA SPORTS - script.js
   Handles product loading, search, cart, modals, etc.
   ------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const grid = document.querySelector(".grid");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const cartPanel = document.getElementById("cart-panel");
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");
  const totalPriceEl = document.getElementById("total-price");
  const closeCartBtn = document.getElementById("close-cart");
  const viewCartBtn = document.getElementById("view-cart");
  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDesc = document.getElementById("modal-desc");
  const modalPrice = document.getElementById("modal-price");
  const closeModalBtn = document.getElementById("close-modal");

  let products = [];
  let cart = [];

  /* ---- Fetch Products ---- */
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts(products);
      hideLoading();
    })
    .catch(err => {
      console.error("Error loading products:", err);
      hideLoading();
    });

  function hideLoading() {
    loadingScreen.style.opacity = "0";
    setTimeout(() => loadingScreen.remove(), 500);
  }

  /* ---- Render Products ---- */
  function renderProducts(items) {
    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = "<p class='center muted'>No products found.</p>";
      return;
    }

    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="badge">${p.badge || "NEW"}</div>
        <div class="image"><img src="${p.image}" alt="${p.title}" onerror="this.src='fallback.jpg'"/></div>
        <div class="card-body">
          <div class="title">${p.title}</div>
          <div class="short">${p.short}</div>
          <div class="price">₹${p.price}</div>
          <div class="actions">
            <button class="btn btn-view">View</button>
            <button class="btn btn-cart">Add</button>
            <button class="btn btn-buy">Buy</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-view").addEventListener("click", () => openModal(p));
      card.querySelector(".btn-cart").addEventListener("click", () => addToCart(p));
      card.querySelector(".btn-buy").addEventListener("click", () => openWhatsApp(p));

      grid.appendChild(card);
    });
  }

  /* ---- Search & Sort ---- */
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(val));
    renderProducts(filtered);
  });

  sortSelect.addEventListener("change", () => {
    let sorted = [...products];
    if (sortSelect.value === "low-high") sorted.sort((a, b) => a.price - b.price);
    else if (sortSelect.value === "high-low") sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
  });

  /* ---- Cart ---- */
  function addToCart(product) {
    const found = cart.find(item => item.id === product.id);
    if (found) found.qty += 1;
    else cart.push({ ...product, qty: 1 });
    updateCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    updateCart();
  }

  function updateCart() {
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <strong>${item.title}</strong><br>
          <small>₹${item.price} × ${item.qty}</small>
        </div>
        <button class="btn-remove" style="margin-left:auto;background:none;border:0;color:red;font-weight:bold;">×</button>
      `;
      div.querySelector(".btn-remove").addEventListener("click", () => removeFromCart(item.id));
      cartList.appendChild(div);
    });
    totalPriceEl.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
  }

  viewCartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("hidden");
  });

  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.add("hidden");
  });

  /* ---- Modal ---- */
  function openModal(p) {
    modalTitle.textContent = p.title;
    modalImage.src = p.image;
    modalDesc.textContent = p.description || p.short;
    modalPrice.textContent = "₹" + p.price;
    modal.style.display = "flex";
  }
  closeModalBtn.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* ---- WhatsApp Buy ---- */
  function openWhatsApp(p) {
    const message = `Hello! I’d like to order this product:\n${p.title}\nPrice: ₹${p.price}`;
    const phone = "6369374676";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  /* ---- Game ---- */
  const gameArea = document.getElementById("game-area");
  if (gameArea) {
    const colors = ["#0b3d91", "#ff5a1f", "#25D366", "#222"];
    for (let i = 0; i < 6; i++) {
      const shirt = document.createElement("div");
      shirt.className = "shirt";
      shirt.style.background = colors[i % colors.length];
      shirt.style.left = Math.random() * 90 + "%";
      shirt.style.top = Math.random() * 80 + "%";
      shirt.textContent = "👕";
      gameArea.appendChild(shirt);
      moveShirt(shirt);
    }
  }

  function moveShirt(shirt) {
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    let x = parseFloat(shirt.style.left);
    let y = parseFloat(shirt.style.top);
    setInterval(() => {
      x += dx;
      y += dy;
      if (x < 0 || x > 90) x = Math.random() * 90;
      if (y < 0 || y > 80) y = Math.random() * 80;
      shirt.style.left = x + "%";
      shirt.style.top = y + "%";
    }, 200);
  }

  /* ---- PWA (Service Worker) ---- */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(err => console.log("SW fail:", err));
  }
});
