/* variable
-------------------------------------------------- */
/* function
-------------------------------------------------- */
const loadDetaiProduct = () =>  {
    const urlParams = new URLSearchParams(window.location.search);
	const myParam= urlParams.get('detail');
    if (myParam) {
        try {
            AXIOS_INS.get(DOMAIN_API_PRODUCT_BY_ID + myParam).then((response) => {
                let result = response.data.content;
                // render html
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
                            <button class="mt-3 btn btn-danger">Add to Cart</button>
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
                    let priNum = result.price *  num
                    priHtml.innerHTML = priNum
                })
                // add event cho nút -
                let minus = document.querySelector('.detail .btn.detail__subtract')
                minus.addEventListener('click', () => {
                    let buyNumber = document.querySelector('.detail .detail__buy-number')
                    let num = +(buyNumber.innerHTML) - 1
                    if(num < 1) {
                        num = 1
                    }
                    buyNumber.innerHTML = num
                    let priHtml = document.querySelector('.detail .detail__price')
                    let priNum = result.price *  num
                    priHtml.innerHTML = priNum
                })
            })
        } catch (error) { }
    }
}
/* event
-------------------------------------------------- */
/* page load
-------------------------------------------------- */
getAllCatelory()
showUserInfo()
loadDetaiProduct()
