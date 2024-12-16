export async function getDateFormat(day) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateString = new Intl.DateTimeFormat('en-US', options).format(new Date(`${day.year}-${day.month}-${day.day}`));
    return dateString;
}

export async function getMonthDateYearFormat() {
    const date = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}