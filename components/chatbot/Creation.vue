<template>
  <v-dialog
    :width="440"
    persistent
  >
    <v-card class="tw-rounded-xl">
      <div class="tw-flex tw-justify-between tw-items-center px-6 pt-8 pb-4">
        <p class="font-weight-bold tw-text-xl">เพิ่มรูปแบบการตอบกลับของแชตบอท</p>
        <common-icon-button
          icon="mdi-close"
          size="small"
          color="secondary-lighten"
          @click="close()"
        />
      </div>
      <v-form
        v-model="isFormValid"
        class="px-6 pt-3 pb-3"
      >
        <div class="form-control">
          <p class="pb-2">คีย์เวิร์ด</p>
          <div>
            <div
              v-for="(keyword, index) in chatbotInfo.keyword"
              :key="index"
            >
              <v-textarea
                v-model="chatbotInfo.keyword[index]"
                density="compact"
                variant="outlined"
                rounded="lg"
                color="primary"
                auto-grow
                rows="1"
                counter
                maxlength="50"
                :rules="[required]"
                :error="dupKeyword"
              >
                <template v-slot:append>
                  <common-icon-button
                    v-if="chatbotInfo.keyword.length > 1"
                    :class="
                      chatbotInfo.keyword.length !== 3 && index === chatbotInfo.keyword.length - 1
                        ? 'mr-3'
                        : ''
                    "
                    icon="mdi-close"
                    color="primary"
                    density="comfortable"
                    size="small"
                    @click="removeTextarea(index)"
                  />
                  <common-icon-button
                    v-if="
                      chatbotInfo.keyword.length < 3 && index === chatbotInfo.keyword.length - 1
                    "
                    icon="mdi-plus"
                    :variant="keyword === '' ? 'outlined' : 'tonal'"
                    color="primary"
                    density="comfortable"
                    size="small"
                    @click="addTextarea"
                    :disabled="keyword === ''"
                  />
                </template>
              </v-textarea>
            </div>
          </div>
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupKeyword"
          >
            Keyword นี้มีอยู่แล้ว : {{ dupWording }}
          </p>
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">ข้อความตอบกลับ</p>
          <CommonTextArea
            id="template"
            name="template"
            :rules="[required]"
            v-model="chatbotInfo.replyMessage"
            counter
            maxlength="500"
          />
        </div>
      </v-form>
      <div class="tw-flex tw-justify-end pb-6 px-6">
        <common-button
          text="บันทึก"
          color="primary"
          @click="createChatbotMsg(chatbotInfo)"
          :disabled="disabledButton"
        />
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { type ChatbotInfo } from '~/interfaces/social.interface'
import { ACCESS_TOKEN } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getChatbotMsg } from '~/services/chatbot.service'

const props = defineProps<{
  page: number
}>()

const toast = useToast()
const { required } = useFormRules()
const access_token = useCookie(ACCESS_TOKEN)
const dupKeyword = ref(false)
const dupWording = ref('')

const chatbotInfo = ref<ChatbotInfo>({
  keyword: [''],
  replyMessage: '',
})

const addTextarea = () => {
  chatbotInfo.value.keyword.push('')
}

const removeTextarea = (index: any) => {
  chatbotInfo.value.keyword.splice(index, 1)
}

const disabledButton = computed(() => {
  return (
    !chatbotInfo.value.replyMessage ||
    chatbotInfo.value.keyword[chatbotInfo.value.keyword.length - 1] === ''
  )
})

const emits = defineEmits(['close'])
const close = () => {
  emits('close')
  chatbotInfo.value.keyword = ['']
  chatbotInfo.value.replyMessage = ''
}
const isFormValid = ref(false)
const createChatbotMsg = async (chatbotInfo: ChatbotInfo) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chatbot-message`, {
      method: 'post',
      body: JSON.stringify({
        keyword: chatbotInfo.keyword,
        replyMessage: chatbotInfo.replyMessage,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status === 200 || response.status === 201) {
      close()
      toast.success('บันทึกสำเร็จ', useToastOption)
      await getChatbotMsg(props.page)
    } else if (response.status === 401) {
      dupKeyword.value = false
      await useRefreshToken()
      await createChatbotMsg(chatbotInfo)
    }
    if (response.status === 500) {
      const dup = await response.json()
      dupKeyword.value = true
      dupWording.value = dup.data.keyValue.keyword
    } else {
      console.log('err')
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => chatbotInfo.value.keyword.map((item) => item),
  (newValue) => {
    dupKeyword.value = false
  }
)
</script>
