const {Builder, By} = require('selenium-webdriver');
 

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
    await driver.get('http://localhost:8080');
})();

