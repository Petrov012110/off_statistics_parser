/* eslint-disable no-useless-escape */
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import getPostsInfo from "./puppeteer/getPostsInfo";
import puppeteer from 'puppeteer';
import { classificator } from "./puppeteer/resources/classificator";
import { groupsList } from "./puppeteer/resources/groups";
import { ParsedGroupType } from "./puppeteer/types";
import { filterDataByClassificator } from "./puppeteer/tools/filterDataByClassificator";
import fs from 'fs';
import https from 'https';

// const sslkey = fs.readFileSync('keys/vkgroupparser.h1n.ru_le_21.03.2021.crtkey');
// const sslcert = fs.readFileSync('keys/vkgroupparser.h1n.ru_le_21.03.2021.crt');

// const options = {
// 	key: sslkey,
// 	cert: sslcert
// };

const SCAN_PERIOD_HOURS = 1;
const app = express();

const PORT = 808;
let parsedData: ParsedGroupType[] = [];
try{
	const  rawdata = fs.readFileSync('parsedData.json', 'utf8');
	if(rawdata) parsedData = JSON.parse(rawdata);
	console.log('Старые данные подняты из файла "parsedData.json"');
} catch (e) {
	fs.writeFileSync('parsedData.json', JSON.stringify([]));
}

app.use(cors());
app.use(bodyParser.json());


const mainFunc = async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});

	//Функция для периодического сканирования групп
	const parsePages = () => {
		getPostsInfo(browser, parsedData)
			.then(data => {
				console.log('[parsePages] : data parsed');
				console.log(new Date());
				parsedData = data;
				fs.writeFileSync('parsedData.json', JSON.stringify(data));
			})
			.catch(e => console.error(e))
			.finally(() => setTimeout(() => parsePages(), 1000 * 60 * 60 * SCAN_PERIOD_HOURS))
	};

	//Запускаем сканирование 
	parsePages();

	app.get('/api/classificator', (req, res) => {
		res.send(classificator.map((item) => ({
			id: item.id,
			name: item.name,
			series: item.series?.map((seriesItem) => ({
				name: seriesItem.name,
				models: seriesItem.models?.map((modelsItem) => ({
					name: modelsItem.name
				}))
			}))
		})));
	});

	app.get('/api/groups', (req, res) => res.send(groupsList));

	app.post('/api/get_data', (req, res) => {
		console.log(req.body)
		if (req.body) {
			if (
				req.body.groups?.length > 0 &&
				req.body.items?.length > 0
			) {
				console.log('validation ok')

				//Тут мы должны из parsedData выдернуть нужные данные, сгенерить excel и вернуть в ответ на запрос
				res.send(filterDataByClassificator(req.body.groups, req.body.items, parsedData));

			} else console.log('Error: validation failed');
		} else console.log('Error: blank body')

		console.log('Запрос: ', JSON.stringify(req.body));
	});

	app.listen(PORT, () => {
		console.log(`server started at http://localhost:${PORT}`);
	})

	// https.createServer(options, app).listen(PORT)
};

mainFunc();
