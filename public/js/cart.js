function addToCart(title,price) {
    const product = {
        title: title,
        price: price,
     
    };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}