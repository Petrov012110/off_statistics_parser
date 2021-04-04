import { classificator } from '../resources/classificator';
import {
  BrandType,
  ClassificatorType,
  ModelType,
  ParsedDataType,
  ParsedGroupType,
  SeriesType
} from '../types';

export const filterDataByClassificator: (groups: string[], filterObject: ClassificatorType, data: ParsedGroupType[]) => ParsedGroupType[] = (groups, filterObject, data) => {
  const ret: ParsedGroupType[] = [];

  if (groups.length > 0) {
    if (filterObject.length > 0) {
      const newGroups = data.filter(group => groups.find(groupName => groupName === group.name));
      for (const group of newGroups) {
        const newData: ParsedDataType[] = group.data.filter(post => check(post.text.toLocaleLowerCase(), filterObject));
        if (newData.length > 0) {
          ret.push({
            name: group.name,
            data: newData.map((post) => ({
              price: group.name === 'theMarket' ? post.price : 0,
              postId: post.postId,
              text: post.text,
              date: post.date,
              post: post.post,
              hrefImg: post.hrefImg,
            })),
          })
        }
      }
    } else throw new Error('Не выбрано ни одного бренда');
  } else throw new Error('Не выбрано ни одной группы');

  return ret;
};

const checkByModel = (text: string, seriesFromClassificator: SeriesType, modelsFromFilter: ModelType[]) => {
  let ret = false;

  for (const modelFromFilter of modelsFromFilter) {
    const modelFromClassificator = seriesFromClassificator.models.find(model => model.name === modelFromFilter.name);
    const unionRexexpArray = seriesFromClassificator?.regexp ? modelFromClassificator?.regexp.reduce<string[]>(
      (acc, modelRegexp) => {
        seriesFromClassificator?.regexp?.length > 0
          ? seriesFromClassificator
            ?.regexp
            ?.map((seriesRegexp) => `${seriesRegexp}.*${modelRegexp}`)
            ?.forEach((unionRegexp) => acc.push(unionRegexp))
          : acc.push(modelRegexp);
        return acc;
      },
      [],
    ) : modelFromClassificator?.regexp;
    if (unionRexexpArray) {
      ret = !!unionRexexpArray.find(modelRegex => text.search(modelRegex) >= 0);
      if (ret === true) break;
    } else {
      console.warn(`Can not find model "${modelFromFilter.name}" in series "${seriesFromClassificator.name}"`);
    }
  }
  return ret;
};

const checkBySeries = (text: string, brandFromClassificator: BrandType, seriesFromFilter: SeriesType[]) => {
  let ret = false

  for (const seriesItemFromFilter of seriesFromFilter) {
    const seriesItemFromClassificator = brandFromClassificator.series.find(series => series.name === seriesItemFromFilter.name);
    if (seriesItemFromClassificator) {
      if (seriesItemFromFilter.models?.length > 0) {
        ret = checkByModel(text, seriesItemFromClassificator, seriesItemFromFilter.models)
      } else {
        const unionRexexpArray = brandFromClassificator?.brand ? seriesItemFromClassificator?.regexp.reduce<string[]>(
          (acc, seriesRegexp) => {
            brandFromClassificator?.brand?.length > 0
              ? brandFromClassificator
                ?.brand
                ?.map((brandRegexp) => `${brandRegexp}.*${seriesRegexp}`)
                ?.forEach((unionRegexp) => acc.push(unionRegexp))
              : acc.push(seriesRegexp);
            return acc;
          },
          [],
        ) : seriesItemFromClassificator?.regexp;
        ret = !!unionRexexpArray.find(seriesRegex => text.search(seriesRegex) >= 0);
      }
      if (ret === true) break;
    } else {
      console.warn(`Can not find series "${seriesItemFromFilter.name}" in brand "${brandFromClassificator.name}"`);
    }
  }

  return ret;
};

const check = (text: string, brahandsFromFilter: BrandType[]) => {
  let ret = false;

  for (const brahandFromFilter of brahandsFromFilter) {
    const brahandFromClassificator = classificator.find(brand => brand.name === brahandFromFilter.name);
    if (brahandFromClassificator) {
      if (brahandFromFilter.series && brahandFromFilter.series.length > 0) {
        ret = checkBySeries(text, brahandFromClassificator, brahandFromFilter.series);
      } else {
        ret = !!brahandFromClassificator?.brand.find(brandRegex => text.search(brandRegex) >= 0);
      }
      if (ret === true) break;
    } else {
      console.warn(`Can not find brand "${brahandFromFilter.name}"`);
    }
  }

  return ret;
};
