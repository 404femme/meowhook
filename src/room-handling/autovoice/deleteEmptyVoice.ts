import { Events, type VoiceState } from 'discord.js'
import { client } from '@/shared/consts/client.ts'
import { tempChannels } from '@/room-handling/autovoice/tempChannels.ts'

export function deleteEmpty() {
    client.on(Events.VoiceStateUpdate, async (oldState: VoiceState) => {
        if (oldState.channel && tempChannels.has(oldState.channel.id)) {
            const channel = oldState.channel

            if (channel.members.size === 0) {
                await channel.delete().catch(() => {})
                tempChannels.delete(channel.id)
            }
        }
    })
}
