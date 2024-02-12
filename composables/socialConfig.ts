import { MsgType } from '~/interfaces/message.interface'
import { SocialType } from '~/interfaces/social.interface'
import profileSrc from '~/assets/images/profile.png'

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

export const generateToastClass = (type: string) => {
  switch (type) {
    case SocialType.LINE:
      return 'line-custom-toast-class'
    case SocialType.FACEBOOK:
      return 'fb-custom-toast-class'
    default:
      return 'ig-custom-toast-class'
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

export const generateToastIcon = (type: string) => {
  switch (type) {
    case SocialType.LINE:
      return 'fa-brands fa-line'
    case SocialType.FACEBOOK:
      return 'fa-brands fa-square-facebook'
    case SocialType.INSTAGRAM:
      return 'fa-brands fa-square-instagram'
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
  const isOwner = message?.isOwner
  const socialType = message?.source

  // Check if message, receiverDetail, and senderDetail exist before accessing properties
  const senderDetail = message?.senderDetail

  switch (socialType) {
    case SocialType.LINE:
      return senderDetail?.pictureUrl

    case SocialType.FACEBOOK:
      return senderDetail.picture.data.url

    case SocialType.INSTAGRAM:
      return isOwner
        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/768px-Instagram_logo_2022.svg.png'
        : profileSrc

    default:
      return ''
  }
}

export const generateAvatarUrl = (message: any) => {
  const isOwner = message.isOwner
  const socialType = message.source
  const pictureUrl = isOwner
    ? socialType === SocialType.LINE
      ? message.receiverDetail.pictureUrl
      : message.receiverDetail.picture.data.url
    : socialType === SocialType.LINE
    ? message.senderDetail.pictureUrl
    : message.senderDetail.picture.data.url

  return pictureUrl
}
