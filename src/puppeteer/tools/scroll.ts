// import puppeteer from 'puppeteer';
// const puppeteerAutoscrollDown = require("puppeteer-autoscroll-down");

// const autoScroll = async (page: puppeteer.Page) => {
//     const scrollStep = 250 // default
//     const scrollDelay = 80 // default

//     await puppeteerAutoscrollDown(page, scrollStep, scrollDelay);
//     // await page.evaluate(async () => {
//     //     await new Promise((resolve, reject) => {
//     //         let totalHeight = 0;
//     //         const distance = 130;
//     //         const timer = setInterval(() => {
//     //             const scrollHeight = document.body.scrollHeight;
//     //             window.scrollBy(0, distance);
//     //             totalHeight += distance;

//     //             if (totalHeight * 1.1 >= scrollHeight) { // 1.013(примерно 10 дней)
//     //                 clearInterval(timer);
//     //                 resolve(true);
//     //             }
//     //         }, 100);
//     //     });
//     // });
// };

// export default autoScroll;
