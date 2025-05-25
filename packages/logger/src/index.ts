import { createLogger, format, transports } from "winston";
import { isEmpty } from "lodash-es";
import path from "node:path";

const logsPath = path.join(process.env.LOG_PATH || "./", ".logs");

const winstonLogger = createLogger({
  format: format.combine(format.errors({ stack: true }), format.splat(), format.simple()),
  level: "info",
  transports: [
    new transports.Console({
      format: format.combine(
        format.printf((info: Record<string, unknown>): string => {
          const { message } = info;
          return message as string;
        }),
      ),
    }),
    new transports.File({ filename: `${logsPath}/error.log`, level: "error" }),
    new transports.File({
      maxsize: 1024 * 1024 * 10,
      filename: `${logsPath}/info.log`,
      format: format.combine(
        format.printf(({ context, level, message, time }) => {
          return `${message}  `;
        }),
      ),
    }),
  ],
});

// 将 emoji 映射提取为常量
const PREFIX_EMOJI_MAP = {
  "(": "🔴",
  "*": "🟢",
  "#": "🔷",
  ">": "🟧",
  "-": "🟨",
  "+": "🟩",
  "=": "🟦",
  x: "⛔️",
  X: "❌",
  "/": "🚫",
  o: "⭕️",
  "!": "❗️",
  "?": "❓",
} as const;

type PrefixKey = keyof typeof PREFIX_EMOJI_MAP;

/**
 * 格式化日志消息
 * @param message 日志消息
 * @param rest 额外信息
 */
const info = (message: string, rest: Record<string, unknown> = {}) => {
  // 提前处理额外信息
  const restStr = isEmpty(rest) ? "" : ` ${JSON.stringify(rest)}`;

  // 如果消息已经包含 emoji，直接输出
  if (/^\p{Emoji}/u.test(message)) {
    winstonLogger.info(`${message}${restStr}`);
    return;
  }

  // 获取消息前缀并查找对应的 emoji
  const prefix = message[0] as PrefixKey;
  const emoji = PREFIX_EMOJI_MAP[prefix] ?? "📝"; // 使用默认 emoji

  winstonLogger.info(`${emoji} ${message}${restStr}`);
};

const error = (message: string, rest: Record<string, unknown> | unknown = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);
  winstonLogger.error(`🚫 ${message} ${restStr}`);
};

const warn = (message: string, rest: Record<string, unknown> | unknown = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);
  winstonLogger.warn(`⚠ ${message} ${restStr}`);
};

const debug = (message: string, rest: Record<string, unknown> | unknown = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);
  winstonLogger.debug(`🪲 ${message} ${restStr}`);
};

export const logger = {
  info,
  error,
  warn,
  debug,
};

export { winstonLogger };

type LoggerType = (message: string, rest: Record<string, unknown>) => void;

export interface Logger {
  info: LoggerType;
  error: LoggerType;
  warn: LoggerType;
  debug: LoggerType;
}

export const defaultLogger: Logger = {
  info: (message, ...rest) => console.log(message, ...rest),
  error: (message, ...rest) => console.error(message, ...rest),
  warn: (message, ...rest) => console.warn(message, ...rest),
  debug: (message, ...rest) => console.debug(message, ...rest),
};
