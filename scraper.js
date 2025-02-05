// WHEN I WORK CHECK
require('dotenv').config({ path: '.env.local' });
const { Builder, By } = require('selenium-webdriver');
const USER_EMAIL = process.env.USER_EMAIL;
const PASSWORD = process.env.PASSWORD;
const chrome = require('selenium-webdriver/chrome');





const runScraper = async () => {
    const options = new chrome.Options();
    options.headless(); // Enable headless mode

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.get('https://login.wheniwork.com/scheduler');
    await driver.findElement(By.name('email')).sendKeys(USER_EMAIL)
    await driver.findElement(By.name('password')).sendKeys(PASSWORD)
    await driver.findElement(By.className('btn-login')).click()
    await driver.sleep(5000)
    console.log('logged in!')
    await driver.findElement(By.className('wiw-schedule')).click()
    const url = await driver.getCurrentUrl()
    if (url != "https://appx.wheniwork.com/scheduler") {
        await driver.get('https://appx.wheniwork.com/scheduler');
    }
    await driver.sleep(4000)
    // All Employee Schedule Rows
    const allScheduleRows = await driver.findElements(By.className("schedule-row-container"))
    if (allScheduleRows) {
        console.log("All schedule rows found!")
    }
    const employeesWorkingToday = []
    await Promise.all(allScheduleRows.map(async (row) => {
        console.log("Mapping through one schedule ...")
        try {
            const col7Div = await row.findElement(By.className("col-7"));
            const textTruncateDiv = await col7Div.findElement(By.className("text-truncate"));
            const employeeName = await textTruncateDiv.getText();
            if (employeeName) {
                console.log("Employee found", employeeName)
                const employeeCellToday = await row.findElement(By.className("today"));
                try {
                    const outerShiftDiv = await employeeCellToday.findElement(By.className("details-row"))
                    if (outerShiftDiv) {
                        const shift = await outerShiftDiv.findElement(By.className("shift-tag"));
                        const shiftType = await shift.getText();
                        console.log("Shift retrieved!")
                        employeesWorkingToday.push({ name: employeeName, shift: shiftType });
                    }
                } catch (err) {
                    console.log("No shift found for this employee")
                }
            }
        } catch (err) {
            // Ignore errors and continue
        }
    }));
    console.log("Today's schedule")
    console.log(employeesWorkingToday)
    return employeesWorkingToday
}
module.exports = { runScraper };
