from playwright.sync_api import sync_playwright


def get_browser():

    playwright = sync_playwright().start()

    browser = playwright.chromium.launch(
        headless=False
    )

    page = browser.new_page(
        viewport={
            "width": 1280,
            "height": 900
        }
    )

    return playwright, browser, page
