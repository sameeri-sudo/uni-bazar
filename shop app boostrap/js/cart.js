function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const controlsEl = document.getElementById("cartControls");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    controlsEl.classList.add("d-none");
    cartContainer.innerHTML = `
      <div class="alert alert-info text-center">
        <h5>🛒 Your cart is empty.</h5>
        <p><a href="index.html" class="btn btn-primary mt-2">Back to Shop</a></p>
      </div>
    `;
    totalEl.textContent = "0 rs";
    return;
  }

  controlsEl.classList.remove("d-none");
  let total = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.qty;
    total += itemSubtotal;

    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.img}" class="card-img-top" style="height:200px; object-fit:cover">
        <div class="card-body text-center">
          <h5 class="card-title">${item.name}</h5>
          <p class="mb-1">Price: ${item.price} rs</p>
          <p class="mb-1 fw-bold">Subtotal: ${itemSubtotal} rs</p>
          <p>Quantity:
            <button class="btn btn-sm btn-secondary me-1" onclick="changeQty(${index}, -1)">-</button>
            ${item.qty}
            <button class="btn btn-sm btn-secondary ms-1" onclick="changeQty(${index}, 1)">+</button>
          </p>
          <button class="btn btn-danger btn-sm mt-2" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(card);
  });

  totalEl.textContent = total + " rs";
}

function changeQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  if (confirm("Are you sure you want to clear the cart?")) {
    localStorage.removeItem("cart");
    loadCart();
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || { email: "guest@example.com" };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newOrder = {
    user: currentUser.email,
    items: cart,
    date: new Date().toLocaleString()
  };
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  // Simulate email
  let emailText = `Order Confirmation for ${currentUser.email}\n\n`;
  newOrder.items.forEach(item => {
    emailText += `- ${item.name} x ${item.qty} = ${item.price * item.qty} rs\n`;
  });
  emailText += `\nThank you for shopping with us!`;
  console.log("📧 Email Sent:\n" + emailText);

  alert("✅ Order placed and confirmation email sent (check console)!");
  loadCart();
}

// Load on page ready
document.addEventListener("DOMContentLoaded", loadCart);
