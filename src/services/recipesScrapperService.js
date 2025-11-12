import puppeteer from "puppeteer";
class RecipesScrapperService{
    constructor(recetteRepository) {
        this.recetteRepository = recetteRepository;
    }

    async scrape() {
        let browser;
        const scrapedResults = [];
        let pageId = 1;
        try {
             browser = await puppeteer.launch({
                 headless: true,
                 args : ['--no-sandbox', '--disable-setuid-sandbox']
             });

             for (pageId; pageId < 2; pageId++) {
                 const page = await browser.newPage();
                 await page.goto(`https://www.marmiton.org/recettes/index/categorie/plat-principal/${pageId}`, {waitUntil : 'domcontentloaded'});

                 try {
                     await (await page.waitForSelector("#didomi-notice-agree-button", { timeout: 5000 })).click();
                 } catch (error) {
                     console.log("Bouton de refus des cookies non trouvé, continuant sans cliquer.");
                 }

                 const selector = '.card-content.card-content--auto';
                 await page.waitForSelector(selector);


                 let cardsLinks = await page.$$(selector + ' a');
                 console.log(`Trouvé ${cardsLinks.length} liens de recettes à scraper.`);

                 for (let i=0; i < cardsLinks.length; i++){
                     console.log(`Scraping recette ${i + 1}/${cardsLinks.length}...`);

                     await cardsLinks[i].click();
                     await page.waitForNavigation({waitUntil : 'domcontentloaded'});

                     const recetteData = await page.evaluate(()=> {
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
                                 description : allSteps
                             }
                         }
                     })

                     console.log('Données récupérées:', recetteData);
                     scrapedResults.push(recetteData);
                     await page.goBack({waitUntil : "domcontentloaded"});
                     await page.waitForSelector(selector);
                     cardsLinks = await page.$$(selector + ' a');

                 }
             }


            return scrapedResults;
        }catch (error) {
            console.error('Échec du Scraper:', error);
        } finally {
            if (browser) await browser.close();
        }
    }
}

const scraper = new RecipesScrapperService({});
scraper.scrape()
    .then(data => console.log('\n--- RÉSULTAT FINAL DU SCRAPING (4 premières) ---', data))
    .catch(err => console.error(err));