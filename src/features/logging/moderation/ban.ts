import { Events, AuditLogEvent, EmbedBuilder } from 'discord.js'

import { client } from '@/shared/consts/client'
import { getLogColor, LogEventTypes } from '@/shared/consts/colors'
import { logChannelId } from '@/shared/consts/state'

export function banUserEvent() {
    client.on(Events.GuildBanAdd, async ban => {
        const logChannel = ban.guild.channels.cache.get(logChannelId)

        if (!logChannel?.isTextBased()) return

        try {
            const auditLogs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 1,
            })

            const firstEntry = auditLogs.entries.first()

            const embed = new EmbedBuilder()
                .setTitle('🔨 Member Banned')
                .setDescription(`${ban.user.tag} was banned from the server`)
                .setColor(getLogColor(LogEventTypes.MEMBER_KICK))
                .addFields(
                    {
                        name: 'Moderator',
                        value: firstEntry?.executor?.toString() || 'Unknown',
                        inline: true,
                    },
                    {
                        name: 'Reason',
                        value: firstEntry?.reason || 'No reason provided',
                        inline: true,
                    },
                )
                .setThumbnail(ban.user.displayAvatarURL())
                .setTimestamp()

            await logChannel.send({ embeds: [embed] })

            console.log(`${ban.user.tag} was banned by ${firstEntry?.executor?.tag}`)
        } catch (error) {
            console.error('Error handling ban:', error)
        }
    })
}
