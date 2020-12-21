import {filterObjectType} from "../tools/filter";

export const theMarket = (elements: Element[]) => {
    const data = [];
    for (const el of elements){
        const texthtml: string = el.querySelector('.wall_post_text').innerHTML;
        let newtext = '';
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

        for (let i = 0; i < texthtml.length; i++){
            if (texthtml[i] === '<' && texthtml[i+1] === 'a'){
                data.push({
                    text: newtext,
                    data: (el.querySelector('.rel_date') as HTMLElement).innerText,
                    price: lookforprice(newtext),
                    customer: '-',
                    post: 'https://vk.com' + el.querySelector('.post_image').getAttribute("href") + '?w=wall' + el.querySelector('.author').getAttribute('data-post-id')
                });
                break;
            }
            newtext += texthtml[i];
        }
    }
    return data;
}
