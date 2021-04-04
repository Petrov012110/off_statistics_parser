import { autoScroll } from "./autoScroll/scroll";
import { Page } from "puppeteer";
import { getSmallPostsInfo } from "./autoScroll/getSmallPostsInfo";
import { parserPosts } from './parserPosts';
import { ParsedDataType } from "../types";
import { parseVKDate } from "./parseVKDate";

export const parsePage: (page: Page, currentBase: string[]) => Promise<ParsedDataType[]> = async (page, currentBase) => {

	let counter = 0;
	const todayDate: Date = new Date();
	const todayMinusOneMonth = new Date(todayDate.setDate(todayDate.getDate() - 30)).getTime(); // вычисляем дату, которая была 30 дней назад, до нее и будем скролить

	while (counter < 5000) {
		counter += 1;
		await autoScroll(page);
		const posts = (await page.$$eval('.wall_module .post:not(.post_fixed)', getSmallPostsInfo))
			.map((post) => ({ date: parseVKDate(post.date), postId: post.postId }));

		// Если в базе что-то есть по этой группе, то сравниваем postId, если нет, смотрим на дату поста
		if (currentBase.length > 0) {
			// Если находится пост из тех что уже есть в базе, останавливаем скролл
			if (posts.filter((post) => !!currentBase.find((postid) => postid === post.postId)).length > 0) break;
		} else {
			// Если находится пост,дата публикации которого раньше чем сегодня минус 30 дней, то останавливаем скролл
			if (posts.find((post) => {
				return post.date <= todayMinusOneMonth
			})) break;
		}
	}

	// собираем посты
	console.log('[parsePage] Получаем данные');
	const result = (await page.$$eval('.wall_module .post:not(.post_fixed)', parserPosts, currentBase))
		.map((element) => ({
			date: parseVKDate(element.date),
			text: element.text,
			postId: element.postId,
			price: element.price,
			post: element.post,
			hrefImg: element.hrefImg,
		}));

	if (result.length > 0) {
		console.log(`[parsePage] Данные получены: добавлено ${result.length} постов`);
	} else {
		console.log('[parsePage] Группа просканирована, новых постов не найдено');
	}

	return result;
}