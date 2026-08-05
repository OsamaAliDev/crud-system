var nameInput = document.getElementById("nameInput");
var priceInput = document.getElementById("priceInput");
var typeInput = document.getElementById("typeInput");
var categoryInput = document.getElementById("categoryInput");
var stockInput = document.getElementById("stockInput");
var skuInput = document.getElementById("skuInput");
var descInput = document.getElementById("descInput");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var cancelBtn = document.getElementById("cancelBtn");
var tbody = document.getElementById("tbody");
var searchInput = document.getElementById("searchInput");
var imageInput = document.getElementById("imageInput");
var previewImg = document.getElementById("previewImg");
var nameAlert = document.getElementById("nameAlert");
var priceAlert = document.getElementById("priceAlert");
var typeAlert = document.getElementById("typeAlert");
var categoryAlert = document.getElementById("categoryAlert");
var stockAlert = document.getElementById("stockAlert");
var skuAlert = document.getElementById("skuAlert");
var descAlert = document.getElementById("descAlert");

var editingIndex = -1;
var productList = JSON.parse(localStorage.getItem("products")) || [];

displayProducts();

imageInput.addEventListener("change", function () {
    previewSelectedImage(this);
});

function addProduct() {
    if (validateName() && validatePrice() && validateType() && validateCategory() && validateStock() && validateSKU() && validateDesc()) {
        var file = imageInput.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                saveNewProduct(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveNewProduct("");
        }
    }
}

function saveNewProduct(imageData) {
    var product = {
        name: nameInput.value.trim(),
        price: priceInput.value,
        type: typeInput.value.trim(),
        category: categoryInput.value.trim(),
        stock: stockInput.value,
        sku: skuInput.value.trim(),
        desc: descInput.value.trim(),
        image: imageData
    };

    productList.push(product);
    saveProducts();
    displayProducts();
    clearForm();
}

function clearForm() {
    nameInput.value = "";
    priceInput.value = "";
    typeInput.value = "";
    categoryInput.value = "";
    stockInput.value = "";
    skuInput.value = "";
    descInput.value = "";
    imageInput.value = "";
    previewImg.src = "";
    previewImg.classList.add("d-none");
    editingIndex = -1;

    [nameInput, priceInput, typeInput, categoryInput, stockInput, skuInput, descInput].forEach(function (input) {
        input.classList.remove("is-valid", "is-invalid");
    });

    hideAlerts();
    showActionButtons("add");
}

function hideAlerts() {
    [nameAlert, priceAlert, typeAlert, categoryAlert, stockAlert, skuAlert, descAlert].forEach(function (alert) {
        alert.classList.add("d-none");
    });
}

function displayProducts() {
    renderProducts(searchInput.value);
}

function renderProducts(filterText) {
    var text = (filterText || "").toLowerCase().trim();
    var box = "";
    var matchedProducts = [];

    for (var i = 0; i < productList.length; i++) {
        var product = productList[i];
        var fullText = `${product.name} ${product.type} ${product.category} ${product.sku} ${product.desc}`.toLowerCase();

        if (fullText.includes(text)) {
            matchedProducts.push({ index: i, product: product });
        }
    }

    if (matchedProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-4">No products found for this search.</td>
            </tr>`;
        return;
    }

    for (var j = 0; j < matchedProducts.length; j++) {
        var data = matchedProducts[j];
        var isEditing = data.index === editingIndex;

        box += `
            <tr class="${isEditing ? "table-active" : ""}">
                <th scope="row">${data.index + 1}</th>
                <td><img src="${data.product.image || ""}" alt="product" /></td>
                <td>${data.product.name}</td>
                <td>${data.product.price}</td>
                <td>${data.product.type}</td>
                <td>${data.product.category}</td>
                <td>${data.product.stock}</td>
                <td>${data.product.sku}</td>
                <td>${data.product.desc}</td>
                <td>
                    <button class="btn btn-warning me-2" onclick="getData(${data.index})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${data.index})">Delete</button>
                </td>
            </tr>`;
    }

    tbody.innerHTML = box;
}

function deleteProduct(index) {
    if (index < 0 || index >= productList.length) {
        return;
    }

    productList.splice(index, 1);
    saveProducts();

    if (editingIndex === index) {
        clearForm();
    } else if (editingIndex > index) {
        editingIndex -= 1;
    }

    displayProducts();
}

function searchProduct() {
    renderProducts(searchInput.value);
}

function getData(index) {
    if (!productList[index]) {
        return;
    }

    editingIndex = index;
    nameInput.value = productList[index].name;
    priceInput.value = productList[index].price;
    typeInput.value = productList[index].type;
    categoryInput.value = productList[index].category || "";
    stockInput.value = productList[index].stock || "";
    skuInput.value = productList[index].sku || "";
    descInput.value = productList[index].desc;

    if (productList[index].image) {
        previewImg.src = productList[index].image;
        previewImg.classList.remove("d-none");
    } else {
        previewImg.src = "";
        previewImg.classList.add("d-none");
    }

    showActionButtons("update");
    renderProducts(searchInput.value);
}

function updateProduct() {
    if (editingIndex === -1) {
        return;
    }

    if (!validateName() || !validatePrice() || !validateType() || !validateCategory() || !validateStock() || !validateSKU() || !validateDesc()) {
        return;
    }

    var file = imageInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            applyUpdate(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        applyUpdate(productList[editingIndex].image);
    }
}

function applyUpdate(imageData) {
    productList[editingIndex].name = nameInput.value.trim();
    productList[editingIndex].price = priceInput.value;
    productList[editingIndex].type = typeInput.value.trim();
    productList[editingIndex].category = categoryInput.value.trim();
    productList[editingIndex].stock = stockInput.value;
    productList[editingIndex].sku = skuInput.value.trim();
    productList[editingIndex].desc = descInput.value.trim();
    productList[editingIndex].image = imageData;

    saveProducts();
    displayProducts();
    clearForm();
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(productList));
}

function showActionButtons(mode) {
    addBtn.classList.toggle("d-none", mode !== "add");
    updateBtn.classList.toggle("d-none", mode !== "update");
    cancelBtn.classList.toggle("d-none", mode !== "update");
}

function cancelEdit() {
    clearForm();
    renderProducts(searchInput.value);
}

function previewSelectedImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove("d-none");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function validateName() {
    var regex = /^[A-Z][a-z]{3,8}$/;
    var text = nameInput.value.trim();
    if (regex.test(text)) {
        nameAlert.classList.add("d-none");
        nameInput.classList.add("is-valid");
        nameInput.classList.remove("is-invalid");
        return true;
    } else {
        nameAlert.classList.remove("d-none");
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
        return false;
    }
}

function validatePrice() {
    var value = parseFloat(priceInput.value);
    if (!isNaN(value) && value > 0) {
        priceAlert.classList.add("d-none");
        priceInput.classList.add("is-valid");
        priceInput.classList.remove("is-invalid");
        return true;
    } else {
        priceAlert.classList.remove("d-none");
        priceInput.classList.add("is-invalid");
        priceInput.classList.remove("is-valid");
        return false;
    }
}

function validateType() {
    var text = typeInput.value.trim();
    if (text.length >= 2) {
        typeAlert.classList.add("d-none");
        typeInput.classList.add("is-valid");
        typeInput.classList.remove("is-invalid");
        return true;
    } else {
        typeAlert.classList.remove("d-none");
        typeInput.classList.add("is-invalid");
        typeInput.classList.remove("is-valid");
        return false;
    }
}

function validateCategory() {
    var text = categoryInput.value.trim();
    if (text.length >= 2) {
        categoryAlert.classList.add("d-none");
        categoryInput.classList.add("is-valid");
        categoryInput.classList.remove("is-invalid");
        return true;
    } else {
        categoryAlert.classList.remove("d-none");
        categoryInput.classList.add("is-invalid");
        categoryInput.classList.remove("is-valid");
        return false;
    }
}

function validateStock() {
    var value = parseInt(stockInput.value, 10);
    if (!isNaN(value) && value >= 0) {
        stockAlert.classList.add("d-none");
        stockInput.classList.add("is-valid");
        stockInput.classList.remove("is-invalid");
        return true;
    } else {
        stockAlert.classList.remove("d-none");
        stockInput.classList.add("is-invalid");
        stockInput.classList.remove("is-valid");
        return false;
    }
}

function validateSKU() {
    var text = skuInput.value.trim();
    var regex = /^[a-zA-Z0-9]{3,10}$/;
    if (regex.test(text)) {
        skuAlert.classList.add("d-none");
        skuInput.classList.add("is-valid");
        skuInput.classList.remove("is-invalid");
        return true;
    } else {
        skuAlert.classList.remove("d-none");
        skuInput.classList.add("is-invalid");
        skuInput.classList.remove("is-valid");
        return false;
    }
}

function validateDesc() {
    var text = descInput.value.trim();
    if (text.length >= 5) {
        descAlert.classList.add("d-none");
        descInput.classList.add("is-valid");
        descInput.classList.remove("is-invalid");
        return true;
    } else {
        descAlert.classList.remove("d-none");
        descInput.classList.add("is-invalid");
        descInput.classList.remove("is-valid");
        return false;
    }
}