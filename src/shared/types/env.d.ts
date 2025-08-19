import { ENV_VARS } from '@/shared/config/env'

type GeneratedEnvs = {
    [K in keyof typeof ENV_VARS]: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends GeneratedEnvs {}
    }
}
