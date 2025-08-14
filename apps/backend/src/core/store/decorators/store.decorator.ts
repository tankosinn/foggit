import { InjectableProxy } from 'nestjs-cls'

export function Store(): ClassDecorator {
  // eslint-disable-next-line ts/no-unsafe-function-type
  return (target: Function) => {
    InjectableProxy({ strict: true })(target)
  }
}
