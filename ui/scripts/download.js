export async function download(videoID) {
    const data = { videoID: videoID }
    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status);
        }
        const text = await response.text();
        console.log('Fetch Response: ' + text);
    } catch (error) {
        console.error('Fetch Error: ' + error);
    }
}