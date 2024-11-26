
export const returnNumberFromAny = (num?: any) => {
    num = Number(num);
    if(typeof num === 'number' && !Number.isNaN(num)){
        return num;
    }
    else {
        return 0;
    }
}