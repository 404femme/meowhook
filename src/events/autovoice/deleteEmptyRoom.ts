import { Events, type VoiceState } from "discord.js";
import { client } from "@/shared/consts/client";
import { tempChannels } from "@/shared/consts/tempChannels";

export function roomDelete() {
    client.on(Events.VoiceStateUpdate, async (oldState: VoiceState, newState: VoiceState) => {
        if (oldState.channel && tempChannels.has(oldState.channel.id)) {
            const channel = oldState.channel;
            if (channel.members.size === 0) {
                await channel.delete().catch(() => { });
                tempChannels.delete(channel.id);
            }
        }

    });
}
