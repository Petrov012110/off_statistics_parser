export async function getPage(puppeteer: any){
    try{
        const browser = puppeteer.launch({
            headless: false,
        });
        return browser
    }
    catch (error){
        console.log(`Не удалось открыть browser, из-за ошибки: ${error.message}`);
    }
}