// ==========================================
// Currency Utility
// ==========================================

exports.format = (

    amount,

    currency = "CAD",

    locale = "en-CA"

) => {

    return new Intl.NumberFormat(

        locale,

        {

            style: "currency",

            currency

        }

    ).format(amount);

};

exports.cents = amount =>

    Math.round(Number(amount) * 100);

exports.dollars = cents =>

    Number(cents) / 100;
