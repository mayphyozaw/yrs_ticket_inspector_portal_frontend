<template>
  <van-nav-bar
    title="Change Password"
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
          <img src="@/assets/image/change-password.png" alt="" class="w-5/12" />
        </div>
        <van-cell-group inset class="mb-3 mx-0">
          
          <van-field
            v-model="old_password"
            type="password"
            name="old_password"
            label="Old Password"
            placeholder="Enter your old_password"
            :error-message="errors.old_password"
          />
          <van-field
            v-model="new_password"
            type="password"
            name="new_password"
            label="New Password"
            placeholder="Enter your new_password"
            :error-message="errors.new_password"
          />
        </van-cell-group>
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
import { ref } from 'vue';
import {useRouter} from "vue-router";
import { useChangePasswordStore } from "@/stores/changePasswordStore";
import { showSuccessToast } from 'vant';

const router = useRouter();
const changePasswordStore = useChangePasswordStore();
const old_password = ref("");
const new_password = ref("");
const errors = ref({
  old_password: "",
  new_password: "",
});
const submitBtnloading = ref(false);

const onClickLeft = () => history.back();


const onSubmit = async (values) => {
  submitBtnloading.value = true;

  errors.value = {
    old_password: "",
    new_password: "",
  };

  await changePasswordStore.store(values.old_password, values.new_password);
  
  if (changePasswordStore.getErrorMessage) {
    if (changePasswordStore.getErrors) {
      errors.value = {
        
        old_password: changePasswordStore.getErrors.old_password
          ? changePasswordStore.getErrors.old_password.join(", ")
          : "",

        new_password: changePasswordStore.getErrors.new_password
          ? changePasswordStore.getErrors.new_password.join(", ")
          : "",
      };
    }
  }else{
      showSuccessToast(changePasswordStore.getResponse?.message);
      router.push("profile");
  }
  submitBtnloading.value = false;
};

</script>

<style scope>
  .van-field__label{
    width: 7em !important;
  }
</style>
