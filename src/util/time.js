/**
 * 获得某一天的Date
 * @param {string} time 如果输入空串，则视为当天，同时也可以输入譬如2018-01-01的形式 
 * @param {'start'|'end'} position 默认值'start'。如果输入'start'表示获取零点，'end'表示获取23:59:59
 * @return {Date} today
 */
const getDay = (time = '', position = 'start') => {
    let today = time == '' ? new Date() : new Date(time);
    if (position == 'start') {
        // xxxx-x-x 00:00:00
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
    } else {
        // xxxx-x-x 23:59:59
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        today.setMilliseconds(59);
    }

    return today;
}

/**
 * 获得x天的y天前。如今天的2天前。
 * @param {string} time 如果输入空串，则视为当天，同时也可以输入譬如2018-01-01的形式 
 * @param {'start'|'end'} ago 多少天以前，默认值0
 * @return {Date} someday
 */
const getDayAgo = (time = '', ago = 0) => {

    const offsetMS = ago * 24 * 60 * 60 * 1000;

    let today = time == '' ? new Date() : new Date(time);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);


    return new Date(today.getTime() - offsetMS);
}

/**
 * 格式化时间为 2018-01-01的模式
 * @param {*} date 
 */
const formatDate = (date) => {
    if (typeof date == 'number') {
        date = new Date(date);
    }

    const year = date.getFullYear()
    let month = date.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    let day = date.getDate();
    day = day > 9 ? day : '0' + day;

    return `${year}-${month}-${day}`
}

const formatDateAndTime = (date) => {
    if (typeof date == 'number') {
        date = new Date(date);
    }

    const year = date.getFullYear()
    let month = date.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    let day = date.getDate();
    day = day > 9 ? day : '0' + day;


    let hour = date.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    let min = date.getMinutes();
    min = min > 9 ? min : '0' + min;
    let sec = date.getSeconds();
    sec = sec > 9 ? sec : '0' + sec;


    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}


export { getDay, getDayAgo, formatDate, formatDateAndTime };