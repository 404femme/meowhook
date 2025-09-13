import { serve } from '@hono/node-server'
import { Hono } from 'hono'

export function handleMonitoring() {
    const app = new Hono()

    app.get('/ping', c => {
        return c.text('pong', 200)
    })

    const defaultPort = 3000
    console.log('Monitoring erver is running on port', defaultPort)

    return serve({
        fetch: app.fetch,
        port: defaultPort,
    })
}
