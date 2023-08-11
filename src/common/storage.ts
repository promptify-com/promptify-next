const LCL_STR_KEY = 'promptify:';

export default class Storage {
    static get(key: string) {
        return localStorage.getItem(`${LCL_STR_KEY}${key}`);
    }

    static set(key: string, item: string) {
        localStorage.setItem(`${LCL_STR_KEY}${key}`, item);
    }

    static remove(key: string) {
        localStorage.removeItem(`${LCL_STR_KEY}${key}`);
    }
}
