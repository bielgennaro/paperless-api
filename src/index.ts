import { config } from './config.ts'
import { app } from './server.ts'

const signals = ['SIGINT', 'SIGTERM']

for (const signal of signals) {
    process.on(signal, async () => {
        console.warn(`Received ${signal}. Initiating graceful shutdown...`)
        await app.stop()
        process.exit(0)
    })
}

process.on('uncaughtException', (error) => {
    console.error(error)
})

process.on('unhandledRejection', (error) => {
    console.error(error)
})

app.listen(config.PORT, () =>
    console.warn(`🦊 Server started at ${app.server?.url.origin}`))
