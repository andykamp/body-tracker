const puppeteer = require('puppeteer');
import { BASE_URL } from '@/oda-scraper/oda.constants';

// @todo:make the pill-check recursive in case there is alooot of submenus

export async function getContents() {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto((`${BASE_URL}`));

  // Target only the links under the "Kategorier" section
  const hrefs = await page.$$eval('div.c-block.c-categories__link-list__container:nth-child(2) ul.c-categories__link-list__content li.c-categories__link-list__item a', links => links.map(link => link.href));

  console.log('hrefs', hrefs);

  for (let href of hrefs) {
    const href = hrefs[3];
    if (href.toLowerCase().includes('frukt')) continue;
    const categoryPage = await browser.newPage();
    await categoryPage.goto(href);
    const subCategoriesHref = await categoryPage.$$eval('ul.nav.nav-pills li a', links => links.map(link => link.href));
    await categoryPage.close();

    console.log('subCategory', subCategoriesHref);
    for (let subCategoryHref of subCategoriesHref) {
      const subCategoryPage = await browser.newPage();
      await subCategoryPage.goto(subCategoryHref);
      await getItems(browser, subCategoryPage)
      await subCategoryPage.close();
    }


    // console.log(title);
    await categoryPage.close();
  }

  await page.close()
  await browser.close();
  return [];
};

export async function getItems(browser, page: any) {
  // Extract the links of each list item
  const listItems = await page.$$('.product-category-list .product-list-item a');

  for (let i = 0; i < listItems.length; i++) {
    try {
      // Click on each list item
      await listItems[i].click();

      // Wait for the modal to appear
      await page.waitForSelector('#modal-container', { timeout: 5000 });
    } catch (error) {
      console.error(`waitForSelector failed: ${error.message}`);
      // Handle the error or simply ignore it
      continue; // Move to the next iteration of the loop
    }

    // Select second tab
    try {
      await page.waitForSelector('ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="nutrition-"]');
      await page.click('ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="nutrition-"]');

      const mergedTitle = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1 span[itemprop="name"], h1 span.name-extra'); // Modify the selector to target the specific elements
        let mergedContent = '';
        elements.forEach(element => {
          mergedContent += element.textContent.trim() + ' ';
        });
        return mergedContent.trim();
      });
      console.log('title', mergedTitle);
      const infoValues = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.tab-content [id^="contents-"] table tbody tr'));
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
          return { [cells[0]]: cells[1] };
        });
      });
      console.log('infoValues', infoValues);

      const nutritionValues = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.tab-content [id^="nutrition-"] table tbody tr'));
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
          return { [cells[0]]: cells[1] };
        });
      });
      console.log(`Nutrition values for item ${i + 1}: `, nutritionValues);
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


}

export function storeProducts(products: any[]) {
  console.log('storeprduct', products);
}

