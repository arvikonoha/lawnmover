module.exports.inputType = async (selector, value, page) =>
  await page.type(selector, value);

module.exports.waitAndClick = async (selector, page) =>
  new Promise(async (resolve, reject) => {
    page.waitForSelector(selector).then(() => {
      page.click(selector).then(() => {
        resolve();
      });
    });
  });
