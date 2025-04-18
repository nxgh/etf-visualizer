import localforage from "localforage";
import {
  difference,
  isArray,
  isObject,
  isMatch,
  isPlainObject,
  differenceWith,
} from "lodash-es";

export const updateFavorites = async (
  value: { code: string; name: string } | { code: string; name: string }[]
) => {
  const rawValue: { code: string; name: string }[] =
    (await localforage.getItem("favorites")) || [];

  const v = isArray(value) ? value : [value];
  // 去重
  const uniqueValue = [...rawValue, ...v].filter(
    (item, index, self) => index === self.findIndex((t) => t.code === item.code)
  );

  await localforage.setItem("favorites", uniqueValue);
};
