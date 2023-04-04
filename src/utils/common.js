export function preventDefault(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
}