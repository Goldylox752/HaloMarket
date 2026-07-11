from bs4 import BeautifulSoup
from scrapers.utils.browser import get_browser
from scrapers.utils.exporter import save_json
from urllib.parse import quote


def scrape_kijiji(search_term):

    products = []


    playwright, browser, page = get_browser()


    url = (
        "https://www.kijiji.ca/b-buy-sell/"
        f"k0?dc=true&keywords={quote(search_term)}"
    )


    print("Opening:")
    print(url)


    page.goto(
        url,
        timeout=60000
    )


    page.wait_for_timeout(5000)


    html = page.content()


    soup = BeautifulSoup(
        html,
        "lxml"
    )


    listings = soup.select(
        "article"
    )


    for item in listings:


        title = item.select_one(
            "a"
        )


        price = item.select_one(
            ".price"
        )


        if title:


            products.append({

                "source": "Kijiji",

                "title":
                title.get_text(
                    strip=True
                ),

                "price":
                price.get_text(
                    strip=True
                )
                if price
                else "Unknown"

            })


    browser.close()
    playwright.stop()


    save_json(
        products,
        "kijiji_results.json"
    )


    return products
