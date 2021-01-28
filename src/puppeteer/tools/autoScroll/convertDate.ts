const convertData = (e: string) => {
    const newStrDate = e.split(" ")
    if(Number(newStrDate[0])){
        const day: number = Number(newStrDate[0]);
        let month: any = newStrDate[1];
        const arrMonth: any = {
            "янв" : 0,
            "фев" : 1,
            "мар" : 2,
            "апр" : 3,
            "май" : 4,
            "июн" : 5,
            "июл" : 6,
            "авг" : 7,
            "сен" : 8,
            "окт" :  9,
            "ноя" :  10,
            "дек" :  11
        };
        let i : any
        for (i  in arrMonth){
            if (month === i){
                month = arrMonth[i];
            }
        }
        const today: Date = new Date();
        let year = today.getFullYear();
        let newDate: Date = new Date(year, month, day);
        if (today.getMonth() - newDate.getMonth() < 0){
            year = year - 1;
            newDate = new Date(year, month, day);
        }
        // console.log(newDate);
        return newDate;
    }
}

export default convertData;