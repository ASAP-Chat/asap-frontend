<template>
  <div class="tw-hero tw-min-h-screen lg:tw-bg-base-200 xs:tw-bg-white">
    <div
      class="tw-card tw-flex-shrink-0 sm:tw-max-w-xl tw-max-w-sm lg:tw-shadow-2xl tw-bg-base-100"
      style="width: 1500px"
    >
      <div class="tw-card-body">
        <div class="text-center">
          <v-img
            :width="150"
            aspect-ratio="1/1"
            :src="imageSrc"
            class="tw-mx-auto"
          />
          <p class="tw-mb-5 mt-2">ระบบจัดการแชตลูกค้า<br />สำหรับร้านค้าใน Social Media</p>
          <h5 class="tw-text-3xl font-weight-bold tw-mb-4">เข้าสู่ระบบ ASAP</h5>
        </div>
        <v-form
          v-model="isFormValid"
          @submit.prevent="login(userInfo)"
        >
          <div class="form-control">
            <CommonTextField
              :rules="[required, checkEmail]"
              v-model="userInfo.email"
              id="email"
              name="email"
              type="email"
              label="อีเมล"
            />
          </div>
          <div class="form-control tw-mt-2">
            <CommonTextField
              :rules="[required]"
              v-model="userInfo.password"
              id="password"
              name="password"
              label="รหัสผ่าน"
              @click:append-inner="visible = !visible"
              :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
            />
            <p
              class="mb-4 text-error tw-text-sm"
              v-if="loginError"
            >
              อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง
            </p>
          </div>
          <div class="form-control tw-my-2">
            <v-btn
              block
              size="large"
              color="primary"
              rounded="lg"
              type="submit"
              class="font-weight-bold"
              :disabled="!isFormValid"
              :loading="loading"
            >
              เข้าสู่ระบบ
            </v-btn>
          </div>
        </v-form>
        <p class="tw-text-[#6F7580]">
          ยังไม่เคยมีบัญชี?
          <NuxtLink to="/signup">
            <a class="text-primary text-decoration-underline"> ลงทะเบียนที่นี่</a>
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserLogin } from '~/interfaces/auth.interface'
import imageSrc from '~/assets/images/logo.png'

const router = useRouter()

useHead({
  title: 'Welcome to ASAP',
})

definePageMeta({
  layout: false,
})

const isFormValid = ref(false)
const visible = ref(false)
const loading = ref(false)
const loginError = ref(false)

const userInfo = ref<UserLogin>({
  strategy: 'local',
  email: '',
  password: '',
})

const login = async (user: UserLogin) => {
  try {
    loading.value = true
    if (process.client) {
      const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: 'post',
        body: JSON.stringify({
          email: user.email.trim(),
          password: user.password,
          strategy: user.strategy,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status.value === 'success') {
        loading.value = false
        loginError.value = false

        const responseData: any = response.data.value

        const userData = {
          _id: responseData.user._id,
          email: responseData.user.email,
          displayName: responseData.user.displayName,
          isOwner: responseData.user.isOwner,
          shop: responseData.user.shop,
        }
        localStorage.setItem('accessToken', responseData.accessToken)
        localStorage.setItem('refreshToken', responseData.refreshToken)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/chat')
      } else {
        loading.value = false
        loginError.value = true
        console.log(`Request failed with status: ${response.error.value}`)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const { checkEmail, required } = useFormRules()
</script>
