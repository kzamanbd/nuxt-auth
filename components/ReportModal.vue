<script setup>
    const showModal = ref(false);
    const props = defineProps(['show']);

    const emit = defineEmits(['close', 'submit']);
    const closeModal = () => {
        emit('close');
    };

    watch(
        () => props.show,
        (value) => {
            showModal.value = value;
        }
    );

    const depotList = ref([]);
    const regionsList = ref([]);
    const areaList = ref([]);
    const territoryList = ref([]);
    const salesForceList = ref([]);

    const selectedDepot = ref(null);
    const selectedRegion = ref(null);
    const selectedArea = ref(null);
    const selectedTerritory = ref(null);
    const selectedSalesForce = ref(null);

    const startDate = ref(new Date().toISOString().slice(0, 10));
    const endDate = ref(new Date().toISOString().slice(0, 10));

    async function getDepotList() {
        try {
            const response = await $request('/web/v3/all-depot-under-sbu');
            depotList.value = response.wh_info;
        } catch (error) {
            console.error(error);
        }
    }

    getDepotList();

    async function getRegionList() {
        try {
            const depotId = selectedDepot.value;
            const response = await $request(`/web/get-base-region-list/${depotId}`);
            regionsList.value = response.sales_area;
            salesForceList.value = response.rsm_list;
            selectedRegion.value = null;
            selectedSalesForce.value = null;
        } catch (error) {
            console.error(error);
        }
    }

    async function getAreaList() {
        if (!selectedRegion.value) {
            getRegionList();
            areaList.value = [];
            selectedArea.value = null;
            salesForceList.value = [];
            selectedSalesForce.value = null;
            return;
        }

        try {
            const regionId = selectedRegion.value;
            const response = await $request(`/web/get-base-area-list/${regionId}`);
            areaList.value = response.sales_area;
            salesForceList.value = response.am_list;
            selectedArea.value = null;
            selectedSalesForce.value = null;
        } catch (error) {
            console.error(error);
        }
    }

    async function getTerritoryList() {
        if (!selectedArea.value) {
            getAreaList();
            territoryList.value = [];
            selectedTerritory.value = null;
            salesForceList.value = [];
            selectedSalesForce.value = null;
            return;
        }

        try {
            const areaId = selectedArea.value;
            const response = await $request(`/web/get-base-territory-list/${areaId}`);
            territoryList.value = response.sales_area;
            salesForceList.value = response.mio_list;
            selectedTerritory.value = null;
            selectedSalesForce.value = null;
        } catch (error) {
            console.error(error);
        }
    }

    function dateFormat(date) {
        return new Date(date).toISOString().slice(0, 10).split('-').reverse().join('-');
    }

    async function printReport() {
        const salesAreaId = selectedTerritory.value
            ? selectedTerritory.value
            : selectedArea.value
            ? selectedArea.value
            : selectedRegion.value
            ? selectedRegion.value
            : 0;

        emit('submit', {
            depot: selectedDepot.value,
            salesAreaId: salesAreaId,
            startDate: dateFormat(startDate.value),
            endDate: dateFormat(endDate.value)
        });
    }
</script>

<template>
    <UModal v-model="showModal" @close="closeModal">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 p-4">Report</h2>
        <div class="p-6 grid grid-cols-2 gap-4">
            <USelect
                v-model="selectedDepot"
                :options="depotList"
                option-attribute="wh_name"
                value-attribute="id"
                placeholder="Search depot..."
                @change="getRegionList">
            </USelect>

            <USelect
                v-model="selectedRegion"
                :options="regionsList"
                option-attribute="area_name"
                value-attribute="id"
                placeholder="Search region..."
                @change="getAreaList">
            </USelect>

            <USelect
                v-model="selectedArea"
                :options="areaList"
                option-attribute="area_name"
                value-attribute="id"
                placeholder="Search area..."
                @change="getTerritoryList">
            </USelect>

            <USelect
                v-model="selectedTerritory"
                :options="territoryList"
                option-attribute="area_name"
                value-attribute="id"
                placeholder="Search Territory...">
            </USelect>

            <slot />

            <UInput v-model="startDate" type="date" />
            <UInput v-model="endDate" type="date" />

            <div class="mt-6 flex justify-end">
                <SecondaryButton @click="closeModal"> Cancel </SecondaryButton>

                <PrimaryButton class="ml-3" @click="printReport"> Print </PrimaryButton>
            </div>
        </div>
    </UModal>
</template>
