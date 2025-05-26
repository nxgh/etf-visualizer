
type LoggerType = (message: string, rest?: Record<string, unknown>) => void;

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
