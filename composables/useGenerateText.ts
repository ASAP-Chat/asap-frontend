import { Role } from '~/constants/Role'
import { MsgType } from '~/constants/MessageType'

export const generateRole = (role: any) => {
  switch (role) {
    case Role.AGENT:
      return 'เอเจนต์'
    case Role.MANAGER:
      return 'ผู้จัดการ'
    case Role.OWNER:
      return 'เจ้าของธุรกิจ'
    default:
      return role
  }
}

export const generateMessageSubtitle = (message: any) => {
  switch (message.type) {
    case MsgType.STICKER:
      return `${generateName(message)} ส่งสติกเกอร์`
    case MsgType.IMAGE:
      return `${generateName(message)} ส่งรูปภาพ`
    case MsgType.VIDEO:
      return `${generateName(message)} ส่งวิดิโอ`
    case MsgType.AUDIO:
      return `${generateName(message)} ส่งข้อความเสียง`
    default:
      return message.message
  }
}
