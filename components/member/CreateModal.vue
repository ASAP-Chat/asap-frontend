<template>
  <v-dialog :width="440">
    <v-card class="tw-rounded-xl">
      <v-toolbar
        color="white"
        class="px-4 pt-4"
      >
        <v-toolbar-title class="font-weight-bold">เพิ่มสมาชิกใหม่</v-toolbar-title>
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
          <p class="pb-2">อีเมล</p>
          <CommonTextField
            :rules="[required, checkEmail]"
            v-model="memberData.email"
            id="keyword"
            name="keyword"
            rounded="lg"
            density="compact"
          />
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">เลือกบทบาท</p>
          <v-radio-group v-model="memberData.role">
            <v-radio
              v-for="biz in businesses"
              :value="biz.value"
            >
              <template v-slot:label>
                <div>
                  {{ biz.label }} <br /><span class="tw-text-xs">{{ biz.description }}</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
      </v-form>
      <div class="tw-flex tw-justify-end pb-6 px-6">
        <v-btn
          color="primary"
          class="font-weight-bold"
          flat
          rounded="lg"
          text="บันทึก"
          :disabled="!isFormValid"
          @click="createMember(memberData)"
        >
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
// @ts-nocheck

import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getMember } from '~/services/member.service'
import { MemberInfo } from '~/interfaces/social.interface'

const { checkEmail, required } = useFormRules()
const toast = useToast()
const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)

const { shop } = user.value && user.value

const businesses = [
  {
    label: 'เจ้าของธุรกิจ',
    value: 'owner',
    description: 'เหมาะสำหรับเจ้าของธุรกิจหรือผู้ที่ได้รับมอบหมายให้จัดการระบบเสมือนเจ้าของ',
  },
  {
    label: 'ผู้จัดการ',
    value: 'manager',
    description:
      'เหมาะสำหรับหัวหน้าทีมดูแลลูกค้าที่ต้องกำกับทีมงาน และเอเจนต์ และจัดการระบบได้บางส่วน',
  },
  {
    label: 'เอเจนต์',
    value: 'agent',
    description: 'เหมาะสำหรับผู้ที่มีหน้าที่ดูแลเฉพาะลูกค้าที่ได้รับมอบหมายเท่านั้น',
  },
]
const memberData = ref<MemberInfo>({
  email: '',
  role: '',
  shop: shop,
})
const emits = defineEmits(['close-modal'])
const close = () => {
  emits('close-modal')
  memberData.value.email = ''
  memberData.value.role = ''
}
const isFormValid = ref(false)

const createMember = async (memberData: MemberInfo) => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/team-member`, {
      method: 'post',
      body: JSON.stringify({
        email: memberData.email,
        role: memberData.role,
        shop: shop,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      close()
      toast.success('เพิ่มสมาชิกสำเร็จ', useToastOption)
      await getMember()
    } else {
      await useRefreshToken()
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
