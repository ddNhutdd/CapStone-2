import product from "../model/product.js";
import category from "../model/category.js";
/* variable 
-------------------------------------------------- */
const dropDownSearchVariable = {
    All: 'All',
    Adidas: 'Adidas',
    Men: 'Men',
    Nike: 'Nike',
    VansConverse: 'Vans Converse',
    Women: 'Women'
}
/* function 
-------------------------------------------------- */
/**
 * hàm load dữ liệu lên phần list product của trang index
 */
const loadAllProduct = () => {
    try {
        AXIOS_INS.get(DOMAIN_API_PRODUCT).then((response) => {
            let result = response.data.content;
            loadProduct(result);
        })
    } catch (error) { }
}
/**
 * hàm load Catelory lên phần search
 */
const getAllCatelory = () => {
    try {
        AXIOS_INS.get(DOMAIN_API_CATELORY).then((response) => {
            let result = response.data.content;
            result = [{ category: 'All' }, ...result]
            for (let i = 0; i < result.length; i++) {
                const ele = result[i];
                let text = ''
                text = ele.category.toLowerCase();
                text = text.replace(/\b\w/g, l => l.toUpperCase())
                let htmlEle = document.createElement('a')
                htmlEle.innerHTML = text
                htmlEle.className = "dropdown-item";
                htmlEle.addEventListener("click", () => {
                    document.querySelector('header .navbar .nav-link.dropdown-toggle').innerHTML = text;
                });
                document.querySelector('header .navbar .dropdown-menu').appendChild(htmlEle)
            }
        })
    } catch (error) {
    }
}
/**
 * hàm load sản phẩm lên giao diện
 * @listProduct {array} : danh sách sản phẩm cần load lên giao diện
 */
const loadProduct = (listProduct) => {
    let eleList = document.querySelector('.products .products__list');
    let htmlRender = '';
    for (let i = 0; i < listProduct.length; i++) {
        const ele = listProduct[i];
        htmlRender += `
            <div class="products__item d-flex flex-column justify-content-between">
            <div class="products__item__body flex-fill" id="product-${ele.id}">
                <div class="products__item__img">
                    <img class="img-fluid" src="${ele.image}"
                        alt="err">
                </div>
                <div class="products__item__text">
                    <h3 class="products__item__text__title">
                        ${ele.name}
                    </h3>
                    <p class="products__item__text__decription mb-0">
                        ${ele.shortDescription}
                    </p>
                </div>
            </div>
            <div class="products__item__footer d-flex align-items-stretch">
                <div class="products__item__buy-now text-center" id="buy_${ele.id}_${ele.image}_${ele.name}_${ele.price}">
                    Buy now
                </div>
                <div class="products__item__price text-center">
                    ${ele.price}$
                </div>
            </div>
        </div>
    `;
    }
    eleList.innerHTML = htmlRender;
    let lstBuyNow = document.querySelectorAll('.products .products__item__buy-now');
    for (let i = 0; i < lstBuyNow.length; i++) {
        let ele = lstBuyNow[i];
        ele.addEventListener('click', () => {
            let [des, id, image, name, price] = ele.id.split('_');
            buyProductClick(id, image, name, price);
        });
    }
    let lstProduct = document.querySelectorAll('.products .products__item__body');
    for (let i = 0; i < lstProduct.length; i++) {
        let ele = lstProduct[i];
        ele.addEventListener('click', () => {
            let jb = ele.id.split('-')[1];
            showProductDetail(jb);
        });
    }
}
/**
 * hàm xử lí khi người dùng click mua button sản phẩm. 
 * @id {string}: mã sản phẩm mà khách hàng đã click
 * @imgage {string}: đường dẫn hiển thị hình ảnh của sản phẩm
 * @name {string}: tên của sản phẩm
 * @price {string}: giá của một sản phẩm theo số lượng là 1
 */
const buyProductClick = (id, image, name, price) => {
    // nếu người dùng chưa đăng nhập thì chuyển trang đăng nhập
    if (!isLogin()) {
        //window.location.href = DOMAIN_LOGIN;
    }
    // chuẩn bị dữ liệu của người dùng
    let pro = new product();
    pro = { id, image, name, price }
    pro.quantity = 1
    // xử lí giỏ hàng và lưu vào local storage
    let cartDetailJ = JSON.parse(localStorage.getItem(STR_LIST_PRODUCT_IN_CART))
    if (cartDetailJ === null) {
        let arListCart = []
        arListCart.push(pro)
        localStorage.setItem(STR_LIST_PRODUCT_IN_CART, JSON.stringify(arListCart));
    }
    else {
        let iProduct = cartDetailJ.findIndex(n => n.id === id)
        if (iProduct == -1) {
            cartDetailJ.push(pro)
        } else {
            cartDetailJ[iProduct].quantity += 1
        }
        localStorage.setItem(STR_LIST_PRODUCT_IN_CART, JSON.stringify(cartDetailJ));
    }
    // hiển thị thông báo cho người dùng
    swal("Chọn thành công");
    // update thông tin cho dailog giỏ hàng    
    updateCartDailog();
}
/**
 * update thông tin cho cart dailog
 */
const updateCartDailog = () => {
    let te = JSON.parse(localStorage.getItem(STR_LIST_PRODUCT_IN_CART))
    if (te !== null) {
        document.querySelector('header .header__cart__badge').innerHTML = te.length
        document.querySelector("#totalItems-dailog").innerHTML = te.length + (te.length > 1 ? ' items' : ' item')
        let htmlCon = ''
        let totalPrice = 0;
        for (let ind in te) {
            htmlCon += `
                <div id='record-${te[ind].id}' class="my-2 d-flex justify-content-between align-items-center border-bottom cart-dailog__record">
                    <div>
                        <img class="w-100" src="${te[ind].image}" alt="err">
                    </div>
                    <div>${te[ind].name}</div>
                    <div class="d-flex align-items-center  ">
                        <span class="cart-dailog__operator" id='subQuantity_${te[ind].id}'>-</span>
                        <input class="mx-2" value="${te[ind].quantity}" type="text" disabled>
                        <span class="cart-dailog__operator" id='addQuantity_${te[ind].id}'>+</span>
                    </div>
                    <div>${te[ind].price * te[ind].quantity} $</div>
                    <div id='remove-record-${te[ind].id}'>X</div>
                </div>
            `
            totalPrice += te[ind].price * te[ind].quantity;
        }
        document.querySelector('.card-dailog__listRecord').innerHTML = htmlCon;
        document.querySelector('#cart-dailog .cart-dailog__total-price').innerHTML = 'Total: ' + totalPrice.toLocaleString() + '$'
    }
    let arrRemove = document.querySelectorAll('#cart-dailog div[id*="remove-record-"]')
    for (let i in arrRemove) {
        let id = arrRemove[i].id
        if (id == undefined) return
        id = id.split('-')[2]
        arrRemove[i].addEventListener('click', () => {
            let dataLocal = JSON.parse(localStorage.getItem(STR_LIST_PRODUCT_IN_CART))
            if (dataLocal !== null) {
                let iRemove = dataLocal.findIndex(n => n.id == id)
                if (iRemove != -1) {
                    dataLocal.splice(iRemove, 1);
                }
                localStorage.setItem(STR_LIST_PRODUCT_IN_CART, JSON.stringify(dataLocal));
                let eleListRecord = document.querySelector('#cart-dailog .card-dailog__listRecord')
                let eleRecordDeleted = document.getElementById('record-' + id)
                eleListRecord.removeChild(eleRecordDeleted);
                document.querySelector('header .header__cart__badge').innerHTML = dataLocal.length
                document.querySelector("#totalItems-dailog").innerHTML = dataLocal.length + (dataLocal.length > 1 ? ' items' : ' item')
                let totalPrice = 0;
                dataLocal.forEach(ele => {
                    totalPrice += +ele.price
                });
                document.querySelector('#cart-dailog .cart-dailog__total-price').innerHTML = 'Total: ' + totalPrice.toLocaleString() + '$'
            }
        })
    }
}
/**
 * hàm xử lí khi người dùng click vào xem chi tiết sản phẩm
 * @id {string} id của sản phẩm mà người dùng click vào
 */
const showProductDetail = (id) => {
    window.location.href = DOMAIN_PRODUCT_DETAIL + '?detail=' + id;
}
/**
 * hàm kiểm tra xem người dùng đã đăng nhập chưa
 */
const isLogin = () => {
    return true;
}
/**
 * hàm hiển thị phần tử lên giao diện
 * @cssSelectorString {string} css selector đến phần tử cần hiển thị
 */
const showElement = (cssSelectorString) => {
    let element = document.querySelector(cssSelectorString)
    element.classList.remove('d-none')
    element.classList.add('d-block')
}
/**
 * hàm ẩn phần tử trên giao diện
 * @cssSelectorString {string} css selector đến phần tử cần ẩn đi
 */
const hideElement = (cssSelectorString) => {
    let element = document.querySelector(cssSelectorString)
    element.classList.remove('d-block')
    element.classList.add('d-none')
}
/**
 * hàm xoá khoảng của string
 */
const removeSpace = (str) => {
    return str.replace(/\s/g, '');
}
/* event
-------------------------------------------------- */
/**
 * khi click vào nền xung quanh dailog
 */
document.getElementById('cart-dailog').addEventListener('click', () => {
    hideElement('#cart-dailog')
})
/**
 * ngăn chặn phần tử con được click
 */
document.querySelector('#cart-dailog .cart').addEventListener('click', (e) => e.stopPropagation())
/**
 * hiện dailog giỏ hàng khi người dùng click vào biểu tượng giỏ hàng
 */
document.querySelector('header .header__cart').addEventListener('click', () => {
    showElement('#cart-dailog')
})
/**
 * người dùng nhấn nút thanh toán trong dailog giỏ hàng
 */
document.querySelector('#cart-dailog .cart-dailog__buttons .btn-success').addEventListener('click', () => {
})
/**
 * sự kiện khi người dung click vào nút đóng trên cart dailog
 */
document.querySelector('#cart-dailog .cart-dailog__buttons .btn-danger').addEventListener('click', () => {
    hideElement('#cart-dailog')
})
/**
 * sự kiện khi người dùng nhấn vào nút serch 
 */
document.querySelector('header form button').addEventListener('click', () => {
    let eleMeSearch = document.querySelector('header form input').value;
    let eleDropCatelog = document.querySelector('header form .nav-link.dropdown-toggle').innerHTML;
    // nếu catelog == all và input search rỗng
    if (removeSpace(eleDropCatelog) == dropDownSearchVariable.All && eleMeSearch == '') {
        loadAllProduct();
        return;
    }
    // nếu catelog == all và input search có giá trị
    if (removeSpace(eleDropCatelog) == dropDownSearchVariable.All && eleMeSearch != '') {
        try {
            AXIOS_INS.get(DOMAIN_API_PRODUCT).then((response) => {
                let result = response.data.content;
                let disData = [];
                let stringSearch = removeSpace(eleMeSearch).toLowerCase()
                disData = result.filter(n => {
                    let name = removeSpace(n.name).toLowerCase();
                    return name.includes(stringSearch);
                })
                loadProduct(disData);
            })
        } catch (err) { }
    }
    // nếu catelog có giá trị và input search rỗng
    if (removeSpace(eleDropCatelog) != dropDownSearchVariable.All && eleMeSearch == '') {
        let te = eleDropCatelog.trimStart().trimEnd().toUpperCase().replace(/\s/g, '_');
        try {
            AXIOS_INS.get(DOMAIN_API_PRODUCT_BY_CATELORY + te).then((response) => {
                loadProduct(response.data.content)
            })
        } catch (error) { }
    }
    // nếu catelog có giá trị và input search có giá trị
    if (removeSpace(eleDropCatelog) != dropDownSearchVariable.All && eleMeSearch != '') {
        let te = eleDropCatelog.trimStart().trimEnd().toUpperCase().replace(/\s/g, '_');
        let stringSearch = removeSpace(eleMeSearch).toLowerCase();
        try {
            AXIOS_INS.get(DOMAIN_API_PRODUCT_BY_CATELORY + te).then((response) => {
                let result = response.data.content;
                let disData = [];
                disData = result.filter(n => {
                    let name = removeSpace(n.name).toLowerCase();
                    return name.includes(stringSearch);
                })
                loadProduct(disData);
            })
        } catch (error) { }
    }
})
/* gọi hàm khi load page 
-------------------------------------------------- */
loadAllProduct();
getAllCatelory();
updateCartDailog();
