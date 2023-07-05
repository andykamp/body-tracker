const puppeteer = require('puppeteer');
import { BASE_URL } from '@/oda-scraper/oda.constants';

const RUN_HEADLESS_MODE = false;

// @todo:make the pill-check recursive in case there is alooot of submenus

// @todo: make uppercase

const categorySelector = 'div.c-block.c-categories__link-list__container:nth-child(2) ul.c-categories__link-list__content li.c-categories__link-list__item a'
const subCategorySelector = 'ul.nav.nav-pills li a'

const listItemSelector = '.product-category-list .product-list-item a'
const itemInfoTabSelector = 'ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="contents-"]'
const itemNutritionTabSelector = 'ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="nutrition-"]'

async function getCategoriesLinks(page) {
  const hrefs = await page.$$eval(categorySelector, links => links.map(link => link.href));
  return hrefs
}

async function getSubCategoryLinks(href, browser) {
  const categoryPage = await browser.newPage();
  await categoryPage.goto(href);
  const subCategoriesHref = await categoryPage.$$eval(subCategorySelector, links => links.map(link => link.href));
  await categoryPage.close();
  return subCategoriesHref
}

async function getSubCategoryItems(subCategoriesHref, browser) {
  const items = {}

  for (let subCategoryHref of subCategoriesHref) {
    const subCategoryPage = await browser.newPage();
    const subCategoryName = subCategoryHref.split('/').pop();
    await subCategoryPage.goto(subCategoryHref);
    const items = await getItems(subCategoryPage)
    items[subCategoryName] = items;
    await subCategoryPage.close();
  }
  return items
}

async function removeCookieDialog(page) {
  try {
    await page.evaluate(() => {
      let element = document.querySelector('div.cookie-widget-wrapper');
      if (element) element.remove();
    });
  } catch (error) {
    console.error(`could not remove cookie popup: ${error.message}`);
  }

}
export async function getItems(page: any) {
  const items = {}
  // Extract the links of each list item
  const listItems = await page.$$(listItemSelector);


  // remove the cookie popup
  await removeCookieDialog(page);

  // @todo: remove the cookie popup?

  for (let i = 0; i < listItems.length; i++) {

    try {
      // Click on each list item
      await listItems[i].click();

      // Wait for the modal to appear
      // await page.waitForSelector(modalSelector);
      await page.waitForSelector('#modal-container ul.nav.nav-tabs ', { timeout: 10000 });
      console.log('openedcontainer',);
    } catch (error) {
      console.error(`could not open model: ${error.message}`);
      // Handle the error or simply ignore it
      continue; // Move to the next iteration of the loop
    }

    // Select second tab
    let mergedTitle = '', infoValues = {}, nutritionValues = {};
    try {

      try {
        mergedTitle = await page.evaluate(() => {
          const nameSpan = document.querySelector('h1 span[itemprop="name"]');
          // Return the text content, which includes the content of child elements
          let content = nameSpan.textContent;
          // Remove extra spaces and line breaks
          content = content.replace(/\s\s+/g, ' ').trim();
          return content;
        });
        console.log('title', mergedTitle);
      } catch (error) {
        console.error(`title failed: ${error.message}`);
      }

      try {

        await page.waitForSelector(itemInfoTabSelector);
        await page.click(itemInfoTabSelector);

        const infoValues = await page.evaluate(() => {
          const itemInfoContentSelector = '.tab-content [id^="contents-"] table tbody tr'
          const rows = Array.from(document.querySelectorAll(itemInfoContentSelector));
          return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
            return { [cells[0]]: cells[1] };
          });
        });
        console.log('infoValues', infoValues);
      } catch (error) {
        console.error(`info failed: ${error.message}`);
      }


      try {
        await page.waitForSelector(itemNutritionTabSelector);
        await page.click(itemNutritionTabSelector);

        nutritionValues = await page.evaluate(() => {
          const itemNutritionContentSelector = '.tab-content [id^="nutrition-"] table tbody tr'
          const rows = Array.from(document.querySelectorAll(itemNutritionContentSelector));
          return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
            return { [cells[0]]: cells[1] };
          });
        });
        console.log(`Nutrition values for item ${i + 1}: `, nutritionValues);
      } catch (error) {
        console.error(`nutrition failed: ${error.message}`);
      }

      items[mergedTitle] = {
        title: mergedTitle,
        info: infoValues,
        nutrition: nutritionValues
      }

    } catch (error) {
      console.error(`nutrition failed: ${error.message}`);
      // Handle the error or simply ignore it
      continue; // Move to the next iteration of the loop
    }


    // Close the modal by pressing the Escape key
    await page.keyboard.press('Escape');

    // Wait for the modal to disappear
    await page.waitForSelector('#modal-container', { hidden: true });

  }
  return items;
}

export async function getContents() {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: RUN_HEADLESS_MODE });
  const page = await browser.newPage();
  await page.goto((`${BASE_URL}`));

  // remove the cookie popup
  await removeCookieDialog(page);

  // Target only the links under the "Kategorier" section
  let hrefs = await getCategoriesLinks(page)

  if (!hrefs) throw new Error('No hrefs found')

  hrefs = hrefs.filter(href => href.toLowerCase().includes('kylling'));
  console.log('hrefs', hrefs);

  const items = {}
  // @todo: currently assumes there is only one level of subCategory
  for (let href of hrefs) {
    // const href = hrefs[3];
    // if (href.toLowerCase().includes('frukt')) continue;
    const subCategoriesHrefs = await getSubCategoryLinks(href, browser)
    const subCategoryName = href.split('/').pop();

    // loop all categories
    console.log('subCategory', subCategoriesHrefs);
    const items = await getSubCategoryItems(subCategoriesHrefs, browser)
    items[subCategoryName] = items;
  }

  await page.close()
  await browser.close();
  return items;
};


export function storeProducts(products: any[]) {
  console.log('storeprduct', products);
}

