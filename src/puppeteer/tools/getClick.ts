import { clickFunctionCheckbox } from "./getCheckbox";
import { getEmail } from "./getEmail";
import { clickFunction } from "./getKeywords";

(document.querySelector('.btn') as HTMLElement).onclick = getDataFromFront;
function getDataFromFront(){
    clickFunction();
    clickFunctionCheckbox();
    getEmail();
}