
// Lấy danh sách sản phẩm trong giỏ hàng từ localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
console.log(cartItems);
// cartItems


// Lấy phần tử HTML để chứa danh sách sản phẩm
const cartItemsContainer = document.querySelector('.cart-items-container');
// Hiển thị danh sách sản phẩm trên trang
cartItems.forEach(item => {
  const productContainer = document.createElement("div");
  productContainer.classList.add("product-container");

  const itemContainer = document.createElement('div');
  itemContainer.classList.add('cart-item');

  const itemImage = document.createElement('img');
  itemImage.classList.add('cart-image');
  itemImage.src = item.image;

  const itemName = document.createElement('h4');
  itemImage.classList.add('cart-name');
  itemName.textContent = item.name;

  const itemPrice = document.createElement('div');
  itemImage.classList.add('cart-price');
  itemPrice.textContent = `$${item.price}`;

  itemContainer.appendChild(itemImage);
  itemContainer.appendChild(itemName); 
  itemContainer.appendChild(itemPrice);

  cartItemsContainer.appendChild(itemContainer);
});

// Tính tổng số tiền cần thanh toán
const totalAmount = cartItems.reduce((total, cartItem) => {
  return total + (cartItem.price * cartItem.quantity);
}, 0);

// Hiển thị tổng số tiền cần thanh toán trên trang giỏ hàng
const totalAmountElement = document.querySelector('.total-amount');
totalAmountElement.textContent = totalAmount;