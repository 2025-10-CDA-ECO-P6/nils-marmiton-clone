import puppeteer from "puppeteer";

class BrowserDriver {

    async launchBrowser () {
        try {
            return await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
        }catch (error) {
            console.error('Erreur', error.message);
            throw error;
        }
    }

    async closeBrowser(browser) {
        if (browser) {
            await browser.close();
        }
    }
}

export default BrowserDriver;