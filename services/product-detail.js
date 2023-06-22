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
    Women: 'Women',
    RelatedProducts: 'Related Products'
}
/* function 
-------------------------------------------------- */
/**
 * lấy all catelogry cho phần search
 */
const getAllCatelory = () => {
    try {
        AXIOS_INS.get(DOMAIN_API_CATELORY).then((response) => {
            let result = response.data.content;
            result = [{ category: 'All' }, ...result, { category: 'Related Products' }]
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
                    let ts = document.querySelector('header form input')
                    ts.disabled = false;
                    if (text == dropDownSearchVariable.RelatedProducts) {
                        ts.disabled = true;
                    }
                });
                document.querySelector('header .navbar .dropdown-menu').appendChild(htmlEle)
            }
        })
    } catch (error) {
    }
}
/**
 * hiện thông tin user, add các sự kiện cho html user
 */
const showUserInfo = () => {
    if (isLogin()) {
        let iconUser = document.querySelector('.header__user>i')
        iconUser.classList.add('d-none')
        iconUser.classList.remove('d-block')
        let textLogin = document.querySelector('.header__user>span')
        textLogin.classList.add('d-none')
        textLogin.classList.remove('d-block')
        let userNam = document.querySelector('.header__user+div')
        userNam.classList.add('d-block')
        userNam.classList.remove('d-none')
        let userName = document.querySelector('.header__user+div>a')
        userName.innerHTML = JSON.parse(localStorage.getItem(user))
        let cartIco = document.querySelector('.header__cart')
        cartIco.classList.add('d-block')
        cartIco.classList.remove('d-none')
    }
    document.querySelector('.header__user').addEventListener('click', () => {
        if (!isLogin()) {
            window.location.href = DOMAIN_LOGIN;
        }
    })
    document.querySelector('.header__user+.dropdown .dropdown-item').addEventListener('click', () => {
        localStorage.removeItem(user);
        localStorage.removeItem(cartItems);
        location.reload();
    })
}
/**
 * render html và add các sự kiện cho cart dailog
 */
const updateCartDailog = () => {
    let te = JSON.parse(localStorage.getItem(cartItems))
    if (te !== null) {
        document.querySelector('header .header__cart__badge').innerHTML = te.length
        document.querySelector("#totalItems-dailog").innerHTML = te.length + (te.length > 1 ? ' items' : ' item')
        let htmlCon = ''
        let totalPrice = 0;
        for (let ind of te) { // các dòng record
            htmlCon += `
                <div id='record-${ind.id}' class="my-2 d-flex justify-content-between align-items-center border-bottom cart-dailog__record">
                    <div>
                        <img class="w-100" src="${ind.image}" alt="err">
                    </div>
                    <div>${ind.name}</div>
                    <div class="d-flex align-items-center  ">
                        <span class="cart-dailog__operator" id='subQuantity_${ind.id}'>-</span>
                        <input class="mx-2" value="${ind.quantity}" type="text" disabled>
                        <span class="cart-dailog__operator" id='addQuantity_${ind.id}'>+</span>
                    </div>
                    <div>${ind.price * ind.quantity} $</div>
                    <div id='remove-record-${ind.id}'>X</div>
                </div>
            `
            totalPrice += ind.price * ind.quantity;
        }
        document.querySelector('.card-dailog__listRecord').innerHTML = htmlCon;
        document.querySelector('#cart-dailog .cart-dailog__total-price').innerHTML = 'Total: ' + totalPrice.toLocaleString() + '$'
    }
    // thêm sự kiện cho các nút + trên dialog
    let addQuantity = document.querySelectorAll('#cart-dailog span[id*="addQuantity_"]')
    for (let ele of addQuantity) {
        ele.addEventListener('click', () => {
            let id = ele.id.split('_')[1]
            let te = JSON.parse(localStorage.getItem(cartItems))
            let inde = te.findIndex(n => n.id == id)
            te[inde].quantity += 1
            localStorage.setItem(cartItems, JSON.stringify(te));
            updateCartDailog()
        })
    }
    // thêm sự kiện cho các nut - trên dialog
    let subQuantity = document.querySelectorAll('#cart-dailog span[id*="subQuantity_"]')
    for (let ele of subQuantity) {
        ele.addEventListener('click', () => {
            let id = ele.id.split('_')[1]
            let te = JSON.parse(localStorage.getItem(cartItems))
            let inde = te.findIndex(n => n.id == id)
            te[inde].quantity -= 1
            if (te[inde].quantity <= 0) {
                te[inde].quantity = 1
            }
            localStorage.setItem(cartItems, JSON.stringify(te));
            updateCartDailog()
        })
    }
    // add event remove cho mỗi dòng record
    let arrRemove = document.querySelectorAll('#cart-dailog div[id*="remove-record-"]')
    for (let i in arrRemove) {
        let id = arrRemove[i].id
        if (id == undefined) return
        id = id.split('-')[2]
        arrRemove[i].addEventListener('click', () => {
            let dataLocal = JSON.parse(localStorage.getItem(cartItems))
            if (dataLocal !== null) {
                let iRemove = dataLocal.findIndex(n => n.id == id)
                if (iRemove != -1) {
                    dataLocal.splice(iRemove, 1);
                }
                localStorage.setItem(cartItems, JSON.stringify(dataLocal));
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
 * hàm xoá khoảng của string
 */
const removeSpace = (str) => {
    return str.replace(/\s/g, '');
}
/**
 * hàm kiểm tra xem người dùng đã đăng nhập chưa
 */
const isLogin = () => {
    var dataLocal = JSON.parse(localStorage.getItem(user))
    if (dataLocal !== null) {
        return true;
    }
    return false;
}
/**
 * hàm load sản phẩm lên list sản phẩm
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
        window.location.href = DOMAIN_LOGIN;
        return;
    }
    // chuẩn bị dữ liệu của người dùng
    let pro = new product();
    pro = { id, image, name, price }
    pro.quantity = 1
    // xử lí giỏ hàng và lưu vào local storage
    let cartDetailJ = JSON.parse(localStorage.getItem(cartItems))
    if (cartDetailJ === null) {
        let arListCart = []
        arListCart.push(pro)
        localStorage.setItem(cartItems, JSON.stringify(arListCart));
    }
    else {
        let iProduct = cartDetailJ.findIndex(n => n.id === id)
        if (iProduct == -1) {
            cartDetailJ.push(pro)
        } else {
            cartDetailJ[iProduct].quantity += 1
        }
        localStorage.setItem(cartItems, JSON.stringify(cartDetailJ));
    }
    // hiển thị thông báo cho người dùng
    swal("Chọn thành công");
    // update thông tin cho dailog giỏ hàng    
    updateCartDailog();
}
/**
 * hàm xử lí khi người dùng click vào xem chi tiết sản phẩm
 * @id {string} id của sản phẩm mà người dùng click vào
 */
const showProductDetail = (id) => {
    window.location.href = DOMAIN_PRODUCT_DETAIL + '?detail=' + id;
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
 * hàm load dữ liệu lên phần list product của trang product-detail
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
 * hiển thị thông tin detail của product, các sản phẩm liên qua. add sự kiện cho các phần tử html liên quan
 */
const loadDetaiProduct = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('detail');
    if (myParam) {
        try {
            AXIOS_INS.get(DOMAIN_API_PRODUCT_BY_ID + myParam).then((response) => {
                let result = response.data.content;
                // render html cho product detail
                let detail = document.querySelector('.detail .container')
                detail.innerHTML =
                    `
                    <div class="row">
                        <div class="col-12 mb-4 col-md-5 mb-md-0"><img class="w-100"
                                src="${result.image}" alt="err"></div>
                        <div class="col-12 col-md-7">
                        <h2>${result.name}</h2>
                        <p>${result.description}</p>
                        <h3>Avaliable size</h3>
                        <div class="detail__size-list d-flex">
                            <div class="detail__size-item">38</div>
                        </div>
                        <div class="my-3 detail__price">${result.price}$</div>
                        <div class="d-flex align-items-center detail__amount">
                            <button class="btn btn-success detail__subtract">-</button>
                            <div class="mx-4 detail__buy-number">1</div>
                            <button class="btn btn-success detail__add">+</button>
                        </div>
                            <button id="addToCart" class="mt-3 btn btn-danger">Add to Cart</button>
                        </div>
                    </div>
                `
                let size = document.querySelector('.detail .detail__size-list')
                let htmlSize = ''
                for (const ele of result.size) {
                    htmlSize +=
                        `
                        <div class="detail__size-item">${ele}</div>
                    `
                }
                size.innerHTML = htmlSize
                // add event cho nút +
                let plus = document.querySelector('.detail .btn.detail__add')
                plus.addEventListener('click', () => {
                    let buyNumber = document.querySelector('.detail .detail__buy-number')
                    let num = +(buyNumber.innerHTML) + 1
                    buyNumber.innerHTML = num
                    let priHtml = document.querySelector('.detail .detail__price')
                    let priNum = result.price * num
                    priHtml.innerHTML = priNum
                })
                // add event cho nút -
                let minus = document.querySelector('.detail .btn.detail__subtract')
                minus.addEventListener('click', () => {
                    let buyNumber = document.querySelector('.detail .detail__buy-number')
                    let num = +(buyNumber.innerHTML) - 1
                    if (num < 1) {
                        num = 1
                    }
                    buyNumber.innerHTML = num
                    let priHtml = document.querySelector('.detail .detail__price')
                    let priNum = result.price * num
                    priHtml.innerHTML = priNum
                })
                // thêm sự kiện cho nút add to cart
                document.getElementById('addToCart').addEventListener('click', () => {
                    // nếu người dùng chưa đăng nhập thì chuyển trang đăng nhập
                    if (!isLogin()) {
                        window.location.href = DOMAIN_LOGIN;
                        return;
                    }
                    let pro = new product();
                    pro = { ...result }
                    pro.quantity = +document.querySelector('.detail .detail__buy-number').innerHTML;
                    // xử lí giỏ hàng và lưu vào local storage
                    let cartDetailJ = JSON.parse(localStorage.getItem(cartItems))
                    if (cartDetailJ === null) {
                        let arListCart = []
                        arListCart.push(pro)
                        localStorage.setItem(cartItems, JSON.stringify(arListCart));
                    }
                    else {
                        let iProduct = cartDetailJ.findIndex(n => n.id === pro.id)
                        if (iProduct == -1) {
                            cartDetailJ.push(pro)
                        } else {
                            cartDetailJ[iProduct].quantity += pro.quantity
                        }
                        localStorage.setItem(cartItems, JSON.stringify(cartDetailJ));
                    }
                    // hiển thị thông báo cho người dùng
                    swal("Chọn thành công");
                    // update thông tin cho dailog giỏ hàng    
                    updateCartDailog();
                })
                // load dữ liệu cho phần sản phẩm liên quan
                loadProduct(result.relatedProducts)
            })
        } catch (error) { }
    }
}
/* event
-------------------------------------------------- */
/**
 * sự kiện khi người dùng nhấn vào nút serch 
 */
document.querySelector('header form button').addEventListener('click', () => {
    let eleMeSearch = document.querySelector('header form input').value;
    let eleDropCatelog = document.querySelector('header form .nav-link.dropdown-toggle').innerHTML;
    let title = document.querySelector('.products .products__title')
    title.innerHTML = '- Realate Product -'
    // nếu catalog có giá trị RelatedProducts
    if (removeSpace(eleDropCatelog) == removeSpace(dropDownSearchVariable.RelatedProducts)) {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('detail');
        if (myParam) {
            try {
                AXIOS_INS.get(DOMAIN_API_PRODUCT_BY_ID + myParam).then((response) => {
                    let result = response.data.content;
                    loadProduct(result.relatedProducts)
                })
            } catch (error) { }
        }
        return
    }
    title.innerHTML = '- Searched Product -'
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
/**
 * hiện dailog giỏ hàng khi người dùng click vào biểu tượng giỏ hàng
 */
document.querySelector('header .header__cart').addEventListener('click', () => {
    showElement('#cart-dailog')
})
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
 * người dùng nhấn nút thanh toán trong dailog giỏ hàng
 */
document.querySelector('#cart-dailog .cart-dailog__buttons .btn-success').addEventListener('click', () => {
    if (isLogin()) {
        window.location.href = DOMAIN_CART;
    } else {
        window.location.href = DOMAIN_LOGIN;
    }
})
/**
 * sự kiện khi người dung click vào nút đóng trên cart dailog
 */
document.querySelector('#cart-dailog .cart-dailog__buttons .btn-danger').addEventListener('click', () => {
    hideElement('#cart-dailog')
})
/* gọi hàm khi load page 
-------------------------------------------------- */
getAllCatelory();
updateCartDailog();
showUserInfo();
loadDetaiProduct();
