import product from "../model/product.js";
import category from "../model/category.js";
/* function 
-------------------------------------------------- */
/**
 * hàm load dữ liệu lên phần list product của trang index
 */
const loadProduct = () => {
    try {
        AXIOS_INS.get(DOMAIN_API_PRODUCT).then((response) => {
            let result = response.data.content;
            let eleList = document.querySelector('.products .products__list')
            let htmlRender = ''
            for (let i = 0; i < result.length; i++) {
                const ele = result[i]
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
                    <div class="products__item__buy-now text-center" id="buy-${ele.id}-${ele.image}-${ele.name}-${ele.price}">
                        Buy now
                    </div>
                    <div class="products__item__price text-center">
                        ${ele.price}$
                    </div>
                </div>
            </div>
                `  
            }
            eleList.innerHTML = htmlRender;
            let lstBuyNow = document.querySelectorAll('.products .products__item__buy-now')
            for (let i = 0; i < lstBuyNow.length; i++) {
                let ele = lstBuyNow[i];
                ele.addEventListener('click', () => {
                    let [des, id, image, name, price] = ele.id.split('-')
                    buyProductClick(id, image, name, price)
                })
            }
            let lstProduct = document.querySelectorAll('.products .products__item__body')
            for (let i = 0; i < lstProduct.length; i++) {
                let ele = lstProduct[i];
                ele.addEventListener('click', () => {
                    let jb = ele.id.split('-')[1]
                    showProductDetail(jb)
                })
            }
        })
    } catch (error) {
    }
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
 * hàm xử lí khi người dùng click mua button sản phẩm. 
 * @id {string}: mã sản phẩm mà khách hàng đã click
 */
const buyProductClick = (id, image, name, price) => {
    console.log(id)
    console.log(image)
    console.log(name)
    console.log(price)
    // nếu người dùng chưa đăng nhập thì chuyển trang đăng nhập
    if (!isLogin()) {
        console.log('chưa đăng nhập nên chuyển trang')
        //window.location.href = DOMAIN_LOGIN;
    }
    // chuẩn bị dữ liệu của người dùng
    let pro = new product();
    pro = {id, image, name, price}
    console.log("product: ", pro);
    // kiểm tra giỏ hàng
    let cartDetailJ = JSON.parse(localStorage.getItem(STR_LIST_PRODUCT_IN_CART))
    if (cartDetailJ !== null) {
        
    }
    // hiển thị lên dailog sản phẩm đã chọn mua
}
/// hàm xử lí khi người dùng click vào xem chi tiết sản phẩm
const showProductDetail = (id) => {
    //window.location.href = DOMAIN_PRODUCT_DETAIL + '?detail=' + id;
}
/**
 * hàm kiểm tra xem người dùng đã đăng nhập chưa
 */
const isLogin = () => {
    return true;
}
/* gọi hàm khi load page 
-------------------------------------------------- */
loadProduct();
getAllCatelory();
