import type { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import ms from 'ms'
import { generateToken, TokenGeneratorOptions } from '../utils'

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private keys(namespace: string, key: string) {
    return {
      rateLimit: `otp:rate:${namespace}:${key}`,
      otp: `otp:${namespace}:${key}`,
    }
  }

  async create(namespace: string, key: string, options?: TokenGeneratorOptions) {
    const keys = this.keys(namespace, key)

    const rateLimit = await this.cacheManager.get(keys.rateLimit)
    if (rateLimit != null) {
      throw new HttpException('OTP already sent, please check your inbox', HttpStatus.TOO_MANY_REQUESTS)
    }

    await this.cacheManager.set(keys.rateLimit, true, ms('1m'))

    const otp = generateToken(options)
    await this.cacheManager.set(keys.otp, otp, ms('15m'))
    return otp
  }

  async validate(namespace: string, key: string, otp: string) {
    const keys = this.keys(namespace, key)

    const cachedOtp = await this.cacheManager.get<string>(keys.otp)
    if (cachedOtp !== otp) {
      return false
    }

    await this.cacheManager.del(keys.otp)
    await this.cacheManager.del(keys.rateLimit)

    return true
  }
}
