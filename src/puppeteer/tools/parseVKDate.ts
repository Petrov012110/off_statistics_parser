const arrMonths = {
  "янв": 0,
  "фев": 1,
  "мар": 2,
  "апр": 3,
  "мая": 4,
  "июн": 5,
  "июл": 6,
  "авг": 7,
  "сен": 8,
  "окт": 9,
  "ноя": 10,
  "дек": 11
};

const hours24Regex = '\\d{1,2}:\\d{2}';
const nowRegex = 'только\\sчто';
const minuteRegex = 'минуту\\sназад';
const twoMinutesRegex = 'две\\sминуты\\sназад';
const threeMinutesRegex = 'три\\sминуты\\sназад';
const minutesRegex = '\\d{1,2}\\sминуту?ы?\\sназад';
const hourRegex = 'час\\sназад';
const twoHoursRegex = 'два\\sчаса\\sназад';
const threeHoursRegex = 'три\\sчаса\\sназад';
const fourHoursRegex = 'четыре\\sчаса\\sназад';
const todayAtRegex = `сегодня\\sв\\s${hours24Regex}`;
const yesterdayAtRegex = `вчера\\sв\\s${hours24Regex}`;
const factDateRegex = `\\d{1,2}\\s(${Object.keys(arrMonths).join('|')})\\s\\d{4}`;
const factDateTimeRegex = `\\d{1,2}\\s(${Object.keys(arrMonths).join('|')})\\sв\\s${hours24Regex}`;

const parsers = [
  {
    regex: nowRegex,
    func: (stringDate: string) => Date.now(),
  },
  {
    regex: minuteRegex,
    func: (stringDate: string) => Date.now() - 1000 * 60,
  },
  {
    regex: twoMinutesRegex,
    func: (stringDate: string) => Date.now() - 1000 * 60 * 2,
  },
  {
    regex: threeMinutesRegex,
    func: (stringDate: string) => Date.now() - 1000 * 60 * 3,
  },
  {
    regex: minutesRegex,
    func: (stringDate: string) => Date.now() - parseInt(stringDate.split(/\s/)[0]) * 1000 * 60,
  },
  {
    regex: hourRegex,
    func: (stringDate: string) => Date.now() - 1 * 1000 * 60 * 60,
  },
  {
    regex: twoHoursRegex,
    func: (stringDate: string) => Date.now() - 2 * 1000 * 60 * 60,
  },
  {
    regex: threeHoursRegex,
    func: (stringDate: string) => Date.now() - 3 * 1000 * 60 * 60,
  },
  {
    regex: fourHoursRegex,
    func: (stringDate: string) => Date.now() - 4 * 1000 * 60 * 60,
  },
  {
    regex: todayAtRegex,
    func: (stringDate: string) => {
      const dateNow = new Date();
      const time = stringDate.split(/\s/)[2].split(':');
      const startDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()).getTime();
      return startDay + parseInt(time[0]) * 1000 * 60 * 60 + parseInt(time[1]) * 1000 * 60;
    },
  },
  {
    regex: yesterdayAtRegex,
    func: (stringDate: string) => {
      const dateNow = new Date();
      const time = stringDate.split(/\s/)[2].split(':');
      const startDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()).getTime();
      return startDay - 1000 * 60 * 60 * 24 + parseInt(time[0]) * 1000 * 60 * 60 + parseInt(time[1]) * 1000 * 60;
    },
  },
  {
    regex: factDateRegex,
    func: (stringDate: string) => {
      const newStrDate = stringDate.split(/\s/);
      const day = Number(newStrDate[0]);
      const month = arrMonths[newStrDate[1] as keyof typeof arrMonths];
      const year = parseInt(newStrDate[2])
      return new Date(year, month, day).getTime();
    },
  },
  {
    regex: factDateTimeRegex,
    func: (stringDate: string) => {
      const newStrDate = stringDate.split(/\s/);
      const timeArr = newStrDate[3].split(':');
      const day = Number(newStrDate[0]);
      const month = arrMonths[newStrDate[1] as keyof typeof arrMonths];
      const today: Date = new Date();
      const year = today.getFullYear();
      return new Date(year, month, day, parseInt(timeArr[0]), parseInt(timeArr[1])).getTime();
    }
  }

];

export const parseVKDate: (stringDate: string) => number = (stringDate) => {

  const parser = parsers.find((searchParser) => stringDate.search(searchParser.regex) === 0)
  if (parser) {
    let date: number;
    try {
      date = parser.func(stringDate);
    } catch (e) {
      console.log('Не удалось распарсить дату', stringDate)
      throw e;
    }
    if (date) return date;
    else throw new Error(`Can not parse "${stringDate}"`);
  } else throw new Error(`Can not find regex for "${stringDate}"`);
};