const {Builder, By, Key, until} = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var options = new chrome.Options().headless();

(async function example(){
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        await driver.get('https://www.babybonus.msf.gov.sg');
        await driver.findElement(By.name('chat_input')).sendKeys('baby bonus', Key.RETURN);
        await driver.wait(until.elementLocated(By.className('speech\-bubble1')),10000)
        
    } finally {
        var replyPromise = driver.findElement(By.className('last_li'))
                                    .findElement(By.className('speech\-bubble1'))
                                    .findElement(By.tagName('div')).getText();
                                    
                                
        replyPromise.then((text)=>{
            console.log(text)
            driver.quit()
        });
    }
})();
