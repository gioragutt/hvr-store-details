import puppeteer, { ElementHandle } from "puppeteer";
import * as qs from "querystring";
import { $, getProperty, goto, innerTextOf } from "../page-utils";
import { storeDetailsUrl } from "../urls";

export interface Branch {
  name: string;
  phone: string;
  address: string;
  location: {
    latitude: string;
    longitude: string;
  };
}

export interface StoreDetails {
  storeName: string;
  storeCategory: string;
  storeWebsite: string;
  branches: Branch[];
}

const BRANCH_TABLE_SELECTOR = "#branch-table";

const nthChild = (child: number) => `:nth-child(${child})`;

async function getLocation(
  addressCell: puppeteer.ElementHandle<HTMLTableDataCellElement>,
): Promise<Branch["location"]> {
  try {
    const locationHref = await addressCell.$eval("a", (a) => a.getAttribute("href"));
    const destination = qs.parse(locationHref).destination as string;
    const [latitude, longitude] = destination.split(",");
    return { latitude, longitude };
  } catch (e) {
    console.error("Failed to get google maps location link");
    return null;
  }
}

async function parseBranchRow(
  branchRow: puppeteer.ElementHandle<HTMLTableRowElement>): Promise<Branch> {
  const name = await branchRow.$eval(nthChild(1), (e) => e.innerHTML);
  const phone = await branchRow.$eval(nthChild(3), (e) => e.innerHTML);
  const addressCell: ElementHandle<HTMLTableDataCellElement> = await branchRow.$(nthChild(2));
  const address = await getProperty(addressCell, "textContent")
    .then((addresString: string) => addresString.trim());
  const location = await getLocation(addressCell);

  return {
    address,
    location,
    name,
    phone,
  };
}

async function getBranches(page: puppeteer.Page): Promise<Branch[]> {
  const branches = await page.$$("#branch-table > tbody > tr");
  return Promise.all(branches.map(parseBranchRow));
}

export async function getStoreDetails(brower: puppeteer.Browser, storeId: string): Promise<StoreDetails> {
  const page = await brower.newPage();
  await goto(page, storeDetailsUrl(storeId));
  await page.waitForSelector(BRANCH_TABLE_SELECTOR);
  const storeName = await innerTextOf(page, "#store-name");
  const storeCategory = await innerTextOf(page, "#store-category");
  const storeWebsite = await innerTextOf(page, "#store-website > a");
  const branches = await getBranches(page);
  await page.close();

  return {
    branches,
    storeCategory,
    storeName,
    storeWebsite,
  };
}
