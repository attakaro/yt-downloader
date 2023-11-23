import { getVideoID, clearLinkField } from './utils.js';
import { updateProgressBar, resetProgressBar } from './progress_bar.js';
import { download } from './download.js';
import {  
    changeTextColor, 
    changeTextShadowColor,
    changeBackground,
    changeProgressBarBackgroundColor, 
    changeProgressBarMainColor, 
    changeProgressBarGlowColor, 
    changeHeader, 
    resetSettings 
} from './customize.js'

loadSettings();

const downloadButton = document.getElementById("download_button");
downloadButton.addEventListener("click", runApp);

const clearButton = document.getElementById("clear_button");
clearButton.addEventListener("click", clearLinkField);

const textColorSetting = document.getElementById("text-color-setting");
textColorSetting.addEventListener("click", changeTextColor)

const textShadowColorSetting = document.getElementById("text-shadow-color-setting");
textShadowColorSetting.addEventListener("click", changeTextShadowColor)

const backgroundSetting = document.getElementById("background-setting")
backgroundSetting.addEventListener("click", changeBackground);

const progressBarBackgroundColorSetting = document.getElementById("progress-bar-background-color-setting")
progressBarBackgroundColorSetting.addEventListener("click", changeProgressBarBackgroundColor);

const progressBarMainColorSetting = document.getElementById("progress-bar-main-color-setting")
progressBarMainColorSetting.addEventListener("click", changeProgressBarMainColor);

const progressBarGlowColorSetting = document.getElementById("progress-bar-glow-color-setting")
progressBarGlowColorSetting.addEventListener("click", changeProgressBarGlowColor);

const headerSetting = document.getElementById("header-setting")
headerSetting.addEventListener("click", changeHeader);

const reset = document.getElementById("reset-settings");
reset.addEventListener("click", resetSettings);


async function runApp(event) {
    event.preventDefault(); 

    const downloadButton = document.getElementById("download_button");
    const clearButton = document.getElementById("clear_button");
    const downloadStatus = document.getElementById("download_status");

    const link = document.getElementById("submit_link").value;
    const videoID = getVideoID(link);

    if (videoID == null) {
        downloadStatus.textContent = "STATUS: Wrong link!";
        return 
    }

    updateProgressBar();
    
    try {
        await download(videoID);
    } catch (err) {
        resetProgressBar();
        downloadButton.disabled = false;
        clearButton.disabled = false;
        downloadStatus.textContent = "STATUS: " + err;
        console.error(err);
        return
    }
}

function loadSettings() {
    const savedTextColor = localStorage.getItem('textColor');
    document.querySelector('body').style.color = savedTextColor;

    const savedTextShadowColor = localStorage.getItem('textShadowColor');
    document.querySelector('body').style.textShadow = `2px 2px 5px ${savedTextShadowColor}`;

    const savedBackground = localStorage.getItem('backgroundURL');
    document.querySelector('body').style.backgroundImage = `url('${savedBackground}')`;

    const savedProgressBarBackgroundColor = localStorage.getItem('progressBarBackgroundColor');
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.style.backgroundColor = savedProgressBarBackgroundColor;

    const savedProgressBarMainColor = localStorage.getItem('progressBarMainColor');
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.backgroundColor = savedProgressBarMainColor;

    const savedProgressBarGlowColor = localStorage.getItem('progressBarGlowColor');
    progressBarContainer.style.boxShadow = `0px 0px 15px 2px rgba(${savedProgressBarGlowColor})`;

    const savedHeader = localStorage.getItem('header');
    document.getElementById('main-header').textContent = savedHeader;
}
