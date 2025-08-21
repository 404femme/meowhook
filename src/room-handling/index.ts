import { handleVoiceCreate } from './autovoice/create'
import { deleteEmpty } from './autovoice/deleteEmpty'

export function featureRoomHandler() {
    handleVoiceCreate()
    deleteEmpty()

}
