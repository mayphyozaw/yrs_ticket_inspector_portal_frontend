<template>
  <van-nav-bar
    title="Two Step Verification"
    :fixed="true"
    left-text=""
    left-arrow
    @click-left="onClickLeft"
  />

  <div class="pt-[46px]"></div>

  <div class="p-3">
    <van-form @submit="onSubmit">
      <div class="bg-white rounded-lg">
        <div class="flex justify-center items-center py-3">
          <img
            src="@/assets/image/two-step-verification.png"
            alt=""
            class="w-5/12"
          />
        </div>
        <div class="mb-3">
          <p class="text-center text-gray-500 text-sm">
            Please enter the OTP in the field below to verify.
          </p>
        </div>

        <div class="pb-3">
          <van-password-input
            :value="code"
            :mask="false"
            :error-info="errors.code"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
          />
          <van-number-keyboard
            v-model="code"
            :show="showKeyboard"
            @blur="showKeyboard = false"
          />
        </div>

        <div class="text-center pb-3">
          <van-button
            type="default"
            plain
            size="small"
            :loading="resendOTPBtnloading"
            loading-text="Loading...."
            @click="onResendOTP"
          >
            Resend OTP
          </van-button>
        </div>
      </div>

      <div class="my-4">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          color="#1CBC9B"
          :loading="submitBtnloading"
        >
          Confirm
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTwoStepVerificationStore } from "@/stores/twoStepVerificationStore";
import { useResendOTPStore } from "@/stores/resendOTPStore";
import { showSuccessToast } from "vant";
import { showNotify } from "vant";

const router = useRouter();
const twoStepVerificationStore = useTwoStepVerificationStore();
const resendOTPStore = useResendOTPStore();
const otp_token = ref(ls.get("__otp-token"));
const code = ref("");

const errors = ref({
  otp_token: "",
  code: "",
});
const submitBtnloading = ref(false);
const resendOTPBtnloading = ref(false);

const showKeyboard = ref(true);

const onClickLeft = () => history.back();

const onSubmit = async (values) => {
  submitBtnloading.value = true;

  errors.value = {
    otp_token: "",
    code: "",
  };

  await twoStepVerificationStore.store(otp_token.value, code.value);

  if (twoStepVerificationStore.getErrorMessage) {
    if (twoStepVerificationStore.getErrors) {
      errors.value = {
        otp_token: twoStepVerificationStore.getErrors.otp_token
          ? twoStepVerificationStore.getErrors.otp_token.join(",")
          : "",

        code: twoStepVerificationStore.getErrors.code
          ? twoStepVerificationStore.getErrors.code.join(", ")
          : "",
      };
    }
  } else {
    ls.set(
      "__access-token",
      twoStepVerificationStore.getResponse?.data.access_token
    );
    ls.remove("__otp-token");
    showSuccessToast(twoStepVerificationStore.getResponse?.message);
    router.push("profile");
  }

  submitBtnloading.value = false;
};

const onResendOTP = async () => {
  resendOTPBtnloading.value = true;

  await resendOTPStore.store(otp_token.value);

  if (resendOTPStore.getErrorMessage == null) {
    ls.set("__otp-token", resendOTPStore.getResponse?.data.otp_token);
    showNotify({
      type: "success",
      message: resendOTPStore.getResponse?.message,
      position: "bottom",
    });
  }
  resendOTPBtnloading.value = false;

};
</script>

<style scoped></style>
