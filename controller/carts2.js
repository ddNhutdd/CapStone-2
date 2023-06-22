// Tên người dùng
const nameCarts = JSON.parse(localStorage.getItem('user'));
const nameUser = document.getElementById('nameUser');
nameUser.innerHTML = nameCarts;
// Lấy danh sách sản phẩm trong giỏ hàng từ localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
// Lấy phần tử HTML để chứa danh sách sản phẩm
const cartItemsContainer = document.querySelector('.cart-items-container');
function renderCartItems() {
  let renderCarts = '';
  let total = 0;
  const cartTotal_1 = document.querySelector('#total-amount');
  const cartTotal_2 = document.querySelector('#total-sub');
  cartItems.forEach((item, index) => {
    renderCarts += `
            <tr>
              <td><img class="cart-image w-50"  src="${item.image}"></td>  
              <td><h4 class="cart-name">${item.name}</h4></td>  
              <td> <span class="cart-price">$${item.price}</span></td> 
                <td>
                  <button type="button" class="btn btn-success minus"data-index="${index}">-</button>
                  <input type="text" class="cart-quantity text-center w-25" value="${item.quantity}"readonly>
                  <button type="button" class="btn btn-success plus" data-index="${index}">+</button>
                </td>
                <td>$${item.price * item.quantity}</td>
                <td><button class=" btn btn-danger "><i class="fa-solid fa-trash-can cart-item-delete" data-index="${index}"></i></button></td>
            </tr>
        `;
    total += item.price * item.quantity;
  });
  cartItemsContainer.innerHTML = renderCarts;
  cartTotal_1.innerHTML = total;
  cartTotal_2.innerHTML = total;

  // Lưu lại giá trị giỏ hàng vào localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
// Lắng nghe sự kiện click của nút tăng/giảm số lượng sản phẩm
cartItemsContainer.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('minus')) {
    const quantityInput = target.nextElementSibling;
    const quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      updateCartItemQuantity(cartItems[target.dataset.index], quantity - 1);
    }
  } else if (target.classList.contains('plus')) {
    const quantityInput = target.previousElementSibling;
    const quantity = parseInt(quantityInput.value);
    updateCartItemQuantity(cartItems[target.dataset.index], quantity + 1);
  } else if (target.classList.contains('cart-item-delete')) {
    deleteCartItem(target.dataset.index);
  }
});
// Thay đổi giá trị số lượng sản phẩm và cập nhật lại danh sách trên trang
function updateCartItemQuantity(item, quantity) {
  item.quantity = quantity;
  renderCartItems();
}
// Xóa sản phẩm khỏi giỏ hàng và cập nhật lại danh sách trên trang
function deleteCartItem(itemIndex) {
  cartItems.splice(itemIndex, 1);
  renderCartItems();
}
renderCartItems();
