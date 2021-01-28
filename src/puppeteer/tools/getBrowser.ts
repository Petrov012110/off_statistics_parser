export async function getPage(puppeteer: any){
    try{
        const browser = puppeteer.launch({
            // executablePath: '/Programs/chrome-win/chrome.exe',
            // userDataDir: "/Users/grish/AppData/Local/Chromium/User Data/Profile 1",
            // рабочий Chromium Grisha
            // executablePath: '/Program Files (x86)/Chromium/Application/chrome.exe',
            // userDataDir: "/Users/user/AppData/Local/Chromium/User Data/Profile 1",
            headless: false,
        });
        return browser
    }
    catch (error){
        console.log(`Не удалось открыть browser, из-за ошибки: ${error.message}`);
    }
}