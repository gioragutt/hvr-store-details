import puppeteer, { ElementHandle } from "puppeteer";

export async function goto(
  page: puppeteer.Page,
  url: string,
  options?: puppeteer.DirectNavigationOptions,
): ReturnType<puppeteer.Page["goto"]> {
  const response = await page.goto(url, options);
  console.log("--- Navigated to", await page.url());
  return response;
}

export async function $(page: puppeteer.Page, selector: string): ReturnType<puppeteer.Page["$"]> {
  const elementHandle = await page.$(selector);
  if (elementHandle) {
    console.log("--- Got", selector);
  } else {
    console.error("--- Failed to get", selector);
  }
  return elementHandle;
}

export async function screenshort(page: puppeteer.Page, name: string): Promise<void> {
  await page.screenshot({
    fullPage: true,
    path: `screenshots/${name}.png`,
  });
}

export async function innerTextOf(page: puppeteer.Page, selector: string): Promise<string> {
  const element = await $(page, selector);
  return page.evaluate((e) => e.innerText, element);
}

export async function getProperty(elementHandle: ElementHandle, prop: string): Promise<any> {
  return await elementHandle.getProperty(prop).then((p) => p.jsonValue());
}

export async function logTime<T>(description: string, func: () => Promise<T>) {
  console.time(description);
  const result = await func();
  console.timeEnd(description);
  return result;
}
