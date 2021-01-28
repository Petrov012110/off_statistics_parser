export const clickFunction = () => {
    const elements : any = document.querySelectorAll('ul>li');
    const keyWords : string[] = [];

    for (const elem of elements ) {
        if(elem.className === 'brand-product__li active__li'){
            keyWords.push(elem.id);
        }
    }
    return keyWords;
}