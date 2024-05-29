function getValue(key: string) {
    return sessionStorage.getItem(key) || null;
}

function setValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
}

function removeValue(keys: string[]) {
    keys.forEach(key => sessionStorage.removeItem(key));
}

export const Storage = { setValue, getValue, removeValue };