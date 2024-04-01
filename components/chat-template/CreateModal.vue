<template>
  <v-dialog
    :width="440"
    persistent
  >
    <v-card class="tw-rounded-xl">
      <v-toolbar
        color="white"
        class="px-4 pt-4"
      >
        <v-toolbar-title class="font-weight-bold">เพิ่มรูปแบบคำตอบ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <common-icon-button
            icon="mdi-close"
            size="small"
            color="secondary-lighten"
            @click="close()"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-form
        v-model="isFormValid"
        class="px-6 pt-3 pb-3"
      >
        <div class="form-control">
          <p class="pb-2">ชื่อหัวข้อ</p>
          <common-text-area
            id="keyword"
            name="keyword"
            :rules="[required]"
            v-model="templateInfo.keyword"
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
          <common-text-area
            id="template"
            name="template"
            :rules="[required]"
            v-model="templateInfo.template"
            counter
            maxlength="500"
          />
        </div>
      </v-form>
      <div class="tw-flex tw-justify-end pb-6 px-6">
        <common-button
          text="บันทึก"
          color="primary"
          @click="createChatTemplate(templateInfo)"
          :disabled="!isFormValid"
        />
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { type ChatTemplateInfo } from '~/interfaces/social.interface'
import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getChatTemplate } from '~/services/template.service'

const props = defineProps<{
  page: number
}>()

const toast = useToast()
const { required } = useFormRules()
const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)
const dupKeyword = ref(false)

const { shop } = user.value || {}
const { name } = shop

const templateInfo = ref<ChatTemplateInfo>({
  keyword: '',
  template: '',
})
const emits = defineEmits(['close-modal'])
const close = () => {
  emits('close-modal')
  dupKeyword.value = false
  templateInfo.value.keyword = ''
  templateInfo.value.template = ''
}
const isFormValid = ref(false)

const createChatTemplate = async (templateInfo: ChatTemplateInfo) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat-template`, {
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
    if (response.status === 200 || response.status === 201) {
      close()
      toast.success('บันทึกสำเร็จ', useToastOption)
      await getChatTemplate(props.page)
    } else if (response.status === 401) {
      dupKeyword.value = false
      await useRefreshToken()
      await createChatTemplate(templateInfo)
    }
    if (response.status === 500) {
      dupKeyword.value = true
    } else {
      console.log('err')
    }
  } catch (error) {
    console.error(error)
  }
}
watch(
  () => templateInfo.value.keyword,
  (newValue) => {
    dupKeyword.value = false
  }
)
</script>
