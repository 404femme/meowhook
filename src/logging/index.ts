import { deleteMessageEvent } from '@/logging/messages/delete'
import { editMessageEvent } from '@/logging/messages/edit'
import { banUserEvent } from '@/logging/moderation/ban'
import { handleInvitesEvent } from '@/logging/moderation/invites'
import { kickUserEvent } from '@/logging/moderation/kick'
import { roleUpdateEvent } from '@/logging/moderation/roles'
import { voiceStateUpdateEvent } from '@/logging/voice/state'
import { voiceStreamingEvent } from '@/logging/voice/streaming'

export function featureLogging() {
    editMessageEvent()
    deleteMessageEvent()
    banUserEvent()
    kickUserEvent()
    roleUpdateEvent()
    voiceStateUpdateEvent()
    voiceStreamingEvent()
    handleInvitesEvent()
}