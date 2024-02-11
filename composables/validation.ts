export const useFormRules = () => {
  return {
    required: (value: string) => !!value || 'โปรดระบุ',

    checkEmail: (value: string) => {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง'
    },
    englishNumberSpecial: (value: string) => {
      const regex = /^[a-zA-Z0-9\s~`!@#$%^&*()_+=[\]{}|;:'",.<>/?-]+$/
      return regex.test(value) || 'รหัสผ่านต้องเป็นภาษาอังกฤษ ตัวเลข หรือตัวอักษรพิเศษเท่านั้น'
    },
    passwordLengthMin: (value: string) =>
      (!!value && value.length >= 8) || 'รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร',
    passwordLengthMax: (value: string) =>
      (!!value && value.length <= 32) || 'รหัสผ่านควรมีความยาวไม่เกิน 32 ตัวอักษร',
    confirmPassword: (value?: string, password?: string) => {
      return value === password || 'รหัสผ่านไม่ตรงกัน โปรดลองอีกครั้ง'
    },
    facebookLink: (value: string) => {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/
      return regex.test(value) || 'ลิงค์ไม่ถูกต้อง'
    },
    instagramLink: (value: string) => {
      const regex =
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
      return regex.test(value) || 'ลิงค์ไม่ถูกต้อง'
    },
  }
}
