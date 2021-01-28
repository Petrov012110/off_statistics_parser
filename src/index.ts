import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import getPostsInfo from "./puppeteer/getPostsInfo";
// import { groupNameType } from "./puppeteer/resources/groups";
import puppeteer from 'puppeteer';

const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const app = express();
const PORT = 808;
let parsedData: { name: string; data: object; }[] = [];

app.use(cors());
app.use(bodyParser.json());

const mainFunc = async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    //Функция для периодического сканирования групп
    const parsePages = () => {
        getPostsInfo(browser)
            .then(data => {
                console.log('[parsePages] : data parsed');
                parsedData = data;
            })
            .catch(e => console.error(e))
            .finally(()=> setTimeout(()=>parsePages(), 1000*60*60*12))
    };

    //Запускаем сканирование 
    parsePages();

    app.post('/api/parse', (req, res) => {
        if (req.body) {
            if (
                req.body.email?.length > 0 && validateEmail(req.body.email) &&
                req.body.groups.length > 0
            ) {
                console.log('validation ok')
                //Тут мы должны из parsedData выдернуть нужные данные, сгенерить excel и вернуть в ответ на запрос
                res.send(parsedData);
                

            } else console.log('Error: validation failed');
        } else console.log('Error: blank body')

        console.log('Запрос: ', JSON.stringify(req.body));
    });

    app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
    })
};

mainFunc();
