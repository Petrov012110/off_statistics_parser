import { Browser } from "puppeteer";
import groupsList, { groupNameType } from "./resources/groups";
import { parsePage } from "./tools/parsePage";

// const config = require('./resources/config.json');

const getPostsInfo = async (browser: Browser) => {
    const result = [];
    for (const groupName in groupsList) {
        const groupHref = groupsList[groupName as groupNameType]?.href; // это объект группы, выглядит примерно так: {href: ...}
        let parserFunc; // сюда ляжет функция, которая должна будет запускаться на контенте
        if (groupHref) {
            try {
                parserFunc = (await import(`./groupParsers/${groupName}`))?.[groupName];
                if (parserFunc) {
                    // тут открываем нужное окно и запускаем в нём парсер (лучше вынести в отдельную функцию) и записываем результаты парсинга в массив result
                    const page = await browser.newPage();
                    const data = await parsePage(page, `https://vk.com/${groupHref}`, parserFunc);
                    result.push({name: groupName, data})
                } else {
                    throw new Error(`can not find parser function ${groupName} in ${groupName}.ts`)
                }
            } catch (e) {
                throw new Error(`can not find file ${groupName}.ts`)
            }
        } else {
            throw new Error(`can not find file ${groupName}.ts`)
        }
    }

    return result;
};

export default getPostsInfo;
