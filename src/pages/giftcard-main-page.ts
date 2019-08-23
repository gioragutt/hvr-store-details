import puppeteer from "puppeteer";
import { getProperty, goto } from "../page-utils";
import { GIFTCARD_MAIN_URL } from "../urls";

const { LATEST_STORE_ID } = process.env;

const STORE_LINKS_SELECTOR = "div[id^=store_] > a";
const specificStoreSelector = (store: string) => `#store_${store}`;

async function scrapeStoreId(storeLink: puppeteer.ElementHandle<Element>): Promise<string> {
  const href: string = await getProperty(storeLink, "href");
  const storeId = href.match(/\d+/)[0];
  return storeId;
}

export async function getStoreIds(page: puppeteer.Page): Promise<string[]> {
  await goto(page, GIFTCARD_MAIN_URL);
  console.log("--- Waiting for store", LATEST_STORE_ID);
  await page.waitForSelector(specificStoreSelector(LATEST_STORE_ID));
  const storeLinks = await page.$$(STORE_LINKS_SELECTOR);
  console.log("--- Got", storeLinks.length, "stores");
  const storeIds = await Promise.all(storeLinks.map(scrapeStoreId));
  return storeIds;
}
