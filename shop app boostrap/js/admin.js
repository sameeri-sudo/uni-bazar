// Load products from localStorage
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  const products = getProducts();
  const container = document.getElementById("productsList");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<div class="alert alert-info">No products added yet.</div>`;
    return;
  }

  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.img}" class="card-img-top" style="height:200px; object-fit:cover">
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="mb-1 fw-bold">${product.price} rs</p>
          <button class="btn btn-warning btn-sm me-2" onclick="editProduct(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function resetForm() {
  document.getElementById("editIndex").value = "";
  document.getElementById("formTitle").innerText = "Add New Product";
  document.getElementById("productForm").reset();
}

function editProduct(index) {
  const products = getProducts();
  const product = products[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productImg").value = product.img;
  document.getElementById("formTitle").innerText = "Edit Product";
}

function deleteProduct(index) {
  if (confirm("Delete this product?")) {
    const products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    renderProducts();
  }
}

// Handle form submit
document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const price = parseInt(document.getElementById("productPrice").value);
  const img = document.getElementById("productImg").value.trim();

  let products = getProducts();
  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    // Add new
    products.push({ name, price, img });
  } else {
    // Edit existing
    products[editIndex] = { name, price, img };
  }

  saveProducts(products);
  resetForm();
  renderProducts();
  alert("✅ Product saved!");
});

// Initial render
document.addEventListener("DOMContentLoaded", renderProducts);
