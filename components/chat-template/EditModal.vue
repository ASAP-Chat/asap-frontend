<template>
  <v-dialog :width="470" persistent>
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

      <v-form
        v-model="isFormValid"
        class="px-6 pt-3 pb-3"
      >
        <div class="form-control">
          <p class="pb-2">ชื่อหัวข้อ</p>
          <CommonTextField
            :rules="[required]"
            v-model="localInfo.keyword"
            id="keyword"
            name="keyword"
            rounded="lg"
            density="compact"
            :error="dupKeyword"
            counter
            maxlength="50"
          />
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupKeyword"
          >
            Keyword นี้มีอยู่แล้ว
          </p>
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
            counter
            maxlength="500"
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
            <template v-slot:prepend>
              <v-icon color="red darken-4">mdi-trash-can-outline</v-icon>
            </template>
          </v-btn>
        </div>
        <div>
          <v-btn
            color="primary"
            class="font-weight-bold"
            flat
            rounded="lg"
            text="บันทึก"
            prepend-icon="mdi-content-save"
            :disabled="!isFormValid"
            @click="editChatTemplate"
          >
            <template v-slot:prepend>
              <v-icon color="white">mdi mdi-content-save</v-icon>
            </template>
          </v-btn>
        </div>
      </div>
    </v-card>
    <CommonConfirmModal
      v-model="confirmDelete"
      header="ลบรูปแบบคำตอบ"
      :content="`คุณยืนยันจะลบรูปแบบคำตอบ ${localInfo.keyword} ใช่หรือไม่?`"
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
const dupKeyword = ref(false)
const isFormValid = ref(false)

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
  dupKeyword.value = false
  localInfo.value = {
    _id: props.id,
    keyword: props.keyword,
    template: props.template,
  }
  emits('close-modal')
}

const editChatTemplate = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat-template/${props.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        keyword: localInfo.value.keyword,
        template: localInfo.value.template,
      }),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status === 200) {
      close()
      await getChatTemplate()
      toast.success('บันทึกสำเร็จ', useToastOption)
    } else if (response.status === 401) {
      dupKeyword.value = false
      await useRefreshToken()
      await editChatTemplate()
    }
    if (response.status === 500) {
      dupKeyword.value = true
    } else {
      console.log('err')
    }
  } catch (error) {
    console.log(error)
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
      toast.success('ลบรูปแบบคำตอบสำเร็จ', useToastOption)
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

watch(
  () => localInfo.value.keyword,
  (newValue) => {
    dupKeyword.value = false
  }
)
</script>
