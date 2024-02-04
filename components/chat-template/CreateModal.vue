<template>
  <v-dialog :width="440">
    <v-card class="tw-rounded-xl">
      <v-toolbar
        color="white"
        class="px-4 pt-4"
      >
        <v-toolbar-title class="font-weight-bold">เพิ่มรูปแบบคำตอบ</v-toolbar-title>
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
            v-model="templateInfo.keyword"
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
            v-model="templateInfo.template"
            density="compact"
            variant="outlined"
            rounded="lg"
            color="primary"
            auto-grow
            rows="1"
          ></v-textarea>
        </div>
      </v-form>
      <div class="tw-flex tw-justify-end pb-6 px-6">
        <v-btn
          color="primary"
          class="font-weight-bold"
          flat
          rounded="lg"
          text="บันทึก"
          @click="createChatTemplate(templateInfo)"
          :disabled="!isFormValid"
        >
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
// @ts-nocheck

import { type ChatTemplateInfo } from '~/interfaces/social.interface'
import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getChatTemplate } from '~/services/message.service'

const toast = useToast()
const { required } = useFormRules()
const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)

const { shop } = user.value && user.value
const { name } = shop

const templateInfo = ref<ChatTemplateInfo>({
  keyword: '',
  template: '',
})
const emits = defineEmits(['close-modal'])
const close = () => {
  emits('close-modal')
  templateInfo.value.keyword = ''
  templateInfo.value.template = ''
}
const isFormValid = ref(false)

const createChatTemplate = async (templateInfo: ChatTemplateInfo) => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/chat-template`, {
      method: 'post',
      body: JSON.stringify({
        keyword: templateInfo.keyword,
        template: templateInfo.template,
        shopName: name,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      close()
      toast.success('บันทึกสำเร็จ', useToastOption)
      await getChatTemplate()
    } else {
      await useRefreshToken()
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
