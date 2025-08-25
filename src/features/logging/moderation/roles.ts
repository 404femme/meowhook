import { logChannelId, PREVENT_DUPLICATE_MENTIONS } from '@/shared/consts/state'
import { client } from '@/shared/consts/client'
import { getLogColor, LogEventTypes, type LogEventType } from '@/shared/consts/colors'
import type {
    GuildMember,
    NewsChannel,
    Role,
    StageChannel,
    TextChannel,
    VoiceChannel,
} from 'discord.js'
import {
    EmbedBuilder,
    Events,
    type PrivateThreadChannel,
    type PublicThreadChannel,
} from 'discord.js'

export function roleUpdateEvent() {
    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
        const textChannel = newMember.guild.channels.cache.get(logChannelId)

        if (!textChannel || !textChannel.isTextBased()) return

        try {
            const addedRoles = newMember.roles.cache.filter(
                role => !oldMember.roles.cache.has(role.id),
            )

            const removedRoles = oldMember.roles.cache.filter(
                role => !newMember.roles.cache.has(role.id),
            )

            for (const [_, role] of addedRoles) {
                logRoleChange(
                    newMember,
                    role,
                    'added',
                    '➕ Role Added',
                    LogEventTypes.ROLE_ADD,
                    textChannel,
                )
            }

            for (const [_, role] of removedRoles) {
                logRoleChange(
                    newMember,
                    role,
                    'lost',
                    '➖ Role Removed',
                    LogEventTypes.ROLE_REMOVE,
                    textChannel,
                )
            }
        } catch (error) {
            console.error('Error handling role update:', error)
        }
    })
}

function logRoleChange(
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
) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(
            `${member.toString()} ${action === 'added' ? 'was given the' : 'lost the'} ${role.toString()} role`,
        )
        .setColor(getLogColor(eventType))
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

    void textChannel.send({ embeds: [embed], ...PREVENT_DUPLICATE_MENTIONS })

    console.log(`${member.user.tag} ${action} the ${role.name} role`)
}
