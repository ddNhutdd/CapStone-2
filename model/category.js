class category {
    constructor (id, category, categoryParent, categoryChild, productList, alias, deleted = false) {
        this.id = id;
        this.category = category;
        this.categoryParent = categoryParent;
        this.categoryChild = categoryChild;
        this.productList = productList;
        this.alias = alias;
        this.deleted = deleted;
    }
}
export default category