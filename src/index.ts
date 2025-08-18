import 'dotenv/config'
import { client } from '@/shared/client'
import { registerAllEvents } from '@/events'
import { validateEnvVars } from '@/shared/config/env-check'
import * as process from 'node:process'
const tokem = process.env.TOKEN;

validateEnvVars()
registerAllEvents()

await client.login(process.env.TOKEN)
