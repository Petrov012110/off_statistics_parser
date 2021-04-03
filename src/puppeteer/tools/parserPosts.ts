import { ParsedDataType } from "../types";
type ParserPostsType = (elements: Element[], currentBase: string[]) =>
    ({ date: string } & Omit<ParsedDataType, 'date'>)[];

export const parserPosts: ParserPostsType = (elements, currentBase) => {

    const data = [];

    for (const el of elements) {

        if ((el.querySelector('.wall_post_text') as HTMLElement) && (el.querySelector('.post_link>.rel_date') as HTMLElement)) {

            const html: string = (el.querySelector('.wall_post_text') as HTMLElement).innerText;
            const texthtml: string = html.replace(/\n/gi, ' ');
            const arrImagesHref = Array.from((el.querySelectorAll('.page_post_thumb_wrap'))).map(el => {
                const preRes = el.getAttribute('onclick').split('z_')[1];
                return preRes?.slice(preRes.search('https'), preRes.search('album') + 5).replaceAll('\\', '').replaceAll('\\', '');
            });

            let spantext = '';
            if (el.querySelector('.wall_post_more') as HTMLElement) {
                const str = (el.querySelector('.wall_post_text>span') as HTMLElement).innerHTML;
                spantext = str.replace(/<br>/gi, ' ');

            }

            const lookforprice = (text: any) => {

                let numEl: number | string = '';

                if (parseInt(text.match(/\d{5}/))) {
                    numEl = parseInt(text.match(/\d{5}/));
                }
                else if (parseInt(text.match(/\d{4}/))) {
                    numEl = parseInt(text.match(/\d{4}/));
                }
                else if (parseInt(text.match(/\d{3}/))) {
                    numEl = parseInt(text.match(/\d{3}/));
                }
                else {
                    numEl = '-';
                }
                return numEl;
            }

            for (const character of texthtml) {

                if (character) {

                    data.push({
                        postId: el.getAttribute('data-post-id'),
                        text: texthtml + spantext,
                        date: (el.querySelector('.post_link>.rel_date') as HTMLElement).innerText,
                        price: lookforprice(texthtml),
                        post: `https://vk.com/${el.querySelector('.post_header_info>.post_author>.author').getAttribute("href")}?w=wall${el.querySelector('._post_content>.post_header>.post_image>img').getAttribute("data-post-id")}`,
                        hrefImg: arrImagesHref,
                    });
                    break;
                }
            }
        }
    }
    if (currentBase.length > 0) {
        return data.filter((post) => !currentBase.find((postId) => postId === post.postId))
    } else return data;
}
