// export type filterObjectType = {
//     text: string,
//     date: string,
// }

// const filter = (input: filterObjectType[], keyWord: string) => {
//      return input.filter(item => item.text.includes('keyWord'));
// }

// export default filter;


// let data: any = [
//     {
//         text: 'Кроссовки Dunk Low Ceramic Nike, 9.5 US',
//         data: 'вчера в 22:00'
//       },
//       {
//         text: 'Другое SB Dunk Low Elephant Постер Eyes Box, one size',
//         data: '9 дек в 15:11'
//       },
//       {
//         text: 'bubu 1 Mid Dia de los Muertos Familia Nike x Jordan Brand, 11 US',
//         data: '9 дек в 1:00'
//       },
//       {
//         text: 'asap Air Jordan 1 Mid Patent Black White Gold Nike, 10 US',
//         data: '7 дек в 18:44'
//       },
//       {
//         text: 'Кроссовки 270 react winter Nike, 10 US',
//         data: '6 дек в 19:21'
//       },
//       { text: 'asaP Jordan Maxin 200', data: 'вчера в 21:11' },
//       { text: 'aSAp air max react 270 winter ', data: 'вчера в 21:09' },
//       { text: '1) Nike Shox TL ', data: 'вчера в 21:08' },
//       { text: 'Nike Air Force 1 Mid 07', data: 'вчера в 21:08' },
//       { text: 'ASAP', data: 'вчера в 21:08' }
// ]
// // В этой переменной будут передаваться бренды или товары, по которым будет фильтроваться напарсенный json файл
// let findData: any = {
//   id: "asap",
//   // 2: "bubu",
//   // 3: "nike"
// }


// // Фильтр, который принимает спасренный json-файл конкретной группы и переменную, которая хранит в себе список брендов или товаров
// function findInObject(findData: any, data: any): object[] {
//     const allData = [];
//       for(const k in data){
//         for (const key in data[k]){
//           data[k][key].toLowerCase()
//           for (const klue in findData){
//             if (data[k][key].toLowerCase().indexOf(findData[klue]) >= 0){
//               allData.push({
//                 newItem: data[k]
//               });
//             }
//           }
//         }
//     }
//     return allData;
//   }

//   console.log(findInObject(findData, data));
