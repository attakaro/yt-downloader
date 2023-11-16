export function getVideoID(link) {
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubeUrlRegex);
    return match && match[1] ? match[1] : null;
}

export function clearLinkField() {
    document.getElementById("submit_link").value = "";
}