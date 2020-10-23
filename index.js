const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");
const util = require("util");
const { resolve } = require("path");

async function screenShot(url, path, name) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  await page.goto(url);
  await page.screenshot({ path: path + name + ".png" });
  await browser.close();
}

async function downloadPdf(url, path, name) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  await page.goto(url);
  await page.pdf({ path: path + name + ".pdf", format: "A4" });
  await browser.close();
}

async function getDimension(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  await page.goto(url);

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });
  console.log("Dimensions:", dimensions);
  await browser.close();
}

async function aidp(url) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    defaultViewport: { width: 1920, height: 937 },
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.type(".el-input__inner[placeholder='请输入用户名']", "");
  await page.type(".el-input__inner[placeholder='请输入密码']", "");
  const yzm = await page.$(".code-img");
  await yzm.screenshot({
    path: "./yzm.png",
  });

  const image = await getBase64Image("./yzm.png");
  const value = await getValue(image);
  await page.type(".el-input__inner[placeholder='验证码']", value);
  await page.click(".login-submit");
  await page.waitForSelector(".list_item:first-child");
  await page.click(".list_item:first-child");
  await page.click(".el-tabs__item:last-child");
  await page.waitForSelector(".list_item:first-child");
  await page.click(".list_item:first-child");
  await page.click(".list_tower");
  await page.waitForSelector(".list_item:first-child");
  await page.click(".list_item:first-child");
  await page.click(".icon-dbl-down");
  await page.click(".icon-modal");
  await page.click(".icon-notice");
  await page.click(".icon-menu-flat");
  await page.click(
    "#main > div > div.parent > div.tool > div.option > div.tool_btn > div",
  );
  await page.waitForSelector(
    "body > div:nth-child(11) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div > div.hor_warp.just_between.tuli_header > div.tuli_close",
  );
  await page.click(
    "body > div:nth-child(11) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div > div.hor_warp.just_between.tuli_header > div.tuli_close",
  );
  await page.click(
    "#main > div > div.parent > div.tool > div.option > div.tool_scale > div:nth-child(4)",
  );
  await page.click(
    "#main > div > div.parent > div.tool > div.option > div.tool_scale > div:nth-child(1)",
  );
  await page.hover(
    "#app-header > div > ul.all-apps-container > li:nth-child(10) > span",
  );
  await page.click("#app-header > div > ul.apps-expand > li:nth-child(4)");
  //await browser.close();
}

async function getBase64Image(img) {
  const readFile = util.promisify(fs.readFile);
  const imageData = await readFile(img);
  const imageBase64 = imageData.toString("base64");
  const imagePrefix = "data:image/png;base64,";
  return imageBase64;
}

function getValue(image) {
  return new Promise((resolve) => {
    request.get(
      {
        url: "",
      },
      (err, httpResponse, res) => {
        let token = JSON.parse(res).access_token;
        request.post(
          {
            url: ``,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            form: { image: image },
          },
          (err, httpResponse, body) => {
            return resolve(JSON.parse(body).words_result[0].words);
          },
        );
      },
    );
  });
}
// screenShot("https://www.bilibili.com/", "./", "pic");
// downloadPdf("https://www.bilibili.com/", "./", "pdf");
// getDimension("https://www.bilibili.com/");
aidp("http://localhost:8080/#/login");
