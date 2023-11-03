import { SocialLinks } from './index.interface'

export default interface UserSignUp {
  displayName: string
  email: string
  password: string
  confirmPassword: string
  isOwner?: boolean
  shop?: ShopInfo
}

interface ShopInfo {
  name: string
  category: string
  detail?: string
  social: SocialLinks
}
