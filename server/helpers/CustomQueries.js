const queries = {
  getCartItemDetails: `SELECT sc.item_id, p.name, p.image, p.product_id, sc.attributes, 
        COALESCE(NULLIF(p.discounted_price, 0), p.price) 
        AS price, sc.quantity, 
        COALESCE(NULLIF(p.discounted_price, 0), p.price) * sc.quantity AS subtotal 
        FROM shopping_cart sc 
        INNER JOIN product p ON sc.product_id = p.product_id 
        WHERE sc.cart_id = ? AND sc.buy_now`,

  getProductDetails: `SELECT *,
        IF (LENGTH(description) > ?, 
        CONCAT(SUBSTR(description, 1, ?), '...'),
        description) as description 
        FROM product LIMIT ? OFFSET ?`
};

export default queries;
