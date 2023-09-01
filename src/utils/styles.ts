const style = getComputedStyle(document.documentElement);

export function getCSSPropertyValue(prop: string) {
    return (style.getPropertyValue(prop) || '').trim();
} 