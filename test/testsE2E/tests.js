const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://dbAdmin:admindbCDP@cluster0-ryf5h.azure.mongodb.net/test?retryWrites=true&w=majority'

const Projet = require('../../src/models/project.model');
const User = require('../../src/models/user.model');
const Test = require('../../src/models/test.model');


const puppeteer = require('puppeteer');
var assert = require('chai').assert;


(async () => {
  mongoose.connect(mongoDB, {useNewUrlParser: true});
  const db = mongoose.connection;

  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  // ----- Etapes de creation et connexion à un compte
  await page.goto('http://localhost:8080/');
  await page.$eval('body > div > a:nth-child(1)', elem => elem.click());
  await page.waitFor(2000);
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(5) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(6) > input', '123456Test123456@123456.com');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(7) > input', '123456Test123456');
  await page.$eval('body > div > div > form > div > div > div > div > button', elem => elem.click());
  await page.$eval('body > nav > div > a', elem => elem.click());
  await page.$eval('body > div > a:nth-child(2)', elem => elem.click());
  await page.waitFor(2000);
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456Test123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456Test123456');
  await page.$eval('body > div > div > form > div > div > div > div > button', elem => elem.click());
  await page.waitFor(2000);
  // ----
  await page.$eval('body > div.identification > a:nth-child(3)', elem => elem.click());
  await page.$eval('body > div.container > div > div.col.s4 > div > a', elem => elem.click());

  await page.waitFor(2000);

  //----- Etapes de creation d'un projet
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(2) > input', '123456TestNomProjet123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(3) > input', '123456TestDescriptionProjet123456');
  await page.$eval('body > div.container > div > form > div > div > div > div > button', elem => elem.click());
  await page.$eval('body > div > div > div.col.s8 > div > div > div.card-action > a.left-align', elem => elem.click());
  //-------

  //On va sur la page des tests
  await page.$eval('body > div.row > div.col.s12.m4.l2 > div:nth-child(1) > a:nth-child(3)', elem => elem.click());
  await page.waitFor(2000);
  //On clique pour créer un test
  await page.$eval('body > div.container > div.col.s4 > div > a', elem => elem.click());
  //On remplit les champs
  await page.type('body > div.container > div > form > div > div > div > div > div:nth-child(3) > input', '123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(4) > input', '123456TestName123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(5) > input', '123456TestResult123456');
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(6) > input', '123456TestResult123456')
  await page.type('body > div > div > form > div > div > div > div > div:nth-child(7) > input', '1');
  //On valide
  await page.$eval('body > div > div > form > div > div > div > div > button', elem => elem.click());
  await page.waitFor(2000);




  // On vérifie qu'on a le bon test
  const nameTest = '123456TestName123456';
  const expectedName = await page.evaluate(() => {
    let name = document.querySelector('body > div > div.col.s8 > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText
    return name
  })


  await browser.close();

  await User.deleteOne({login: '123456Test123456'});
  await Projet.deleteOne({name: '123456TestNomProjet123456'});
  await Test.deleteOne({description: '123456TestName123456'});

  assert.equal(nameTest, expectedName, 'Création test OK');



  mongoose.connection.close();
  console.log('Le test s\'est correctement déroulé');



})();
