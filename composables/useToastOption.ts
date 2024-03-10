import { ToastOptions } from 'vue-toastification/dist/types/types'
import { TYPE, POSITION } from 'vue-toastification'

export const useToastOption: ToastOptions & { type?: TYPE.SUCCESS } = {
  type: TYPE.SUCCESS, // Ensure type is explicitly set to TYPE.SUCCESS
  position: POSITION.TOP_RIGHT,
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
