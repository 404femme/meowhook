import { handleVoiceCreate } from './autovoice/create'
import { deleteEmpty } from './autovoice/deleteEmptyVoice'

export function featureRoomHandler() {
    handleVoiceCreate()
    deleteEmpty()

}
