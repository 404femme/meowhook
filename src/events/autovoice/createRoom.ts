import { LOBBY_CHANNEL_ID } from "@/shared/consts/voice";
import { client } from "@/shared/consts/client";
import { ChannelType, Events, PermissionFlagsBits } from "discord.js";
import { registerTempChannel } from "@/shared/consts/tempChannels";

export function handleVoiceCreate() {
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        if (!oldState.channel && newState.channel?.id === LOBBY_CHANNEL_ID) {
            const guild = newState.guild;
            const member = newState.member;

            if (!member) throw new Error("Member null");

            const newChannel = await guild.channels.create({
                name: `${member.user.username}'s Room `,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent?.id,
                userLimit: 5,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: [
                            PermissionFlagsBits.ManageChannels,
                            PermissionFlagsBits.MoveMembers,
                            PermissionFlagsBits.MuteMembers,
                            PermissionFlagsBits.DeafenMembers,
                            PermissionFlagsBits.Connect,
                            PermissionFlagsBits.Speak,
                        ],
                    },
                ],

            });
            registerTempChannel(newChannel);

            await member.voice.setChannel(newChannel);

            return newChannel;
        }

        return null;
    });
}

