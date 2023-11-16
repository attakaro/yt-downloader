export function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const downloadSpeed = document.getElementById("speed");
    const downloadStatus = document.getElementById("download_status");
    const downloadButton = document.getElementById("download_button");
    const clearButton = document.getElementById("clear_button");

    resetProgressBar();

    downloadStatus.textContent = "STATUS: Downloading...";
    clearButton.disabled = true;
    downloadButton.disabled = true;

    const eventSource = new EventSource("/progress");

    console.log("Progress bar eventsource opened");

    eventSource.onmessage = async function(event) {

        const progressObj = JSON.parse(event.data);
        
        const speed = progressObj["speed"];
        const percentage = progressObj["percentage"];

        downloadSpeed.textContent = "Speed: " + speed + " MB/s";
        progressBar.style.width = percentage + "%";

        if (percentage === "100" && speed === "download finished") {
            eventSource.close();
            progressBar.style.width = "100%";
            downloadSpeed.textContent = "Speed: 0 MB/s";
            downloadStatus.textContent = "STATUS: Finished";
            clearButton.disabled = false;
            downloadButton.disabled = false;
            console.log("Progress bar eventsource closed");
        }
    }
}

export function resetProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const downloadSpeed = document.getElementById("speed");
    progressBar.style.width = "0%";
    downloadSpeed.textContent = "Speed: 0 MB/s";
}