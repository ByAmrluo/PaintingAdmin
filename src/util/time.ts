export const getTime = (): string => {
    let time = new Date().getHours()
    if (time < 9) {
        return '早上好'
    } else if (time <= 12) {
        return '中午好'
    } else if (time <= 18) {
        return '下午好'
    } else {
        return '晚上好'
    }
}