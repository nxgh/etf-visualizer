/**
 * 错误处理装饰器的配置选项接口
 */
interface ErrorHandlerOptions {
  /** 自定义错误处理函数，接收错误对象和上下文。返回 true 表示错误已处理，不需要继续传播 */
  handleError?: (error: unknown, context: unknown) => boolean | undefined;
  /** finally 回调函数，在方法执行完成后调用 */
  finallyCallback?: (context: unknown) => void;
}

/**
 * 方法装饰器的目标类型
 */
type MethodDecorator = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

/**
 * 错误处理装饰器
 * 用于包装类方法，提供统一的错误处理和 finally 处理逻辑
 * 
 * @param options - 错误处理配置选项
 * @returns 方法装饰器
 * 
 * @example
 * class UserService {
 *   @catchError({
 *     handleError: (error, context) => {
 *       if (error instanceof ValidationError) {
 *         console.error('数据验证失败:', error);
 *         return true; // 错误已处理，不再传播
 *       }
 *       console.error('创建用户失败:', error);
 *       return false; // 错误会继续传播
 *     },
 *     finallyCallback: (context) => {
 *       console.log('用户创建流程结束');
 *     }
 *   })
 *   async createUser(userData: unknown) {
 *     // ... 用户创建逻辑
 *   }
 * }
 */
function catchError(options: ErrorHandlerOptions = {}): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        // 执行错误处理
        let errorHandled = false;
        
        if (options.handleError) {
          errorHandled = options.handleError(error, this) ?? false;
        } else {
          console.error(`[${String(propertyKey)}] 执行出错:`, error);
        }

        // 如果错误没有被处理，继续传播
        if (!errorHandled) {
          throw error;
        }
      } finally {
        if (options.finallyCallback) {
          options.finallyCallback(this);
        }
      }
    };

    return descriptor;
  };
}

export { catchError, type ErrorHandlerOptions };
