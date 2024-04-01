<template>
  <CommonModal
    v-if="showModal"
    :header="isSuccessCreate ? 'คุณเชื่อมต่อ Line สำเร็จ!' : 'คุณเชื่อมต่อ Line ไม่สำเร็จ!'"
    :content="
      isSuccessCreate ? 'การเชื่อมต่อเรียบร้อยแล้ว' : 'ขออภัย, กรุณาตรวจสอบข้อมูลและลองอีกครั้ง'
    "
    :buttonText="isSuccessCreate ? 'ปิด' : 'ลองอีกครั้ง'"
    :isSuccess="isSuccessCreate"
    @btn-action="closeModal"
  />
  <v-card>
    <template v-slot:title>
      <div class="font-weight-bold">เชื่อมต่อ LINE OA</div>
    </template>
    <template v-slot:append>
      <v-btn
        @click="back"
        variant="text"
      >
        <v-icon
          icon="mdi-close"
          color="secondary-lighten"
        ></v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <ul class="ms-6 tw-text-sm">
        <li>คุณต้องมีสิทธิ์เป็นผู้ดูแลระบบบน LINE OA เพื่อทำการเชื่อมต่อ</li>
        <li>เฉพาะข้อความใหม่เท่านั้นที่จะปรากฏหลังจากเชื่อมต่อ</li>
        <li>ข้อความที่ส่งจากแพลตฟอร์ม LINE จะไม่ปรากฏใน ASAP</li>
      </ul>
      <br />
      <p>วิธีการเชื่อมต่อ</p>
      <ol class="ms-6 tw-text-sm">
        <li>
          เปิด
          <a
            href="https://manager.line.biz/"
            target="_blank"
            >manager.line.biz
          </a>
          และ
          <a
            href="https://developers.line.biz/en/"
            target="_blank"
            >developers.line.biz</a
          >
          และเลือกบัญชี LINE OA
        </li>
        <li>
          ไปที่ Messaging API เพื่อคัดลอก Channel Secret และ Channel Access Token (long-lived)
        </li>
      </ol>
      <p class="tw-mt-2 tw-text-sm">
        <v-icon>mdi-tooltip-question-outline</v-icon>&nbsp;<a
          href="https://drive.google.com/file/d/1dGJFoqmX2_OX_TfobtdsJuJk5H5dwmiG/view?usp=sharing"
          target="_blank"
          >ดูขั้นตอนแบบละเอียด</a
        >
      </p>
      <p></p>
      <v-form
        class="mt-4"
        v-model="isFormValid"
      >
        <div>
          <common-text-field
            label="Channel Secret"
            :rules="[required]"
            v-model="lineInfo.socialData.channelSecret"
          />
          <CommonTextArea
            label="Channel Access Token (long-lived)"
            :rules="[required]"
            v-model="lineInfo.socialData.channelAccessToken"
            class="mt-2"
            rounded="md"
            hide-details
          />
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions class="tw-justify-end px-4 pb-4">
      <v-btn
        color="primary"
        variant="flat"
        :disabled="isButtonDisabled"
        :loading="loading"
        @click="createLine(lineInfo)"
      >
        เชื่อมต่อ
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { type CreateLineInfo } from '~/interfaces/social.interface'
import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { getSocialAccount } from '~/services/message.service'
import { SocialType } from '~/constants/SocialType'

const emits = defineEmits(['back', 'created-success'])
const { required } = useFormRules()
const loading = ref(false)

const back = () => {
  emits('back')
}

const isFormValid = ref(false)

const isButtonDisabled = computed(() => {
  return !isFormValid.value
})

const lineInfo = ref<CreateLineInfo>({
  shopName: '',
  socialData: {
    channelSecret: '',
    channelAccessToken: '',
  },
  socialType: SocialType.LINE,
  ownerId: '',
})

const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)

const { shop, _id } = user.value && user.value
const { name } = shop

const showModal = ref(false)
const isSuccessCreate = ref()

const createLine = async (lineInfo: CreateLineInfo) => {
  loading.value = true
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/social-account`, {
      method: 'post',
      body: JSON.stringify({
        shopName: name,
        socialData: {
          channelSecret: lineInfo.socialData.channelSecret,
          channelAccessToken: lineInfo.socialData.channelAccessToken,
        },
        socialType: SocialType.LINE,
        ownerId: _id,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      isSuccessCreate.value = true
      showModal.value = true
      loading.value = false
      getSocialAccount()
    } else {
      loading.value = false
      isSuccessCreate.value = false
      showModal.value = true
      await useRefreshToken()
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  showModal.value = false
  isSuccessCreate.value === true ? emits('created-success') : null
}
</script>
