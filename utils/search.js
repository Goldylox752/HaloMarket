// ==========================================
// Search Utility
// ==========================================

exports.buildProductSearch = query => {

    return {

        OR: [

            {

                title: {

                    contains: query,

                    mode: "insensitive"

                }

            },

            {

                description: {

                    contains: query,

                    mode: "insensitive"

                }

            }

        ]

    };

};

exports.sortOptions = {

    newest: {

        createdAt: "desc"

    },

    oldest: {

        createdAt: "asc"

    },

    priceLow: {

        price: "asc"

    },

    priceHigh: {

        price: "desc"

    },

    popular: {

        views: "desc"

    }

};
