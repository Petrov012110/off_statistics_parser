const parseFuncLastPostDate = (elements: Element[]) => {

    let lastDatePost:string = '';

    for (const el of elements){

        if(el.querySelector('.rel_date') as HTMLElement){

            lastDatePost = (el.querySelector('.rel_date') as HTMLElement).innerText;
        }
    }
    return lastDatePost;
}

export default parseFuncLastPostDate;