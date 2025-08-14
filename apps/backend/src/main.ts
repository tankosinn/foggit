import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Config } from './core/config'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService<Config, true>)

  // https://expressjs.com/en/5x/api.html#app.settings.table
  app.set('query parser', 'extended')

  app.use(helmet())

  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    credentials: true,
  })

  app.use(cookieParser())

  await app.listen(configService.get('PORT'))
}

void bootstrap()
