import puppeteer, { type Browser, type Page, } from 'puppeteer'
import { v4 as uuid } from 'uuid';
import { mapInfoToEnglish, mapNutritionToEnglish }
  from '@/oda-scraper/utils/utils.format';
import { BASE_URL, CATEGORY_WHITLELIST } from '@/oda-scraper/constants'
import { writeLargeJsonToFile } from '@/common-scraper/utils/utils.fs';
import { Product, OdaNutritionInfo, OdaProductInfo } from '@/common-scraper/types';
import { PRODUCT_SOURCES, UNITS } from '@/common-scraper/constants';

const RUN_HEADLESS_MODE = true;

// misc

async function removeCookieDialog(page: Page) {
  try {
    await page.evaluate(() => {
      const element = document.querySelector('div.cookie-widget-wrapper');
      if (element) element.remove();
    });
  } catch (error) {
    console.error(`could not remove cookie popup: ${error.message}`);
  }
}

// category helpers

async function getCategoriesLinks(page: Page) {
  const CATEGORY_SELECTOR = 'div.c-block.c-categories__link-list__container:nth-child(2) ul.c-categories__link-list__content li.c-categories__link-list__item a'
  const hrefs = await page.$$eval(CATEGORY_SELECTOR, links => links.map(link => link.href));
  let filteredHrefs = hrefs.filter((i: string) => CATEGORY_WHITLELIST.includes(i))
  filteredHrefs = [...new Set(filteredHrefs)];
  return filteredHrefs
}

// subcategory helpers

const SUB_CATEGORY_SELECTOR = 'ul.nav.nav-pills li a'

async function getSubCategoryLinks(href: string, browser: Browser) {
  const categoryPage = await browser.newPage();
  await categoryPage.goto(href);
  let subCategoriesHrefs = await categoryPage.$$eval(SUB_CATEGORY_SELECTOR, links => links.map(link => link.href));
  subCategoriesHrefs = [...new Set(subCategoriesHrefs)];
  await categoryPage.close();
  return subCategoriesHrefs
}

async function getSubCategoryItems(subCategoriesHref: string[], browser: Browser, categoryName: string) {
  let items: Record<string, Product> = {}
  const CHILD_CATEGORY_HEADLINE_SELECTOR = 'h4.child-category-headline';

  console.log('subCategoriesHref', subCategoriesHref);
  for (const subCategoryHref of subCategoriesHref) {
    console.log('current subCategoryHref', subCategoryHref);
    const subCategoryPage = await browser.newPage();
    await subCategoryPage.goto(subCategoryHref);

    // Check for additional subcategories, indicated by having more "show all child-categories-headlines"
    const additionalSubcategoriesExist = await subCategoryPage.$(CHILD_CATEGORY_HEADLINE_SELECTOR);

    // If there are additional subcategories, recursively get items from them
    if (additionalSubcategoriesExist) {
      let additionalSubCategoriesHref = await subCategoryPage.$$eval(SUB_CATEGORY_SELECTOR, links => links.map(link => link.href));
      additionalSubCategoriesHref = [...new Set(additionalSubCategoriesHref)];
      const additionalItems = await getSubCategoryItems(additionalSubCategoriesHref, browser, categoryName);
      items = { ...items, ...additionalItems };
    }
    else {
      const subCategoryName = subCategoryHref.split('/').filter(i => i !== '').pop();
      console.log('subCategoryName', subCategoryName);
      const subCategoryItems = await getItems(subCategoryPage, subCategoryName, categoryName)
      items = { ...items, ...subCategoryItems };
    }

    await subCategoryPage.close();
  }

  return items;
}

// item helpers

async function getOdaProductUid(page: Page) {
  const uid = await page.evaluate(() => {
    const link = document.querySelector('#modal-container ul.nav.nav-tabs a[href^="#contents-"]') as any;
    if (!link) return null
    const href = link.href.split('/').filter((i: string) => i !== '').pop()
    // this will be on the format #contents-1234 where 1234 is the id we want
    return href.split('-').pop();
  });
  return uid
}

async function getProductTitle(page: Page) {
  const title = await page.evaluate(() => {
    const nameSpan = document.querySelector('h1 span[itemprop="name"]');
    // Return the text content, which includes the content of child elements
    let content = nameSpan.textContent;
    // Remove extra spaces and line breaks
    content = content.replace(/\s\s+/g, ' ').trim();
    return content;
  });
  console.log('title', title);
  return title
}
async function getProductThumbnail(page: Page) {
  const IMAGE_SELECTOR = '#modal-container .image-container img';
  const imageUrl = await page.$eval(IMAGE_SELECTOR, img => img.src);
  console.log(imageUrl);
  return imageUrl
}

async function getOdaProductInfo(page: Page) {
  const productInfo = await page.evaluate(() => {
    const obj = {}
    const rows = Array.from(document.querySelectorAll('.tab-content [id^="contents-"] table tbody tr'));
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
      obj[cells[0]] = cells[1];
    });
    return obj
  });
  return productInfo
}

async function getProductNutrition(page: Page) {
  const productNutrition = await page.evaluate(() => {
    const obj = {}
    const rows = Array.from(document.querySelectorAll('.tab-content [id^="nutrition-"] table tbody tr'));
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('th, td')).map(el => (el as HTMLElement).innerText.trim());
      obj[cells[0]] = cells[1];
    });
    return obj
  });
  return productNutrition
}

export async function getItems(page: Page, subCategoryName?: string, categoryName?: string) {
  const items: Record<string, Product> = {}

  // Extract the links of each list item
  const listItemSelector = '.product-category-list .product-list-item a'
  const listItems = await page.$$(listItemSelector);
  // listItems = listItems.slice(0, 20);

  // remove the cookie popup
  await removeCookieDialog(page);

  for (let i = 0; i < listItems.length; i++) {
    let odaUid = null,
      productTitle = '',
      productInfo = {},
      productNutrition = {},
      thumbnail = '';

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
    try {

      try {
        odaUid = await getOdaProductUid(page)
      } catch (error) {
        console.error(`odaUid failed: ${error.message}`);
      }

      try {
        productTitle = await getProductTitle(page)
      } catch (error) {
        console.error(`productTitle failed: ${error.message}`);
      }

      try {
        thumbnail = await getProductThumbnail(page)
      } catch (error) {
        console.error(`thumbnail failed: ${error.message}`);
      }

      try {
        productInfo = await getOdaProductInfo(page)

        const ITEM_INFO_TAB_SELECTOR = 'ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="contents-"]';
        const infoTabElement = await page.$(ITEM_INFO_TAB_SELECTOR);

        if (infoTabElement) {
          await infoTabElement.click();
          productInfo = await getOdaProductInfo(page);
        } else {
          console.log("Info tab doesn't exist.");
        }
      } catch (error) {
        console.error(`info failed: ${error.message}`);
      }

      try {
        // @todo: dont wait in case it does not exist
        const ITEM_NUTRITION_TAB_SELECTOR = 'ul.nav.nav-tabs li[role="presentation"] a[aria-controls^="nutrition-"]'
        const nutritionTabElement = await page.$(ITEM_NUTRITION_TAB_SELECTOR);

        if (nutritionTabElement) {
          await nutritionTabElement.click();
          productNutrition = await getProductNutrition(page);
        } else {
          console.log("Nutrition tab doesn't exist.");
        }
      } catch (error) {
        console.error(`nutrition failed: ${error.message}`);
      }

      const productUid = uuid()
      items[productUid] = {
        uid: productUid,
        title: productTitle,
        source: {
          type: PRODUCT_SOURCES.oda,
          uid: odaUid,
          categoryName: categoryName,
          subCategoryName: subCategoryName,
        },
        info: mapInfoToEnglish(productInfo as OdaProductInfo),
        nutrition: mapNutritionToEnglish(productNutrition as OdaNutritionInfo),
        unit: UNITS.grams,
        thumbnail
      } as Product

    } catch (error) {
      console.error(`parsing failed: ${error.message}`);
      // Handle the error or simply ignore it
      continue; // Move to the next iteration of the loop
    }


    // Close the modal by pressing the Escape key
    await page.keyboard.press('Escape');

    // Wait for the modal to disappear
    await page.waitForSelector('#modal-container', { hidden: true });

  }
  console.log('subcategory items', items);
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
  const hrefs = await getCategoriesLinks(page)

  if (!hrefs) throw new Error('No hrefs found')

  // hrefs = hrefs.filter(href => href.toLowerCase().includes('kylling'));
  console.log('hrefs', hrefs);

  let items: Record<string, Product> = {}

  for (const href of hrefs) {
    const subCategoriesHrefs = await getSubCategoryLinks(href, browser)

    const subCategoryName = href.split('/').filter((i: string) => i !== '').pop();

    // loop all categories
    console.log('subCategory', subCategoriesHrefs);
    const newItems = await getSubCategoryItems(subCategoriesHrefs, browser, subCategoryName)
    items = { ...items, ...newItems };
    console.log('subCategoryItems', items);
    writeLargeJsonToFile('oda-scaper-products.json', items);
  }

  await page.close()
  await browser.close();
  return items;
};

