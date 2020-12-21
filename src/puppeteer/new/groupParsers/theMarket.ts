import {filterObjectType} from "../tools/filter";

export const theMarket = (elements: Element[]) => {
    const data = [];
    for (const el of elements){
        let texthtml: string = el.querySelector('.wall_post_text').innerHTML;
        let newtext = '';
        function lookforprice(texthtml: any){
            var numEl: number | string = '';
            if(parseInt(texthtml.match(/\d{5}/)) ){
                numEl = parseInt(texthtml.match(/\d{5}/));
            }
            else if(parseInt(texthtml.match(/\d{4}/)) ) {
                numEl = parseInt(texthtml.match(/\d{4}/));
            }
            else if(parseInt(texthtml.match(/\d{3}/)) ) {
                numEl = parseInt(texthtml.match(/\d{3}/));
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
                    data: (<HTMLElement>el.querySelector('.rel_date')).innerText,
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
