// ==========================================
// Permissions
// ==========================================

exports.isAdmin = user =>

    user.role === "admin";

exports.isSeller = user =>

    user.role === "seller";

exports.canEditProduct = (

    user,

    product

) => {

    return (

        user.role === "admin" ||

        product.sellerId === user.id

    );

};
