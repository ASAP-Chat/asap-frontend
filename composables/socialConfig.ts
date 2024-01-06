import { MsgType } from '~/interfaces/message.interface'
import { SocialType } from '~/interfaces/social.interface'

export const generateSocialColor = (type: string) => {
  switch (type) {
    case SocialType.LINE:
      return '#02c153'
    case SocialType.FACEBOOK:
      return '#0765FF'
    default:
      return ''
  }
}

export const generateSocialIcon = (type: string) => {
  switch (type) {
    case SocialType.LINE:
      return 'fa:fa-brands fa-line'
    case SocialType.FACEBOOK:
      return 'fa:fa-brands fa-square-facebook'
    case SocialType.INSTAGRAM:
      return 'mdi-instagram'
    default:
      return ''
  }
}

export const generateName = (message: any) => {
  const isOwner = message.isOwner
  const socialType = message.source

  const detailName = isOwner ? message.receiverDetail.name : message.senderDetail.name

  switch (socialType) {
    case SocialType.LINE:
      return isOwner ? message.receiverDetail.displayName : message.senderDetail.displayName

    case SocialType.FACEBOOK:
    case SocialType.INSTAGRAM:
      return detailName

    default:
      return ''
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

export const generateCustomerImg = (message: any) => {
  const isOwner = message.isOwner
  const socialType = message.source
  const detailName = isOwner
    ? message.receiverDetail.picture.data.url
    : message.senderDetail.picture.data.url

  switch (socialType) {
    case SocialType.LINE:
      return isOwner ? message.receiverDetail.pictureUrl : message.senderDetail.pictureUrl

    case SocialType.FACEBOOK:
    case SocialType.INSTAGRAM:
      return detailName

    default:
      return ''
  }
}
