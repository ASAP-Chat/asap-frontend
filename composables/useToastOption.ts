import { TYPE } from 'vue-toastification'
import { ToastOptions } from 'vue-toastification/dist/types/types'

export const useToastOption: ToastOptions = {
  type: TYPE.SUCCESS,
  timeout: 2095,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
}
