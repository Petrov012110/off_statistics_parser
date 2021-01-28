// import {filterObjectType} from "../tools/filter";

export const theMarket = (elements: Element[]) => {
    const data = [];
    for (const el of elements){
        const texthtml: string = (el.querySelector('.wall_post_text') as HTMLElement).innerText;

        let spantext: string = '';
        if(el.querySelector('.wall_post_more') as HTMLElement){
            spantext = (el.querySelector('.wall_post_text>span') as HTMLElement).innerText;
        }

        // let newtext: string = '';
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

        for (const i of texthtml){
            if (i){
                data.push({
                    text: texthtml + spantext,
                    data: (el.querySelector('.rel_date') as HTMLElement).innerText,
                    price: lookforprice(texthtml),
                    customer: '-',
                    post: 'https://vk.com' + el.querySelector('.post_image').getAttribute("href") + '?w=wall' + el.querySelector('.author').getAttribute('data-post-id')
                });
                break;
            }
            // newtext += i;
        }
    }
    return data;
}
