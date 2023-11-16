export function changeTextColor() {
    const hexColorCode = prompt("Enter a hex color code (e.g. #ffe333):");
    if (hexColorCode) {
        localStorage.setItem('textColor', hexColorCode);
        const body = document.querySelector('body');
        body.style.color = hexColorCode;
    }
}

export function changeTextShadowColor() {
    const hexColorCode = prompt("Enter a hex color code (e.g. #ffe333):");
    if (hexColorCode) {
        localStorage.setItem('textShadowColor', hexColorCode);
        const body = document.querySelector('body');
        body.style.textShadow = `2px 2px 5px ${hexColorCode}`
    }
}

export function changeBackground() {
    const imgUrl = prompt("Enter the direct URL to your image:");
    if (imgUrl) {
        localStorage.setItem('backgroundURL', imgUrl);
        document.querySelector('body').style.backgroundImage = `url('${imgUrl}')`;
    }
}

export function changeProgressBarBackgroundColor() {
    const hexColorCode = prompt("Enter a hex color code (e.g. #ffe333):");
    if (hexColorCode) {
        localStorage.setItem('progressBarBackgroundColor', hexColorCode);
        const progressBarContainer = document.getElementsByClassName('progress-bar-container');
        progressBarContainer[0].style.backgroundColor = hexColorCode;
    }
}

export function changeProgressBarMainColor() {
    const hexColorCode = prompt("Enter a hex color code (e.g. #ffe333):");
    if (hexColorCode) {
        localStorage.setItem('progressBarMainColor', hexColorCode);
        const progressBar = document.getElementsByClassName('progress-bar');
        progressBar[0].style.backgroundColor = hexColorCode;
    }
}

export function changeProgressBarGlowColor() {
    const rgba = prompt("Enter RGBA (e.g. 185, 28, 28, 0.5):");
    if (rgba) {
        localStorage.setItem('progressBarGlowColor', rgba);
        const progressBar = document.getElementsByClassName('progress-bar-container');
        progressBar[0].style.boxShadow = `0px 0px 15px 2px rgba(${rgba})`;
    }
}

export function changeHeader() {
    const newHeader = prompt("New header:");
    if (newHeader) {
        localStorage.setItem('header', newHeader);
        document.getElementById('main-header').textContent = `${newHeader}`;
    }
}

export function resetSettings() {
    const textColor = "whitesmoke";
    localStorage.setItem('textColor', textColor);
    document.querySelector('body').style.color = textColor;

    const textShadowColor = "black";
    localStorage.setItem('textShadowColor', textShadowColor);
    document.querySelector('body').style.textShadow = `2px 2px 5px ${textShadowColor}`;

    const backgroundURL = "https://media.tenor.com/F-XdiaIlslsAAAAd/orange-cat.gif";
    localStorage.setItem('backgroundURL', backgroundURL);
    document.querySelector('body').style.backgroundImage = `url('${backgroundURL}')`;

    const progressBarBackgroundColor = "#ccc";
    localStorage.setItem('progressBarBackgroundColor', progressBarBackgroundColor);
    const progressBarContainer = document.getElementsByClassName('progress-bar-container');
    progressBarContainer[0].style.backgroundColor = progressBarBackgroundColor;

    const progressBarMainColor = "#4CAF50";
    localStorage.setItem('progressBarMainColor', progressBarMainColor);
    const progressBar = document.getElementsByClassName('progress-bar');
    progressBar[0].style.backgroundColor = progressBarMainColor;

    const progressBarGlowColor = "0, 0, 0, 0.5";
    localStorage.setItem('progressBarGlowColor', progressBarGlowColor);
    progressBarContainer[0].style.boxShadow = `0px 0px 15px 2px rgba(${progressBarGlowColor})`;

    const header = "Youtube Video Downloader";
    localStorage.setItem('header', header);
    document.getElementById('main-header').textContent = header;
}