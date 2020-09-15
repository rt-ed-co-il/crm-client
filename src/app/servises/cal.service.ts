// function hebrey week day
export function hebWeekday(input_date: string) {
    let dt = new Date(input_date);
    let heb_weekday:string[] = ['א','ב','ג','ד','ה','ו','ש'];
    return heb_weekday[dt.getDay()];
}
