class product {
    constructor(id, name, alias, price, description, size, shortDescription, quantity, categories, relatedProducts, feature, image, deleted = false) {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.price = price;
        this.description = description;
        this.size = size;
        this.shortDescription = shortDescription;
        this.quantity = quantity;
        this.deleted = deleted;
        this.categories = categories;
        this.relatedProducts = relatedProducts;
        this.feature = feature;
        this.image = image;
    }
}
export default product

