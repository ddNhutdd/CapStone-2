const DOMAIN_API = 'https://shop.cyberlearn.vn/api';
const DOMAIN_API_PRODUCT = DOMAIN_API + '/Product';
const DOMAIN_API_CATELORY = DOMAIN_API_PRODUCT + '/getAllCategory'
const DOMAIN_API_PRODUCT_BY_CATELORY = DOMAIN_API_PRODUCT + '/getProductByCategory?categoryId='
const DOMAIN = 'http://127.0.0.1:5500/'
const DOMAIN_LOGIN = DOMAIN + 'view/signUp.html'
const DOMAIN_PRODUCT_DETAIL = DOMAIN + 'view/product-detail.html'
const STR_LIST_PRODUCT_IN_CART = 'STR_LIST_PRODUCT_IN_CART'
const AXIOS_INS = axios.create({
    baseURL: DOMAIN,
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' },
});