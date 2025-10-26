import { bearer } from '@elysiajs/bearer'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { autoload } from 'elysia-autoload'
import { oauth2 } from 'elysia-oauth2'
import { config } from './config.ts'

export const app = new Elysia()
    .use(oauth2({}))
    .use(bearer())
    .use(cors())
    .use(jwt({ secret: config.JWT_SECRET }))
    .use(serverTiming())
    .use(autoload())
    .get('/', 'Hello World')

export type ElysiaApp = typeof app
