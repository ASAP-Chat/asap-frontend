import { Status } from '~/constants/Status'

export const generateStatus = (localStatus: string) => {
  switch (localStatus) {
    case Status.PENDING:
      return 'รอดำเนินการ'
    case Status.ONGOING:
      return 'ดำเนินการ'
    case Status.COMPLETED:
      return 'เสร็จสิ้น'
    default:
      return ''
  }
}
