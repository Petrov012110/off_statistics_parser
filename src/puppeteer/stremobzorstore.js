const puppeteer = require('puppeteer');
// let puppeteerAutoscrollDown = require("puppeteer-autoscroll-down");
const config = require('./config.json');
const fs = require('fs');
const scroll = require('./scroll');
// const findPrice = require('./lookforprice');

const sleep = (ms) => new Promise( (res) => {
    setTimeout (res, ms);
});

(async () => {
    
    const browser = await getPage();
    const page = await browser.newPage();
    // await page.goto('https://vk.com/stremobzorstore')
    await page.goto('https://vk.com');
    await page.setViewport({
        width: 1370,
        height: 900
    });
    page.on('console', (msg) => {
        console.log('PAGE.LOG', msg.text());
    })
    //пока что заходим с авторизацией в VK, на сервере настроим без авторизации, тк везде настройки индивидуальные 
    // await page.$eval('#index_email', (elem, login) => {
    //     elem.value = login;
    // }, config.login);
    // await page.$eval('#index_pass', (elem, password) => {
    //     elem.value = password;
    // }, config.password);

    // await page.click('#index_login_button');
    // await page.waitForNavigation();
    // https://vk.com/tmrkt
    //https://vk.com/shmotki_shmotochki
    // https://vk.com/getsneakers
    // https://vk.com/stocksaintpetersburg
    // https://vk.com/stremobzorstore
    // https://vk.com/krossovkee
    // https://vk.com/hype35
    // https://vk.com/fa_sales
    // https://vk.com/sneakersale*
    // https://vk.com/baraholkacasualnaya*
    // https://vk.com/marktplc
    // https://vk.com/brahand*
    // https://vk.com/resellpoint
    const pageURL = 'https://vk.com/tmrkt';
    


    let res = await parsePage(page, pageURL);
        
        console.log(res);
        console.log(res.length);
        
    fs.writeFile("dataStremObzorStore.json", JSON.stringify(res), 'utf8', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The data has been scraped and saved successfully! View it at './dataStremObzorStore.json'");
    });

    await browser.close();
                                                           
})();



// запускаем браузер и возвращаем страничку
async function getPage(){
    try{
        const browser = puppeteer.launch({
            // executablePath: '/Programs/chrome-win/chrome.exe',
            // userDataDir: "/Users/grish/AppData/Local/Chromium/User Data/Profile 1",
            //рабочий Chromium
            // executablePath: '/Program Files (x86)/Chromium/Application/chrome.exe',
            // userDataDir: "/Users/user/AppData/Local/Chromium/User Data/Profile 1",
            headless: true,
        });
        return browser
    }
    catch (error){
        console.log(`Не удалось открыть browser, из-за ошибки: ${error}`);
    }
}

//парсим группу 
    async function parsePage(page, pageURL){
        try{
            await page.goto(pageURL);
            console.log(`Открываю страницу: ${pageURL}`);
        }
        catch (error) {
            console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${error}`);
        }


        let counter = 0;
        let todayDate = new Date();
        let todayMinusOneMonth = new Date(todayDate.setDate(todayDate.getDate() - 10));
        let oneMonthPeriod = new Date(todayMinusOneMonth);
        while (counter < 5000) {
            // const container = await page.evaluate(() => {return document.body.innerHTML});
   
            // const doc = await page.evaluate(() => {return document.createElement('div')});
            // await scroll.scrollToBottomSmoothPromise(container, 30, 3000, doc);
            await scroll.scrollPageToBottom(page);
            const date = await page.$$eval('.post', parseFuncLastPostDate);
            console.log(date);
            counter += 1;
            
            //17 янв в 23:03
            //смотрим на дату последнего поста, если больше определённой, то завершаем скрипт


            console.log(oneMonthPeriod);
            if(convertData(date) < oneMonthPeriod){
                break
            }
        }
         
        // const scrollStep = 250 // default
        // const scrollDelay = 100 // default
        // await scrollPageToBottom(page, scrollStep, scrollDelay)

        // await function autoScroll(page){
        //     const scrollStep = 250 // default
        //     const scrollDelay = 100 // default
        //     puppeteerAutoscrollDown(page, scrollStep, scrollDelay);
        //     scrollStep -= 20;
        // }
        
        // const scrollStep = 250 // default
        // const scrollDelay = 10  // default

        // await puppeteerAutoscrollDown(page, scrollStep, scrollDelay);

        // await sleep(500);

        //собираем посты



        const result = await page.$$eval('.post', parseFunc);


        return result;
    }

//скрипт собирающий посты
const parseFunc = (elements) => {
    const data = [];
    for (const el of elements){
        if(el.querySelector('.wall_post_text') && el.querySelector('.post_link>.rel_date')){
            let html = el.querySelector('.wall_post_text').innerText;
            let texthtml = html.replace(/\n/gi, ' ');
            let spantext = '';
    
            if(el.querySelector('.wall_post_more')){
                let str = el.querySelector('.wall_post_text>span').innerHTML;
                spantext = str.replace(/<br>/gi, ' ');
            }        
            // let newtext = '';
            // let br = /<br>/gi;
            // let newStr = texthtml.replace(br, ' ');
            const lookforprice = (text) =>{
                var numEl = '';
                if(parseInt(text.match(/\d{5}/)) ){
                    numEl = parseInt(text.match(/\d{5}/));
                }
                else if(parseInt(text.match(/\d{4}/)) ) {
                    numEl = parseInt(text.match(/\d{4}/));
                }
                else if(parseInt(text.match(/\d{3}/)) ) {
                    numEl = parseInt(text.match(/\d{3}/));
                }
                else{
                    numEl = '-';
                }
                return numEl;
            }
    
            for (let i of texthtml){
                if (i){
                    data.push({
                        text: texthtml + spantext,
                        data: el.querySelector('.post_link>.rel_date').innerText,
                        price: lookforprice(texthtml),
                        post: `https://vk.com/${el.querySelector('.post_header_info>.post_author>.author').getAttribute("href")}?w=wall${el.querySelector('._post_content>.post_header>.post_image>img').getAttribute("data-post-id")}`
    
                    });
                    break;
                }
                // newtext += i;
            }
        }
        }

    return data;
}


const parseFuncLastPostDate = (elements) => {
    let lastDatePost = '';
    for (const el of elements){
        
        if(el.querySelector('.rel_date')){
            // let texthtml = el.querySelector('.wall_post_text').innerText;
            // for (let i of texthtml){
            //     if (i){
                    lastDatePost = el.querySelector('.rel_date').innerText;
                // }
            }
        // }
        

    }
    return lastDatePost;
}



const convertData = (e) => {
    let newStrDate = e.split(" ")
    if(Number(newStrDate[0])){
        let day = Number(newStrDate[0]);
        let month = newStrDate[1];
        let arrMonth = {
            "янв" : 0,
            "фев" : 1,
            "мар" : 2,
            "апр" : 3,
            "май" : 4,
            "июн" : 5,
            "июл" : 6,
            "авг" : 7,
            "сен" : 8,
            "окт" :  9,
            "ноя" :  10,
            "дек" :  11
        };
    
        for (let i in arrMonth){
            if (month == i){
                month = arrMonth[i];
            }
        }
        let today = new Date();
        
        let year = today.getFullYear();
        let newDate = new Date(year, month, day);
        if (today.getMonth() - newDate.getMonth() < 0){
            year = year - 1;
            newDate = new Date(year, month, day);
        }
        // let daysLag = Math.ceil(Math.abs(today.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        console.log(newDate);
        return newDate;
    }
    
    
}