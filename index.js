
const puppeteer = require('puppeteer');
const base_url = 'https://www.google.com/maps';

async function crawler_google_maps(business, keyword) {
  // Init brower
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-notifications"]
  });
  const page = await browser.newPage();
  await page.setGeolocation({latitude: 59.95, longitude: 30.31667});

  page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto(
    base_url,
    { waitUntil: 'networkidle2' }
  );
  
  // Search google maps by keyword
  await page.focus('#searchboxinput');
  await page.keyboard.type(keyword);
  await page.click('#searchbox-searchbutton');
  await page.waitFor(3000);

  const results = await page.evaluate(() => {
    let titleResults = document.querySelectorAll('h3.section-result-title > span');
    titleResults = [...titleResults];
    let businesses = titleResults.map(item => ({
        business_name: item.innerText
    }));

    return businesses;
  });

  // Get ranking business
  const rank = await getRankBusiness(business, results);
  
  // ScreenShoot ranking business
  await page.screenshot({
    path: './screenShoots/' + business + '-1.png',
    fullPage: true
  });
  
  await page.evaluate(_ => {
    const container = document.querySelector('.section-scrollbox')
    container.scrollTop = 850;
  });
  await page.waitFor(1000);
  await page.screenshot({
    path: './screenShoots/' + business + '-2.png',
    fullPage: true
  });

  await page.evaluate(_ => {
    const container = document.querySelector('.section-scrollbox')
    container.scrollTop = 2000;
  });
  await page.waitFor(1000);
  await page.screenshot({
    path: './screenShoots/' + business + '-3.png',
    fullPage: true
  });
  
  // Close brower
  await browser.close();
};

function getRankBusiness(business, results) {
  let rank = "No rank";
  results.forEach((item, index) => {
    if(item.business_name == business) {
      rank = ++index;
    }
  });

  return rank;
}

crawler_google_maps('Bun Cha Dac Kim', 'bun cha');
