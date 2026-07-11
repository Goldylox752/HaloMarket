from scrapers.utils.supabase import supabase



def upload_listing(listing):

    try:

        result = (
            supabase
            .table("products")
            .insert({

                "title":
                listing.get(
                    "title"
                ),

                "price":
                listing.get(
                    "price"
                ),

                "source":
                listing.get(
                    "source"
                ),

                "category":
                listing.get(
                    "category",
                    "Uncategorized"
                ),

                "url":
                listing.get(
                    "url"
                ),

                "image":
                listing.get(
                    "image"
                )

            })
            .execute()
        )


        print(
            "Uploaded:",
            listing.get("title")
        )


        return result


    except Exception as error:

        print(
            "Upload failed:",
            error
        )

        return None
