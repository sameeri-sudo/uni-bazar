// 👉 This runs once DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  // ✅ LOGIN HANDLER
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
  
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find(user => user.email === email && user.password === password);
  
      if (foundUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        alert(`Welcome back, ${foundUser.name}!`);
        this.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("authModal"));
        modal.hide();
        location.reload();
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }

  // ✅ SIGNUP HANDLER
  const signupForm = document.querySelector("#signup form");
  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = users.some(user => user.email === email);

      if (emailExists) {
        alert("This email is already registered. Please log in.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      alert("Signup successful! Welcome, " + name);
      const modal = bootstrap.Modal.getInstance(document.getElementById("authModal"));
      modal.hide();
      location.reload();
    });
  }

  // ✅ SHOW LOGGED-IN USER IN NAVBAR
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (currentUser) {
    const authButtons = document.getElementById("authButtons");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeUser = document.getElementById("welcomeUser");

    if (authButtons && logoutBtn && welcomeUser) {
      authButtons.classList.add("d-none");
      logoutBtn.classList.remove("d-none");
      welcomeUser.innerHTML = `<a class="nav-link disabled">Welcome, ${currentUser.name}</a>`;
    }
  }

  // ✅ INITIAL BADGE UPDATE
  updateCartBadge();

  // ✅ LOAD PRODUCTS DYNAMICALLY (if this page has a container)
  loadProducts();
});


// ✅ LOGOUT HANDLER (needs to be global)
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  location.reload();
}


// ✅ UPDATE CART BADGE
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = count;
}


// ✅ SEARCH FUNCTION
function searchProducts(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    if (title.includes(query)) {
      card.parentElement.style.display = "";
    } else {
      card.parentElement.style.display = "none";
    }
  });
}


// ✅ LOAD PRODUCTS FROM LOCALSTORAGE AND RENDER THEM
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const container = document.getElementById("productsContainer");

  if (!container) return;  // This page doesn't need products grid

  if (products.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info text-center">No products available. Please check back later!</div>
    `;
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Render each product card
  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.img}" class="card-img-top" alt="${product.name}">
        <div class="card-body text-center rounded">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.price}rs</p>
          <a href="#" class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}">Add to Cart</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // Re-bind Add-to-Cart buttons
  bindAddToCartButtons();
}


// ✅ BIND ADD TO CART BUTTONS
function bindAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();

      const name = this.dataset.name;
      const price = parseInt(this.dataset.price);
      const img = this.dataset.img;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${name} added to cart!`);
      updateCartBadge();
    });
  });
}
