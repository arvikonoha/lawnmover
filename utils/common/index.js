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

module.exports.countPeople = async (selector, container) => {
  let people = [];
  const containerElement = document.querySelector(container);

  let total;
  let distance = 10;

  do {
    total = containerElement.scrollHeight;
    containerElement.scrollBy(0, 100);
    distance += await ((ms, result) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(result), ms);
      }))(500, 100);
  } while (total >= distance);

  const elements = document.querySelectorAll(selector);
  elements.forEach((item) => people.push(item.textContent));

  return people;
};
