import dayjs from "dayjs";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatYMD = (date: dayjs.ConfigType) => dayjs(date).format("YYYY-MM-DD");
