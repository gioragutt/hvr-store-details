import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import "./env";
import { logTime, screenshort } from "./page-utils";
import { getStoreIds } from "./pages/giftcard-main-page";
import { signIn } from "./pages/login-page";
import { getStoreDetails } from "./pages/store-details-page";

async function main() {
  console.log("--- Starting");
  const browser = await puppeteer.launch();
  console.log("--- Browser launched");
  const page = await browser.newPage();
  console.log("--- Page created");

  try {
    await logTime("signIn", () => signIn(page));
    const branchIds = await logTime("getStoreIds", () => getStoreIds(page));

    const allStoreDetails = await logTime("allStoreDetails",
      () => Promise.all(branchIds.map((storeId) =>
        logTime(`getStoreDetails(${storeId})`,
          () => getStoreDetails(browser, storeId)))));

    const categoriesCount = allStoreDetails.reduce<{ [category: string]: number }>((acc, { storeCategory }) => {
      acc[storeCategory] = acc[storeCategory] ? acc[storeCategory] + 1 : 1;
      return acc;
    }, {});

    console.log("Categories distribution");
    console.table(categoriesCount);
    writeFileSync("/tmp/hvr-store-details.json", JSON.stringify(allStoreDetails, null, 2));
  } catch (e) {
    console.error(e);
    await screenshort(page, "main_caught_error");
    return;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
