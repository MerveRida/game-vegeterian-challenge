export default {isDark, toggle};

export function isDark() {
    if(window.localStorage.getItem('dark')===null){
        window.localStorage.setItem('dark', 'false');
    } else if (window.localStorage.getItem('dark')==='true'){
        return true;
    } else {
        return false;
    }
};

export function toggle() {
    if(window.localStorage.getItem('dark')===null){
        window.localStorage.setItem('dark', 'true');
    }
    if (isDark()) {
        window.localStorage.setItem('dark', 'false');
    } else {
        window.localStorage.setItem('dark', 'true');
    }
};
