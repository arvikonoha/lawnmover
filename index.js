const puppeteer = require("puppeteer");
const { inputType, waitAndClick } = require("./utils/common");
const {
  USERNAME_INPUT,
  PASSWORD_INPUT,
  SUBMIT_BUTTON,
  DONT_SAVE_BUTTON,
  NO_NOTIFICATION_BUTTON,
  PROFILE_BUTTON,
  DP_BUTTON,
  FOLLOWERS_BUTTON,
  MODAL_ITEM,
  MODAL_CONTAINER,
  CLOSE_BUTTON,
  FOLLOWING_BUTTON,
} = require("./utils/ig-classes");

(async function () {
  let browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1440,500"],
  });
  let page = await browser.newPage();

  await page.goto("https://www.instagram.com/", {
    waitUntil: "networkidle0",
  });

  await inputType(USERNAME_INPUT, "your-username", page);
  await inputType(PASSWORD_INPUT, "your-password", page);

  await waitAndClick(SUBMIT_BUTTON, page);

  await waitAndClick(DONT_SAVE_BUTTON, page);

  await waitAndClick(NO_NOTIFICATION_BUTTON, page);

  await waitAndClick(DP_BUTTON, page);

  await waitAndClick(PROFILE_BUTTON, page);

  await waitAndClick(FOLLOWERS_BUTTON, page);

  await page.waitForSelector(MODAL_ITEM);
  await page.waitForSelector(MODAL_CONTAINER);

  page
    .evaluate(async () => {
      let followers = [];
      let modalConteiner = document.querySelector(".isgrP");

      let total;
      let distance = 10;
      do {
        total = modalConteiner.scrollHeight;
        modalConteiner.scrollBy(0, 100);
        distance += await ((ms, result) =>
          new Promise((resolve) => {
            setTimeout(() => resolve(result), ms);
          }))(500, 100);
      } while (total >= distance);

      const elements = document.querySelectorAll(".FPmhX.notranslate._0imsa");
      elements.forEach((item) => followers.push(item.textContent));

      return followers;
    })
    .then(async (followers) => {
      waitAndClick(CLOSE_BUTTON, page).then(async () => {
        waitAndClick(FOLLOWING_BUTTON, page);

        await page.waitForSelector(MODAL_ITEM);
        await page.waitForSelector(MODAL_CONTAINER);

        let following = await page.evaluate(async () => {
          let following = [];
          let modalContainer = document.querySelector(".isgrP");

          let total;
          let distance = 10;
          do {
            total = modalContainer.scrollHeight;
            modalContainer.scrollBy(0, 100);
            distance += await ((ms, result) =>
              new Promise((resolve) => {
                setTimeout(() => resolve(result), ms);
              }))(500, 100);
          } while (total >= distance);

          const elements = document.querySelectorAll(
            ".FPmhX.notranslate._0imsa"
          );
          elements.forEach((item) => following.push(item.textContent));

          return following;
        });

        following.forEach((item) => {
          if (followers.some((innerItem) => item === innerItem))
            console.log(`${item} is following you`);
          else console.log(`${item} is not following you`);
        });
      });
    });
})();
