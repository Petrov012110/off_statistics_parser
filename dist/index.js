"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-escape */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const getPostsInfo_1 = __importDefault(require("./puppeteer/getPostsInfo"));
// import { groupNameType } from "./puppeteer/resources/groups";
const puppeteer_1 = __importDefault(require("puppeteer"));
const classificator_1 = require("./puppeteer/resources/classificator");
const app = express_1.default();
const PORT = 808;
let parsedData = [];
app.use(cors_1.default());
app.use(body_parser_1.default.json());
const mainFunc = async () => {
    const browser = await puppeteer_1.default.launch({
        headless: false,
    });
    //Функция для периодического сканирования групп
    const parsePages = () => {
        getPostsInfo_1.default(browser)
            .then(data => {
            console.log('[parsePages] : data parsed');
            parsedData = data;
        })
            .catch(e => console.error(e))
            .finally(() => setTimeout(() => parsePages(), 1000 * 60 * 60 * 12));
    };
    //Запускаем сканирование 
    parsePages();
    app.get('/api/classificator', (req, res) => {
        res.send(classificator_1.classificator.map((item) => ({
            id: item.id,
            name: item.name,
            series: item.series?.map((seriesItem) => ({
                name: seriesItem.name,
                modesl: seriesItem.models?.map((modelsItem) => ({
                    name: modelsItem.name
                }))
            }))
        })));
    });
    app.post('/api/get_data', (req, res) => {
        if (req.body) {
            if (req.body.groups?.length > 0 &&
                req.body.items?.length > 0) {
                console.log('validation ok');
                //Тут мы должны из parsedData выдернуть нужные данные, сгенерить excel и вернуть в ответ на запрос
                res.send(parsedData);
            }
            else
                console.log('Error: validation failed');
        }
        else
            console.log('Error: blank body');
        console.log('Запрос: ', JSON.stringify(req.body));
    });
    app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
    });
};
mainFunc();
//# sourceMappingURL=index.js.map