import 'dotenv/config'
import { client } from '@/shared/consts/client'
import { registerAllEvents } from '@/events'
import { validateEnvVars } from '@/shared/config/env'
import * as process from 'node:process'

validateEnvVars()
registerAllEvents()

await client.login(process.env.TOKEN)
