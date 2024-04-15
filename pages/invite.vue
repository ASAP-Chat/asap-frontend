<template>
  <CommonModal
    v-if="showModal"
    :header="isSuccessRegister ? 'ลงทะเบียนสำเร็จ!' : 'ลิ้งค์คำเชิญนี้ได้ถูกใช้งานไปแล้ว!'"
    :content="
      isSuccessRegister
        ? 'ลงทะเบียนเป็นสมาชิกทีมเสร็จสิ้น สามารถเข้าสู่ระบบด้วยอีเมล'
        : 'ลิ้งค์คำเชิญนี้ได้ถูกใช้งานไปแล้ว, โปรดเข้าสู่ระบบ'
    "
    :buttonText="isSuccessRegister ? 'เข้าสู่ระบบ' : 'เข้าสู่ระบบ'"
    :isSuccess="isSuccessRegister"
    to="/login/"
  />
  <div class="tw-hero tw-min-h-screen lg:tw-bg-base-200">
    <div
      class="tw-card tw-flex-shrink-0 sm:tw-max-w-xl tw-max-w-sm lg:tw-shadow-2xl tw-bg-base-100 mt-4 mb-4"
      style="width: 1500px"
    >
      <div class="tw-card-body">
        <div class="text-center">
          <v-img
            :width="150"
            aspect-ratio="1/1"
            :src="imageSrc"
            class="mx-auto"
          ></v-img>
          <p class="tw-mb-5">ระบบจัดการแชตลูกค้า<br />สำหรับร้านค้าใน Social Media</p>
          <h5 class="tw-text-3xl font-weight-bold tw-mb-4">คุณได้รับเชิญเข้าร่วมธุรกิจใน ASAP</h5>
        </div>
        <div>
          <v-form v-model="isFormValid">
            <div class="form-control tw-mt-2">
              <CommonTextField
                label="อีเมล"
                disabled
                v-model="memberInfo.email"
              />
            </div>

            <div class="form-control tw-mt-2">
              <CommonTextField
                label="ชื่อผู้ใช้"
                :rules="[required]"
                v-model="memberInfo.displayName"
                :error="dupName"
              />
              <p
                class="mb-3 text-error tw-text-sm mt-n3"
                v-if="dupName"
              >
                ขื่อผู้ใช้นี้มีในระบบแล้ว
              </p>
            </div>
            <div class="form-control tw-mt-2">
              <CommonTextField
                :rules="[required, passwordLengthMin, passwordLengthMax]"
                v-model="memberInfo.password"
                id="password"
                name="password"
                label="รหัสผ่าน"
                @click:append-inner="visible = !visible"
                :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible ? 'text' : 'password'"
                counter
              />
            </div>
            <div class="form-control tw-mt-2">
              <CommonTextField
                id="confirm-password"
                v-model="memberInfo.confirmPassword"
                :rules="[
                  required,
                  confirmPassword(memberInfo.confirmPassword, memberInfo.password),
                ]"
                name="confirm-password"
                label="ยืนยันรหัสผ่าน"
                @click:append-inner="confirmVisible = !confirmVisible"
                :append-inner-icon="confirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="confirmVisible ? 'text' : 'password'"
              />
            </div>
          </v-form>
        </div>
        <div class="form-control tw-my-2">
          <CommonButton
            text="สร้างบัญชีผู้ใช้งาน"
            block
            size="large"
            color="primary"
            :loading="loading"
            :disabled="!isFormValid"
            @click="registerMember()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import imageSrc from '~/assets/images/logo.png'

useHead({
  title: 'Welcome to ASAP',
})

definePageMeta({
  layout: false,
})
const { required, passwordLengthMin, passwordLengthMax, confirmPassword } = useFormRules()
const route = useRoute()
const inviteId = route.query.invite_id
const memberById: any = ref()
const isFormValid = ref(false)
const dupName = ref(false)

const showModal = ref(false)
const isSuccessRegister = ref()
const loading = ref(false)

const memberInfo = ref({
  email: '',
  displayName: '',
  password: '',
  confirmPassword: '',
})

const getMemberById = async () => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/invite-member/${inviteId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status.value === 'success') {
      memberById.value = await response.data.value
      memberInfo.value.email = memberById.value.email
    } else {
      isSuccessRegister.value = false
      showModal.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const registerMember = async () => {
  loading.value = true
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/invite-member/${inviteId}`, {
      method: 'patch',
      body: JSON.stringify({
        displayName: memberInfo.value.displayName,
        password: memberInfo.value.confirmPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status.value === 'success') {
      memberById.value = await response.data.value
      memberInfo.value.email = memberById.value.email
      loading.value = false
      isSuccessRegister.value = true
      showModal.value = true
    } else {
      loading.value = false
      dupName.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const visible = ref(false)
const confirmVisible = ref(false)

onBeforeMount(async () => {
  await getMemberById()
})

watch(
  () => memberInfo.value.displayName,
  (newValue) => {
    dupName.value = false
  }
)
</script>
