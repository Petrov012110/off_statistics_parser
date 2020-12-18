const puppeteer = require('puppeteer');
const config = require('./config.json');
const fs = require('fs');
const scroll = require('./scroll');
const findPrice = require('./lookforprice');

const sleep = (ms) => new Promise( (res) => {
    setTimeout (res, ms);
});

(async () => {
    
    const browser = await getPage();
    const page = await browser.newPage();
    // await page.goto('https://vk.com/stremobzorstore')
    // await page.goto('https://vk.com');
    await page.setViewport({
        width: 1370,
        height: 900
    });
    page.on('console', (msg) => {
        console.log('PAGE.LOG', msg.text());
    })

    // await page.$eval('#index_email', (elem, login) => {
    //     elem.value = login;
    // }, config.login);
    // await page.$eval('#index_pass', (elem, password) => {
    //     elem.value = password;
    // }, config.password);

    // await page.click('#index_login_button');
    // await page.waitForNavigation();

    const pageURL = 'https://vk.com/stremobzorstore';
    


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
            executablePath: '/Program Files (x86)/Chromium/Application/chrome.exe',
            userDataDir: "/Users/user/AppData/Local/Chromium/User Data/Profile 1",
            headless: false,
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

        await scroll.autoScroll(page); 
        await sleep(500);

        //собираем посты
        const result = await page.$$eval('.post', parseFunc);

        return result;
    }

//скрипт собирающий посты
const parseFunc = (elements) => {
    const data = [];
    for (const el of elements){
        let texthtml = el.querySelector('.wall_post_text').innerHTML;
        let newtext = '';
        let br = /<br>/gi;
        let newStr = texthtml.replace(br, ' ');
        function lookforprice(texthtml){
            var numEl = '';
            if(parseInt(texthtml.match(/\d{5}/)) ){
                numEl = parseInt(texthtml.match(/\d{5}/));
            }
            else if(parseInt(texthtml.match(/\d{4}/)) ) {
                numEl = parseInt(texthtml.match(/\d{4}/));
            }
            else if(parseInt(texthtml.match(/\d{3}/)) ) {
                numEl = parseInt(texthtml.match(/\d{3}/));
            }
            else{
                numEl = '-';
            }
            return numEl;
        }

        for (let i = 0; i < texthtml.length; i++){
            if (texthtml[i] === '/'  ){
                data.push({
                    text: newStr,
                    data: el.querySelector('.rel_date').innerText,
                    price: lookforprice(texthtml),
                    customer: 'https://vk.com' + el.querySelector('.wall_signed_by').getAttribute("href"),
                    post: 'https://vk.com' + el.querySelector('.post_image').getAttribute("href") + '?w=wall' + el.querySelector('._post').getAttribute('data-post-id')
                });
                break;
            }
            newtext += texthtml[i];
        }
    }
    return data;
}