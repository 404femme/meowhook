export const ENV_VARS = {
    TOKEN: 'TOKEN',
    LOG_CHANNEL_ID: 'LOG_CHANNEL_ID',
    // fill more if needed
} as const

export const requiredEnvVars = Object.values(ENV_VARS)

export function validateEnvVars() {
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`)
        process.exit(1)
    }
}
