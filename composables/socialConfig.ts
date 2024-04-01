import profileSrc from '~/assets/images/profile.png'
import fbSrc from '~/assets/images/facebook-page.png'
import { SocialType } from '~/constants/SocialType'

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

export const generateCustomerImg = (message: any) => {
  const isOwner = message?.isOwner
  const socialType = message?.source

  // Check if message, receiverDetail, and senderDetail exist before accessing properties
  const senderDetail = message?.senderDetail

  switch (socialType) {
    case SocialType.LINE:
      return isOwner ? senderDetail?.pictureUrl : senderDetail.pictureUrl

    case SocialType.FACEBOOK:
      return isOwner ? fbSrc : profileSrc

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
      : profileSrc
    : socialType === SocialType.LINE
    ? message.senderDetail.pictureUrl
    : profileSrc

  return pictureUrl
}
