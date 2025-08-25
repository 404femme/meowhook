import { logChannelId, PREVENT_DUPLICATE_MENTIONS } from '@/shared/consts/state'
import { client } from '@/shared/consts/client'
import { getLogColor, LogEventTypes, type LogEventType } from '@/shared/consts/colors'
import type {
    GuildMember,
    NewsChannel,
    PartialUser,
    Role,
    StageChannel,
    TextChannel,
    User,
    VoiceChannel,
} from 'discord.js'
import {
    AuditLogEvent,
    EmbedBuilder,
    Events,
    type PrivateThreadChannel,
    type PublicThreadChannel,
} from 'discord.js'

export function roleUpdateEvent() {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        const logChannel = newMember.guild.channels.cache.get(logChannelId)

        if (!logChannel || !logChannel.isTextBased()) return

        try {
            const auditLogs = await newMember.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberRoleUpdate,
                limit: 1,
            })
            const auditEntry = auditLogs.entries.find(entry => entry.target?.id === newMember.id)
            const executor = auditEntry?.executor

            const addedRoles = newMember.roles.cache.filter(
                role => !oldMember.roles.cache.has(role.id),
            )

            const removedRoles = oldMember.roles.cache.filter(
                role => !newMember.roles.cache.has(role.id),
            )

            for (const [_, role] of addedRoles) {
                sendEmbedToLogChannel(
                    newMember,
                    role,
                    'added',
                    '➕ Role Added',
                    LogEventTypes.ROLE_ADD,
                    logChannel,
                    executor,
                )
            }

            for (const [_, role] of removedRoles) {
                sendEmbedToLogChannel(
                    newMember,
                    role,
                    'lost',
                    '➖ Role Removed',
                    LogEventTypes.ROLE_REMOVE,
                    logChannel,
                    executor,
                )
            }
        } catch (error) {
            console.error('Error handling role update:', error)
        }
    })
}

function sendEmbedToLogChannel(
    member: GuildMember,
    role: Role,
    action: string,
    title: string,
    eventType: LogEventType,
    textChannel:
        | NewsChannel
        | StageChannel
        | TextChannel
        | PublicThreadChannel<boolean>
        | PrivateThreadChannel
        | VoiceChannel,
    executor?: User | PartialUser | null | undefined,
) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(
            `${member.toString()} ${action === 'added' ? 'was given the' : 'lost the'} ${role.toString()} role`,
        )
        .setColor(getLogColor(eventType))
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

    if (executor) {
        embed.addFields({ name: 'Executor', value: executor.toString(), inline: true })
    }

    void textChannel.send({ embeds: [embed], ...PREVENT_DUPLICATE_MENTIONS })

    console.log(
        `${member.user.tag} ${action} the ${role.name} role by ${executor?.tag ?? 'unknown'}`,
    )
}
