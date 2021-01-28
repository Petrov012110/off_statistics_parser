import autoScroll from "./autoScroll/scroll";
import { sleep } from "./sleep";
import { groupNameType } from "../resources/groups";
import { Page } from "puppeteer";
import parseFuncLastPostDate from "./autoScroll/lastPostDate";
import convertData from "./autoScroll/convertDate";

export async function parsePage(page: Page, pageURL: string, parseFunc: () => object){
    try{
        await page.goto(pageURL);
        console.log(`Открываю страницу: ${pageURL}`);
    }
    catch (error) {
        console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${error}`);
    }
    /*---------------------НОВЫЙ СКРОЛЛ, НУЖНО ТЕСТИТЬ---------------------- */
    let counter: number = 0;
    const todayDate: Date = new Date();
    const todayMinusOneMonth = new Date(todayDate.setDate(todayDate.getDate() - 30)); // вычисляем дату, которая была 30 дней назад, до нее и будем скролить
    const oneMonthPeriod = new Date(todayMinusOneMonth); // переводим из милисекунд в обычный формат

    while (counter < 5000) {
        await autoScroll(page);
        const date: string = await page.$$eval('.post', parseFuncLastPostDate); // возвращается след формат: "17 янв", наш последний пост каждого скролла
        // console.log(date);
        counter += 1;
        // смотрим на дату последнего поста, если больше определённой, то завершаем скрипт
        // console.log(oneMonthPeriod);
        if(convertData(date) < oneMonthPeriod){ // сравнивается при каждом цикле дата последнего поста при скролле и заданая дата, в нашем случае сегодня вычесть 30 дней (переменная todayMinusOneMonth)
            break
        }
    }

    // console.log('скролим');
    // await autoScroll(page);
    // console.log('Пауза');
    // await sleep(500);

    // собираем посты
    console.log('получаем данные');
    const result = await page.$$eval('.post', parseFunc);
    console.log('Данные:', result);

    return result;
}