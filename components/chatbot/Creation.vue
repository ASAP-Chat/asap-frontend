<template>
  <v-dialog
    :width="440"
    persistent
  >
    <v-card class="tw-rounded-xl">
      <div class="tw-flex tw-justify-between tw-items-center px-6 pt-8 pb-4">
        <p class="font-weight-bold tw-text-xl">เพิ่มรูปแบบการตอบกลับของแชตบอท</p>
        <v-btn
          @click="close()"
          variant="text"
        >
          <v-icon
            icon="mdi-close"
            color="secondary-lighten"
          ></v-icon>
        </v-btn>
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
              >
                <template v-slot:append>
                  <v-btn
                    v-if="chatbotInfo.keyword.length > 1"
                    :class="
                      chatbotInfo.keyword.length !== 3 && index === chatbotInfo.keyword.length - 1
                        ? 'mr-3'
                        : ''
                    "
                    icon
                    flat
                    @click="removeTextarea(index)"
                    density="comfortable"
                    size="small"
                  >
                    <v-icon color="primary">mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="
                      chatbotInfo.keyword.length < 3 && index === chatbotInfo.keyword.length - 1
                    "
                    flat
                    icon
                    density="comfortable"
                    :variant="keyword === '' ? 'outlined' : 'tonal'"
                    color="primary"
                    size="small"
                    @click="addTextarea"
                    :disabled="keyword === ''"
                  >
                    <v-icon color="primary">mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-textarea>
            </div>
          </div>
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupKeyword"
          >
            Keyword นี้มีอยู่แล้ว
          </p>
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">ข้อความตอบกลับ</p>
          <v-textarea
            id="template"
            name="template"
            :rules="[required]"
            v-model="chatbotInfo.replyMessage"
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
      <div class="tw-flex tw-justify-end pb-6 px-6">
        <v-btn
          color="primary"
          class="font-weight-bold"
          flat
          rounded="lg"
          text="บันทึก"
          @click="createChatbotMsg(chatbotInfo)"
          :disabled="disabledButton"
        >
        </v-btn>
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
  // dupKeyword.value = false
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
      dupKeyword.value = true
    } else {
      console.log('err')
    }
  } catch (error) {
    console.error(error)
  }
}
watch(
  () => chatbotInfo.value.keyword,
  (newValue) => {
    dupKeyword.value = false
  }
)
</script>
