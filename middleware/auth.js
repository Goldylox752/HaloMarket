const supabase = require("../config/supabase");

module.exports = async (req, res, next) => {

    try {

        const token = req.headers.authorization?.replace(
            "Bearer ",
            ""
        );

        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Authentication required."

            });

        }

        const {

            data,

            error

        } = await supabase.auth.getUser(token);

        if (error || !data.user) {

            return res.status(401).json({

                success: false,

                message: "Invalid token."

            });

        }

        req.user = data.user;

        next();

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: "Authentication failed."

        });

    }

};
