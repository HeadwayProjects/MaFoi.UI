export function preventDefault(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
}

export function download(fileName, filePath) {
    if (fileName && filePath) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}