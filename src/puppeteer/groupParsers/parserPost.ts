// import {filterObjectType} from "../tools/filter";

export const stremobzorstore = (elements: Element[]) => {

    const data = [];

    for (const el of elements){

        if((el.querySelector('.wall_post_text') as HTMLElement) && (el.querySelector('.post_link>.rel_date') as HTMLElement)){

            const html: string = (el.querySelector('.wall_post_text') as HTMLElement).innerText;
            const texthtml: string = html.replace(/\n/gi, ' ');

            let spantext: string = '';
            if(el.querySelector('.wall_post_more') as HTMLElement){
                const str = (el.querySelector('.wall_post_text>span') as HTMLElement).innerHTML;
                spantext = str.replace(/<br>/gi, ' ');

            }

            const lookforprice = (text: any) => {

                let numEl: number | string = '';

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

            for (const character of texthtml){

                if (character){

                    data.push({
                        text: texthtml + spantext,
                        date: (el.querySelector('.post_link>.rel_date') as HTMLElement).innerText,
                        price: lookforprice(texthtml),
                        post: `https://vk.com/${el.querySelector('.post_header_info>.post_author>.author').getAttribute("href")}?w=wall${el.querySelector('._post_content>.post_header>.post_image>img').getAttribute("data-post-id")}`
                    });
                    break;
                }
                }
            }
    }
    return data;
}
