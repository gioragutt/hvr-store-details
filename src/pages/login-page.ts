import puppeteer from "puppeteer";
import { $, goto } from "../page-utils";
import { SIGN_IN_URL } from "../urls";

const { TZ, PASSWORD } = process.env;

export async function signIn(page: puppeteer.Page): Promise<void> {
  if (!TZ || !PASSWORD) {
    throw new Error("TZ and PASSSORD env are required");
  }

  await goto(page, SIGN_IN_URL);
  const tzInput = await $(page, "#tz");
  const passwordInput = await $(page, "#password");
  const submitButton = await $(page, "#sgLoginButton > a");

  await tzInput.type(TZ);
  console.log("--- Entered tz");
  await passwordInput.type(PASSWORD);
  console.log("--- Entered password");
  await submitButton.click();
  console.log("--- Clicked submit button");
  await page.waitForNavigation();
  console.log("--- Navigation await finished");
}
