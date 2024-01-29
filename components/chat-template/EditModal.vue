<template>
  <v-dialog :width="470">
    <v-card>
      <v-toolbar
        color="white"
        class="px-4 pt-4"
      >
        <v-toolbar-title class="font-weight-bold">แก้ไขรูปแบบคำตอบ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            @click="close()"
            variant="text"
          >
            <v-icon
              icon="mdi-close"
              color="secondary-lighten"
            ></v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form class="px-6 pt-3 pb-3">
        <div class="form-control">
          <p class="pb-2">ชื่อหัวข้อ</p>
          <CommonTextField
            :rules="[required]"
            v-model="localInfo.keyword"
            id="keyword"
            name="keyword"
            rounded="lg"
            density="compact"
          />
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">ข้อความตัวอักษร</p>
          <v-textarea
            id="template"
            name="template"
            :rules="[required]"
            v-model="localInfo.template"
            density="compact"
            variant="outlined"
            rounded="lg"
            color="primary"
            auto-grow
            rows="1"
          ></v-textarea>
        </div>
      </v-form>
      <div class="tw-flex tw-justify-between pb-6 px-6">
        <div>
          <v-btn
            color="error"
            class="font-weight-bold"
            variant="outlined"
            rounded="lg"
            text="ลบ"
            @click="confirmDelete = true"
          >
          </v-btn>
        </div>
        <div>
          <v-btn
            color="primary"
            class="font-weight-bold"
            flat
            rounded="lg"
            text="บันทึก"
            @click="editChatTemplate"
          >
          </v-btn>
        </div>
      </div>
    </v-card>
    <CommonConfirmModal
      v-model="confirmDelete"
      header="ลบรูปแบบคำตอบ"
      content="คุณยืนยันจะลบรูปแบบคำตอบนี้ใช่หรือไม่?"
      cancelWording="ยกเลิก"
      confirmWording="ยืนยัน"
      :isSuccess="false"
      @btn-action="confirmDelete = false"
      @confirm-action="deleteChatTemplate()"
    />
  </v-dialog>
</template>
<script setup lang="ts">
import { ACCESS_TOKEN } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getChatTemplate } from '~/services/message.service'

const toast = useToast()
const confirmDelete = ref(false)

const props = defineProps<{
  id: string
  keyword: string
  template: string
}>()
const localInfo = ref<any>({
  _id: props.id,
  keyword: props.keyword,
  template: props.template,
})
const { required } = useFormRules()
const access_token = useCookie(ACCESS_TOKEN)

const emits = defineEmits(['close-modal'])
const close = () => {
  emits('close-modal')
}

const editChatTemplate = async () => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/chat-template/${props.id}`, {
      method: 'patch',
      body: JSON.stringify({
        keyword: localInfo.value.keyword,
        template: localInfo.value.template,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      close()
      await getChatTemplate()
      toast.success('บันทึกสำเร็จ', {
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
      })
    } else {
      await useRefreshToken()
      await editChatTemplate()
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteChatTemplate = async () => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/chat-template/${props.id}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status.value === 'success') {
      close()
      confirmDelete.value = false
      toast.success('ลบรูปแบบคำตอบสำเร็จ', {
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
      })
      await getChatTemplate()
    } else {
      await useRefreshToken()
      await deleteChatTemplate()
    }
  } catch (error: any) {
    console.log(error)
  }
}

watch(
  () => props.id,
  (newValue) => {
    localInfo.value._id = newValue
  }
)
watch(
  () => props.keyword,
  (newValue) => {
    localInfo.value.keyword = newValue
  }
)
watch(
  () => props.template,
  (newValue) => {
    localInfo.value.template = newValue
  }
)
</script>
