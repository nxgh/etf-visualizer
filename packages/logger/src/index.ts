import { createLogger, format, transports } from "winston";
import { isEmpty } from "lodash-es";
import path from "node:path";

const logsPath = path.join(process.env.LOG_PATH || "./", ".logs");

const winstonLogger = createLogger({
  format: format.combine(format.errors({ stack: true }), format.splat(), format.simple()),
  // level: "info",
  transports: [
    new transports.Console({
      format: format.combine(
        format.printf((info: Record<string, unknown>): string => {
          const { message } = info;
          return message as string;
        })
      ),
    }),
    new transports.File({ filename: `${logsPath}/error.log`, level: "error" }),
    new transports.File({
      maxsize: 1024 * 1024 * 10,
      filename: `${logsPath}/info.log`,
      format: format.combine(
        format.printf(({ context, level, message, time }) => {
          return `${message}  `;
        })
      ),
    }),
  ],
});

const info = (message: string, rest: Record<string, unknown> = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);

  // 定义消息前缀和对应的emoji映射
  const prefixEmojiMap: Record<string, string> = {
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
  };

  const hasLeadingEmoji = /^\p{Emoji}/u.test(message);
  if (hasLeadingEmoji) {
    winstonLogger.info(`${message} ${restStr} ${process.env.PORT}`);
    return;
  }

  // 获取消息的第一个字符
  const prefix = message[0];
  const emoji = prefixEmojiMap[prefix];

  if (emoji) {
    const shouldIncludePort = prefix === "!";
    const portSuffix = shouldIncludePort ? ` ${process.env.PORT}` : "";
    winstonLogger.info(`${emoji} ${message}${restStr}${portSuffix}`);
  }
};

const error = (message: string, rest: Record<string, unknown> | unknown = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);
  winstonLogger.error(`🚫 ${message} ${restStr}`);
};

export { info, error };

export { winstonLogger };

export interface ILogger {
  info: (message: string, ...rest: unknown[]) => void;
  error: (message: string, ...rest: unknown[]) => void;
}
