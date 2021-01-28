export const clickFunctionCheckbox = () => {
    const checks : any = document.querySelectorAll('.content-box__filter>label>input:checked');
    const arrCheckbox: string[] = [];

    for (const el of checks) {
        arrCheckbox.push(el.id);
    }
    return arrCheckbox;
}