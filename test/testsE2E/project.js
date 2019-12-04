const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://dbAdmin:admindbCDP@cluster0-ryf5h.azure.mongodb.net/test?retryWrites=true&w=majority'

const Projet = require('../../src/models/project.model');
const User = require('../../src/models/user.model');


const puppeteer = require('puppeteer');
var assert = require('chai').assert;


(async () => {
  mongoose.connect(mongoDB, {useNewUrlParser: true});
  const db = mongoose.connection;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ----- Etapes de creation et connexion à un compte
  await page.goto('http://192.168.99.100:8080/');
  await page.click('body > div > a:nth-child(1)');
  await page.waitFor(2000);
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(5) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(6) > input', '123456Test123456@123456.com');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(7) > input', '123456Test123456');
  await page.click('body > div > div > form > div > div > div > div > button');
  await page.click('body > nav > div > a');
  await page.click('body > div > a:nth-child(2)');
  await page.waitFor(2000);
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  await page.click('body > div > div > form > div > div > div > div > button');
  await page.waitFor(2000);
  // ----

  await page.click('body > div.identification > a:nth-child(3)');
  await page.click('body > div.container > div > div.col.s4 > div > a');
  //Creation d'un projet : nom du projet
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(2) > input', '123456TestNomProjet123456');
  // description
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456TestDescriptionProjet123456');
  //validation
  await page.click('body > div.container > div > form > div > div > div > div > button');
  //On accede a la page du projet
  await page.click('body > div > div > div.col.s8 > div > div > div.card-action > a.left-align');


  // On vérifie qu'on est sur la page du bon projet
  const nameProject = '123456TestNomProjet123456';
  const expectedName = await page.evaluate(() => {
    let name = document.querySelector('body > div > div.col.s5 > div > div > h6').innerText
    return name
  })


  await browser.close();

  assert.equal(nameProject, expectedName, 'Création projet OK');

  await User.deleteOne({login: '123456Test123456'});
  await Projet.deleteOne({name: '123456TestNomProjet123456'});

  mongoose.connection.close();
  console.log('Le test s\'est correctement déroulé');



})();
