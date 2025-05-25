type ErrorHandlerOptions = {
  handleError?: (error: unknown, context: any) => void;
  finallyCallback?: (context: any) => void;
};

function catchError(options: ErrorHandlerOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        // 如果是异步方法，等待执行；同步方法直接执行
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        // 自定义错误处理
        if (options.handleError) {
          options.handleError(error, this); // 传递上下文（this）
        } else {
          console.error(`Error in ${propertyKey}:`, error);
        }
      } finally {
        // 执行 finally 逻辑
        if (options.finallyCallback) {
          options.finallyCallback(this); // 传递上下文（this）
        }
      }
    };

    return descriptor;
  };
}
