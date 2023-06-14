// GIO HANG

var cartItems = [];
function addToCart(product) {
    const item = {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        quantity: 1,

    }
    cartItems.push(item);
}

// Bắt sự kiện click vào nút thêm sản phẩm vào giỏ hàng
const addToCartButtons = document.querySelectorAll('.nút mua hàng');
addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
        const product = getProductById(event.target.dataset.productId);
        addToCart(product);
        updateCartItems();
    });
});


// Hàm cập nhật giao diện trang giỏ hàng
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items'); 
    let cartItemsHTML = ''; 
    let totalAmount = 0; 
    cartItems.forEach(item => { 
        cartItemsHTML += 
        <tr>         
            <td>${item.id}</td>
            <td>${item.image}</td>  
            <td>${item.name}</td>
            <td>${item.price}</td>  
            <td>           
                <button class="minus-quantity" data-item-id="${item.id}">-</button>${item.quantity}           
                <button class="plus-quantity" data-item-id="${item.id}">+</button>         
            </td>
            <td>${formatCurrency(item.price * item.quantity)}</td>         
            <td><button class="remove-item" data-item-id="${item.id}">Xóa</button></td>       
        </tr>; 
        totalAmount += item.price * item.quantity; 
    }); 
    cartItemsContainer.innerHTML = cartItemsHTML; 
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
                        // tong gia tien

}
                
// Luu thong tin gio hang
function setLocalStorage(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
function getLocalStorage(){
    var cartItemsString = localStorage.getItem('cartItems');
    if(cartItemsString){
        cartItems = JSON.parse(cartItemsString);
    }
}

// Bắt sự kiện trang được tải lại 
window.onload = function() { 
    // Tải thông tin giỏ hàng từ Local Storage
    getLocalStorage(); 
    // Cập nhật giao diện trang giỏ hàng 
    updateCartItems(); 
};

// Bắt sự kiện click vào nút "+" hoặc "-" để thay đổi số lượng sản phẩm trong giỏ hàng
const cartItemsContainer = document.getElementById('cart-items');
cartItemsContainer.addEventListener('click', event => {
  if (event.target.classList.contains('plus-quantity')) {
    const itemId = event.target.dataset.itemId;
    const item = cartItems.find(item => item.id === itemId);
    item.quantity++;
    updateCartItems();
    setLocalStorage();
  } else if (event.target.classList.contains('minus-quantity')) {
    const itemId = event.target.dataset.itemId;
    const item = cartItems.find(item => item.id === itemId);
    item.quantity--;
    if (item.quantity < 1) {
      cartItems = cartItems.filter(item => item.id !== itemId);
    }
    updateCartItems();
    setLocalStorage();
  } else if (event.target.classList.contains('remove-item')) {
    const itemId = event.target.dataset.itemId;
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartItems();
    setLocalStorage();
  }
});