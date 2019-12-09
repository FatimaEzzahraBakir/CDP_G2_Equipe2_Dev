const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://dbAdmin:admindbCDP@cluster0-ryf5h.azure.mongodb.net/test?retryWrites=true&w=majority'

const Projet = require('../../src/models/project.model');
const User = require('../../src/models/user.model');
const Issue = require('../../src/models/issue.model');


const puppeteer = require('puppeteer');
var assert = require('chai').assert;


(async () => {
  mongoose.connect(mongoDB, {useNewUrlParser: true});
  const db = mongoose.connection;

  const browser = await puppeteer.launch();
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

  //On va sur la page des issues
  await page.$eval('body > div.row > div.col.s12.m4.l2 > div:nth-child(1) > a:nth-child(1)', elem => elem.click());
  await page.waitFor(2000);
  //On clique pour créer un issue
  await page.$eval('#newIssueButton', elem => elem.click());
  //On remplit les champs
  await page.type('#idfield', '123456');
  await page.type('#descfield', '123456TestDescriptionIssue123456');
  await page.select('#priofield', 'HIGH');
  await page.select('#sprintfield', 'Aucun')
  await page.type('#difffield', '1');
  //On valide
  await page.$eval('#submitNewIssue', elem => elem.click());
  await page.waitFor(2000);




  // On vérifie qu'on a la bonne issue
  const nameIssue = '123456TestDescriptionIssue123456';
  const expectedName = await page.evaluate(() => {
    let name = document.querySelector('#issuesTable > tbody > tr:nth-child(1) > td:nth-child(2) > p').innerText
    return name
  })


  await browser.close();

  await User.deleteOne({login: '123456Test123456'});
  await Projet.deleteOne({name: '123456TestNomProjet123456'});
  await Issue.deleteOne({description: '123456TestDescriptionIssue123456'});

  assert.equal(nameIssue, expectedName, 'Création issue OK');



  mongoose.connection.close();
  console.log('Le test s\'est correctement déroulé');



})();
