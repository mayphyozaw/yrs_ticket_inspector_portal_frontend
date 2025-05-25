<template>
  <div>
    <van-search
      v-model="search"
      show-action
      label=""
      placeholder="Search for location"
    >
      <template #action>
        <van-button
          type="primary"
          size="small"
          class="mb-1"
          color="#1CBC9B"
          @click="onSearch"
          >Search</van-button
        >
      </template>
    </van-search>

    <van-pull-refresh
      v-model="refreshing"
      pulling-text="Pull to refresh"
      loosing-text="Pull to refresh"
      loading-text="Loading"
      success-text="Successfully loaded"
      @refresh="onRefresh"
    >
      <div class="p-3">
        <van-list
          v-model:loading="loading"
          v-model:error="error"
          :finished="finished"
          loading-text="Loading"
          finished-text=""
          :error-text="errorMessage"
          @load="onLoad"
        >
          <StationItem v-if="storeName == 'stationStore'" :list="list" />
          <RouteItem v-if="storeName == 'routeStore'" :list="list" :query-parameters="props.queryParameters"/>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usestoreHelper } from "@/helplers/useStoreHelper";
import StationItem from "./StationItem.vue";
import RouteItem from "./RouteItem.vue";

const props = defineProps({
  storeName: { type: String, required: true },
  queryParameters:{type: Object, required:true},
});

const storeName = ref(props.storeName);
const ListStore = usestoreHelper(props.storeName);
const queryParameters = ref(props.queryParameters);
const search = ref("");
const list = ref([]);
const page = ref(1);
const last_page = ref(null);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false);
const errorMessage = ref(null);

const onLoad = async () => {
  if (refreshing.value) {
    list.value = [];
    page.value = 1;
    last_page.value = null;
    refreshing.value = false;
  }

  queryParameters.value.search = search.value;
  queryParameters.value.page = page.value;

  await ListStore.get(queryParameters.value);
  list.value.push(...(ListStore.getResponse?.data ?? []));
  last_page.value = ListStore.getResponse?.meta.last_page ?? null;

  if (page.value >= last_page.value) {
    finished.value = true;
  } else {
    page.value++;
  }

  if (ListStore.getErrorMessage) {
    errorMessage.value = ListStore.getErrorMessage;
    error.value = true;
  }

  loading.value = false;
  refreshing.value = false;
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

const onSearch = () => {
  finished.value = false;
  loading.value = true;
  refreshing.value = true;

  onLoad();
};
</script>

<style scope></style>
