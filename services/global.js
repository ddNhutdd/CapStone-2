const DOMAIN_API = 'https://shop.cyberlearn.vn/api';
const DOMAIN_API_PRODUCT = DOMAIN_API + '/Product';
const DOMAIN_API_CATELORY = DOMAIN_API_PRODUCT + '/getAllCategory'
const DOMAIN_API_PRODUCT_BY_CATELORY = DOMAIN_API_PRODUCT + '/getProductByCategory?categoryId='
const DOMAIN_API_PRODUCT_BY_ID = DOMAIN_API_PRODUCT + '/getbyid?id='
const DOMAIN = 'http://127.0.0.1:5500/'
const DOMAIN_LOGIN = DOMAIN + 'view/signUp.html'
const DOMAIN_PRODUCT_DETAIL = DOMAIN + 'view/product-detail.html'
const DOMAIN_CART = DOMAIN + 'view/carts.html'
const cartItems = 'cartItems'
const user = 'user'
const AXIOS_INS = axios.create({
    baseURL: DOMAIN,
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' },
});


// header 
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