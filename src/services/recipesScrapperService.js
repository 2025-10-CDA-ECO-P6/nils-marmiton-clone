import puppeteer from "puppeteer";
import * as url from "node:url";

class RecipesScrapperService{
    constructor(recetteRepository, ingredientRepository) {
        this.recetteRepository = recetteRepository;
        this.ingredientRepository = ingredientRepository;
    }

    async scrape() {
        let browser;
        const scrapedResults = [];
        let pageId = 1;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        } catch (error) {
            console.error('Erreur', error.message);
        }

        const allUrls = await this.collectAllRecipesUrls(browser);
        const CONCURRENCY_LIMIT = 5;
        let results = [];

        for (let i = 0; i < allUrls.length; i += CONCURRENCY_LIMIT) {
            const batchUrls = allUrls.slice(i, i + CONCURRENCY_LIMIT);

            const batchPromises = batchUrls.map(url => this.scrapeRecipe(browser, url));
            const batchResults = await Promise.all(batchPromises);

            results.push(...batchResults);
        }

        return results;
    }

    async collectAllRecipesUrls(browser, startPage = 1, endPage = 6) {
        const allUrls = [];
        const BATCH_LIMIT = 3;
        for (let i = 0; i<= endPage; i += BATCH_LIMIT) {
            const pageIds = [];
            for (let j = i; j< Math.min(i + BATCH_LIMIT, endPage + 1); j++) {
                pageIds.push(j);
            }
            const urlPromises = pageIds.map(pageId => this.collectUrlFromPage(browser, pageId));
            const urlsArrays = await Promise.all(urlPromises);

            urlsArrays.forEach(urls => allUrls.push(...urls));
        }
        return allUrls;
    }

    async collectUrlFromPage(browser, pageId) {
        const page = await browser.newPage();
        try {
            await page.goto(`https://www.marmiton.org/recettes/index/categorie/plat-principal/${pageId}`, {waitUntil: 'domcontentloaded'});
            const urlsOnPage = await  page.evaluate((selector) => {
                return Array.from(document.querySelectorAll(selector))
                    .map(a => a.href);
            }, '.card-vertical-detailed.card-vertical-detailed--auto a');
            return urlsOnPage;
        } catch (error) {
            console.error('Erreur', error.message);
            return null;
        } finally {
            await page.close();
        }
    }

    async scrapeRecipe(browser, url) {
        const page = await browser.newPage();
        try {
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
            await page.goto(url, {waitUntil: "domcontentloaded"});
            const recetteData = await page.evaluate(()=> {

                const getIngredients = () => {
                    const ingredientList = document.querySelectorAll('.card-ingredient-title')
                    return Array.from(ingredientList).map(item => {
                        const quantity = item.querySelector('.count').innerText;
                        const unit = item.querySelector('.unit').innerText;
                        const text = item.querySelector('.ingredient-name').innerText;

                        return {
                            text: text.trim(),
                            quantity: quantity.trim() + ' ' + unit

                        }
                    });
                }


                const allSteps = [];
                const titre = document.querySelector('.main-title h1')?.innerText;
                const infos = document.querySelectorAll('.recipe-primary__item');
                const stepsContainer = document.querySelectorAll('.recipe-step-list__container');

                for (let j = 0; j < stepsContainer.length; j++) {

                    let currentStep = stepsContainer[j];
                    const stepNumber = currentStep.querySelector('.recipe-step-list__head span').innerText;
                    const stepText = currentStep.querySelector('.recipe-step-list__container p').innerText;

                    if (stepNumber && stepText) {
                        allSteps.push({
                            number : stepNumber.trim(),
                            text: stepText.trim()
                        })
                    }
                }

                const ingredients = getIngredients();


                let temps, difficulte, budget;

                if(infos.length <3) {
                    console.error('Erreur : manque des infos')
                    return {
                        titre: titre || 'Titre manquant',
                        error: 'Données infos incomplètes',
                    };
                } else {
                    temps = infos[0].innerText.trim();
                    difficulte = infos[1].innerText.trim();
                    budget = infos[2].innerText.trim();

                    return {
                        titre: titre,
                        temps : temps,
                        difficulte : difficulte,
                        budget: budget,
                        description : JSON.stringify(allSteps),
                        ingredients : ingredients
                    }
                }

            });
            if (recetteData && !recetteData.error) {
                await this.saveRecipe(recetteData);
            }
            return recetteData;
        } catch (error) {
            console.error(`Erreur sur ${url}: ${error.message}`);
            return null;
        } finally {
            await page.close();
        }
    }


    async saveRecipe(recetteData) {
        try {
            const recetteCoreData = {
                titre : recetteData.titre,
                temps: recetteData.temps,
                difficulte: recetteData.difficulte,
                budget: recetteData.budget,
                description : recetteData.description
            };

            const newRecetteId = await this.recetteRepository.saveOne(recetteCoreData);

            if (!newRecetteId) {
                throw new Error('Impossible de trouver ID de la nouvelle recete ');
            }

            for(const ingredient of recetteData.ingredients) {
                const ingredientId = await this.ingredientRepository.getOrSave(ingredient.text);
                await this.recetteRepository.linkIngredient(newRecetteId, ingredientId, ingredient.quantity);
            }



        } catch (error) {

            console.error(`Erreur lors de la sauvegarde complète de la recette ${recetteData}:`, error);
            throw error;
        }
    }
}

export default RecipesScrapperService;

