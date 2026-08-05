var nameInput = document.getElementById("nameInput");
var priceInput = document.getElementById("priceInput");
var typeInput = document.getElementById("typeInput");
var descInput = document.getElementById("descInput");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var tbody = document.getElementById("tbody");
var searchInput = document.getElementById("searchInput");
// ⬇️⬇️⬇️
var imageInput = document.getElementById("imageInput");
var previewImg = document.getElementById("previewImg");
var nameAlert = document.getElementById("nameAlert");
var priceAlert = document.getElementById("priceAlert");
var typeAlert = document.getElementById("typeAlert");
var descAlert = document.getElementById("descAlert");
var crntIndex = -1; //لاضافه ترتيب للمنتجات علشان اعدلها

var productList = JSON.parse(localStorage.getItem("products")) || [];
displayProducts();


function addProduct() {
    if (validateName() && validatePrice() && validateType() && validateDesc()) {
        var file = imageInput.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                saveNewProduct(e.target.result); // e.target.result = الصورة كـ base64
            };
            reader.readAsDataURL(file);
        } else {
            saveNewProduct("");
        }
    }
}

function saveNewProduct(imageData) {
    var product = {
        name: nameInput.value,
        price: priceInput.value,
        type: typeInput.value,
        desc: descInput.value,
        image: imageData
    };
    productList.push(product);
    localStorage.setItem("products", JSON.stringify(productList));
    displayProducts();
    clearForm();
    console.log(productList);
}

function clearForm() {
    nameInput.value = "";
    priceInput.value = "";
    typeInput.value = "";
    descInput.value = "";
    imageInput.value = "";

    [nameInput, priceInput, typeInput, descInput].forEach(function (input) {
        input.classList.remove("is-valid", "is-invalid");
    });
}

function displayProducts() {
    var box = "";
    for (var i = 0; i < productList.length; i++) {
        box += `  <tr>
              <th scope="row">${i + 1}</th>
              <td><img src="${productList[i].image}"  style="width: 60px; height: 60px; object-fit: cover;" class="rounded"></td>
              <td>${productList[i].name}</td>
              <td>${productList[i].price}</td>
              <td>${productList[i].type}</td>
              <td>${productList[i].desc}</td>
              <td>
                <button id="editBtn" class="btn btn-warning" onclick="getData(${i})">edit</button>
                <button id="deleteBtn" class="btn btn-danger" onclick="deleteProduct(${i})">delete</button>
              </td>
            </tr>`;
    }
    tbody.innerHTML = box;
}

function deleteProduct(index) {
    productList.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(productList));
    console.log(productList);
    displayProducts();
}

function searchProduct() {
    var text = searchInput.value.toLowerCase();
    var box = "";
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].name.toLowerCase().includes(text)) {
            box += `  <tr>
              <th scope="row">${i + 1}</th>
           
              <td><img src="${productList[i].image}" alt="product" style="width: 60px; height: 60px; object-fit: cover;" class="rounded"></td>
              <td>${productList[i].name}</td>
              <td>${productList[i].price}</td>
              <td>${productList[i].type}</td>
              <td>${productList[i].desc}</td>
              <td>
                <button id="editBtn" class="btn btn-warning"onclick="getData(${i})">edit</button>
                <button id="deleteBtn" class="btn btn-danger" onclick="deleteProduct(${i})">delete</button>
              </td>
            </tr>`;
        }
    }
    tbody.innerHTML = box;
}
function getData(index) {
    crntIndex = index;
    nameInput.value = productList[index].name
    priceInput.value = productList[index].price
    typeInput.value = productList[index].type
    descInput.value = productList[index].desc
    //////////////////////////////////////////
    previewImg.src = productList[index].image;
    previewImg.classList.remove('d-none');
    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
}
////////////
function updateProduct() {
    var file = imageInput.files[0];

    if (file) {
        
        var reader = new FileReader();
        reader.onload = function (e) {
            applyUpdate(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {

        applyUpdate(productList[crntIndex].image);
    }
}

function applyUpdate(imageData) {
    productList[crntIndex].name = nameInput.value;
    productList[crntIndex].price = priceInput.value;
    productList[crntIndex].type = typeInput.value;
    productList[crntIndex].desc = descInput.value;
    productList[crntIndex].image = imageData;

    localStorage.setItem("products", JSON.stringify(productList));
    displayProducts();
    clearForm();
    previewImg.classList.add('d-none');

    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
}
function validateName() {
    var regex = /^[A-Z][a-z]{3,8}$/;
    var text = nameInput.value;
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