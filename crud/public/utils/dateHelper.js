export function parseMonth(number) {
    number++;
    if (number < 10) return `0${number}`;
    return `${number}`;
}

export function parseMonthModel(number) {
    if (number < 10) return `0${number}`;
    return `${number}`;
}

export function parseDay(number) {
    if (number < 10) return `0${number}`;
    return `${number}`;
}