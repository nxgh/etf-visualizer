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
  if (message.startsWith("!")) {
    winstonLogger.info(`🔵【${message}】${restStr} ${process.env.PORT}`);
  } else {
    winstonLogger.info(`🔷 ${message} ${restStr}`);
  }
};

const error = (message: string, rest: Record<string, unknown> | unknown = {}) => {
  const restStr = isEmpty(rest) ? "" : JSON.stringify(rest);
  winstonLogger.error(`🚫 ${message} ${restStr}`);
};

export default { info, error };

export { winstonLogger };

export interface ILogger {
  info: (message: string, ...rest: unknown[]) => void;
  error: (message: string, ...rest: unknown[]) => void;
}
