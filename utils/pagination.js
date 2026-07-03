// ==========================================
// Pagination Helper
// ==========================================

module.exports = function pagination(page = 1, limit = 20) {

    page = Number(page) || 1;

    limit = Number(limit) || 20;

    const skip = (page - 1) * limit;

    return {

        page,

        limit,

        skip,

        take: limit

    };

};
