const User = require('../../src/models/user.model');
const puppeteer = require('puppeteer');
var assert = require('chai').assert;


(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('http://localhost:8080/');
  await page.click('body > div > a:nth-child(1)');
  await page.waitFor(2000);
  //Prenom
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  //Nom de famille
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  //login
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(5) > input', '123456Test123456');
  //Email
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(6) > input', '123456Test123456@123456.com');
  //Mdp
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(7) > input', '123456Test123456');
  //On valide
  await page.click('body > div > div > form > div > div > div > div > button');
  //On retourne à l'acceuil
  await page.click('body > nav > div > a');

  //On essaye maintenante de se connecter pour vérifier qu'on est bien inscrit
  await page.click('body > div > a:nth-child(2)');
  await page.waitFor(2000);
  //login
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  //Mdp
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  //On valide
  await page.click('body > div > div > form > div > div > div > div > button');
  await page.waitFor(2000);



  const pageUrl = await page.url();
  const expectedUrl = "http://localhost:8080/";

  await browser.close();

  assert.equal(pageUrl, expectedUrl, 'Inscription valide');


})();
