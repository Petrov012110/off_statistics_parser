"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const getPostsInfo_1 = __importDefault(require("./puppeteer/getPostsInfo"));
// import { groupNameType } from "./puppeteer/resources/groups";
const puppeteer_1 = __importDefault(require("puppeteer"));
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
const app = express_1.default();
const PORT = 808;
let parsedData = [];
app.use(cors_1.default());
app.use(body_parser_1.default.json());
const mainFunc = async () => {
    const browser = await puppeteer_1.default.launch({
        headless: true,
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
    app.post('/api/parse', (req, res) => {
        if (req.body) {
            if (req.body.email?.length > 0 && validateEmail(req.body.email) &&
                req.body.groups.length > 0) {
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