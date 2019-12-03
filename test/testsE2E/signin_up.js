const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://dbAdmin:admindbCDP@cluster0-ryf5h.azure.mongodb.net/test?retryWrites=true&w=majority'

const User = require('../../src/models/user.model');

const puppeteer = require('puppeteer');
var assert = require('chai').assert;


(async () => {
  mongoose.connect(mongoDB, {useNewUrlParser: true});
  const db = mongoose.connection;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://192.168.99.100:8080/');
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
  const expectedUrl = "http://192.168.99.100:8080/";

  await browser.close();

  assert.equal(pageUrl, expectedUrl, 'Inscription valide');

  await User.deleteOne({login: '123456Test123456'});

  mongoose.connection.close();
  console.log('Le test s\'est correctement déroulé');



})();
