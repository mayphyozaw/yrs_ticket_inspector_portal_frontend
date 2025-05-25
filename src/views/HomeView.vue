<template>
  <van-nav-bar :fixed="true">
    <template #left>
      <div class="flex justify-start">
        <img
          src="@/assets/image/logo.png"
          alt=""
          class="w-8 h-8 rounded-lg bg-white mr-1 p-1"
        />
        <div>
          <h5 class="text-left text-white text-xs mb-0">YRS</h5>
          <p class="text-left text-white text-xs mb-0">
            Yangon Railway Service
          </p>
        </div>
      </div>
    </template>
  </van-nav-bar>

  <div class="bg-theme pt-14 px-3 pb-20"></div>
  <div class="p-3 relative" style="top: -56px">
    <div class="origin-component">
      <van-field
        v-model="originStationTitle"
        is-link
        readonly
        label="Origin"
        placeholder="Select Origin"
        @click="originFieldClick"
      />
      <van-popup v-model:show="showOriginPicker" position="bottom">
        <van-picker
          title="Station"
          confirm-button-text="Confirm"
          cancel-button-text="Cancel"
          :columns="stations"
          :columns-field-names="{ value: 'slug', text: 'title' }"
          @confirm="originPickerConfirm"
          @cancel="showOriginPicker = false"
          @change="originPickerChange"
        />
      </van-popup>
    </div>

    <div class="destination-component mb-3">
      <van-field
        v-model="destinationStationTitle"
        is-link
        readonly
        label="Destination"
        placeholder="Select Destination"
        @click="destinationFieldClick"
      />
      <van-popup v-model:show="showDestinationPicker" position="bottom">
        <van-picker
          title="Station"
          confirm-button-text="Confirm"
          cancel-button-text="Cancel"
          :columns="stations"
          :columns-field-names="{ value: 'slug', text: 'title' }"
          @confirm="destinationPickerConfirm"
          @cancel="showDestinationPicker = false"
          @change="destinationPickerChange"
        />
      </van-popup>
    </div>

    <div class="h-screen">
      <div id="map" class="h-4/6 rounded-lg shadow-md"></div>
    </div>
  </div>

  <van-dialog
    v-model:show="showDialog"
    :close-on-click-overlay="true"
    :show-confirm-button="true"
    :show-cancel-button="true"
    confirm-button-text="Select Destination"
    cancel-button-text="Select Origin"
    confirm-button-color="#1CBC9B"
    cancel-button-color="#1CBC9B"
    @confirm="dialogSelectDestination"
    @cancel="dialogSelectOrigin"
    
  >
    <div class="p-3">
      <img src="@/assets/image/station.png" class="w-14 h-14 mx-auto mb-4" />
      <p class="text-md text-gray-700 text-center mb-3">
        {{ dialogStation.title }}
      </p>

      <div class="text-center">
        <van-button
          icon="info-o"
          type="primary"
          size="small"
          plain
          color="#1CBC9B"
          :to="`/station/${dialogStation.slug}`"
        >
          Station Information</van-button
        >
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStationStore } from "@/stores/stationStore"
import { useMarkerStore } from "@/stores/markerStore"

const router = useRouter();
const stationStore = useStationStore();
const markerStore = useMarkerStore();
const stations = ref([]);

const markers = ref([]);

const page = ref(1);
const last_page = ref(null);
const finished = ref(false);

const originStationSlug = ref(null);
const originStationTitle = ref("");
const showOriginPicker = ref(false);

const destinationStationSlug = ref(null);
const destinationStationTitle = ref("");
const showDestinationPicker = ref(false);

const showDialog = ref(false);
const dialogStation = ref(null);

var map = null;

const fetchStation = async () => {
  if (finished.value == false) {
    await stationStore.get({ page: page.value, search: "" });
    stations.value.push(...(stationStore.getResponse?.data ?? []));
    last_page.value = stationStore.getResponse?.meta.last_page ?? null;

    if (page.value >= last_page.value) {
      finished.value = true;
    } else {
      page.value++;
    }
  }
};

const fetchMarker = async () => {
  if (map.getZoom() >= 13) {
    let bounds = map.getBounds();

    await markerStore.get(
      bounds._northEast.lat,
      bounds._northEast.lng,
      bounds._southWest.lat,
      bounds._southWest.lng
    );

    markers.value = markerStore.getResponse?.data ?? [];

    var stationMarker = L.icon({
      iconUrl: "/src/assets/image/station-marker.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    markers.value.forEach(function (marker) {
      L.marker([marker["latitude"], marker["longitude"]], {
        icon: stationMarker,
      })
        .addTo(map)
        .on("click", () => {
          showDialog.value = true;
          dialogStation.value = marker;
        });
    });
  }
};

const originFieldClick = () => {
  showOriginPicker.value = true;
  fetchStation();
};

const destinationFieldClick = () => {
  showDestinationPicker.value = true;
  fetchStation();
};

const originPickerConfirm = ({ selectedOptions }) => {
  originStationSlug.value = selectedOptions[0]?.slug;
  originStationTitle.value = selectedOptions[0]?.title;
  showOriginPicker.value = false;
};

const destinationPickerConfirm = ({ selectedOptions }) => {
  destinationStationSlug.value = selectedOptions[0]?.slug;
  destinationStationTitle.value = selectedOptions[0]?.title;
  showDestinationPicker.value = false;
};

const originPickerChange = ({ selectedOptions }) => {
  if (
    stations.value[stations.value.length - 1]?.slug == selectedOptions[0].slug
  ) {
    fetchStation();
  }
};

const destinationPickerChange = ({ selectedOptions }) => {
  if (
    stations.value[stations.value.length - 1]?.slug == selectedOptions[0].slug
  ) {
    fetchStation();
  }
};


const dialogSelectOrigin = () => {
  originStationSlug.value = dialogStation.value.slug;
  originStationTitle.value = dialogStation.value.title;
};


const dialogSelectDestination = () => {
  destinationStationSlug.value = dialogStation.value.slug;
  destinationStationTitle.value = dialogStation.value.title;
};


const initMap = () => {
  if (map !== null) {
    map.remove();
  }
  map = L.map("map").setView([16.8452, 96.1218], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // navigator.geolocation.getCurrentPosition((position) => {
  //   map.setView([position.coords.latitude, position.coords.longitude], 13);

  fetchMarker();

  map.on("moveend", () => {
    fetchMarker();
  });
  // });
};

watch(originStationSlug, () => {
  if (originStationSlug.value != null && destinationStationSlug.value != null) {
    router.push(
      `route?origin_station_slug=${originStationSlug.value}&destination_station_slug=${destinationStationSlug.value}`
    );
  }
});

watch(destinationStationSlug, () => {
  if (originStationSlug.value != null && destinationStationSlug.value != null) {
    router.push(
      `route?origin_station_slug=${originStationSlug.value}&destination_station_slug=${destinationStationSlug.value}`
    );
  }
});

onMounted(() => {
  initMap();
});
</script>

<style scope>
  .origin-component .van-cell{
    border-radius: 10px 10px 0 0;
  }

  .destination-component .van-cell{
    border-radius: 0 0 10px 10px ;
  }
</style>
