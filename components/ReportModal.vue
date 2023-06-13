<script setup>
	defineProps({
		showModal: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits(['close', 'submit']);
	const closeModal = () => {
		emit('close');
	};

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
			const response = await $http('/web/v3/all-depot-under-sbu');
			depotList.value = response.wh_info;
		} catch (error) {
			console.error(error);
		}
	}

	getDepotList();

	async function getRegionList() {
		try {
			const depotId = selectedDepot.value.id;
			const response = await $http(`/web/get-base-region-list/${depotId}`);
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
			const regionId = selectedRegion.value.id;
			const response = await $http(`/web/get-base-area-list/${regionId}`);
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
			const areaId = selectedArea.value.id;
			const response = await $http(`/web/get-base-territory-list/${areaId}`);
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
			? selectedTerritory.value.id
			: selectedArea.value
			? selectedArea.value.id
			: selectedRegion.value
			? selectedRegion.value.id
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
	<Modal :show="showModal" @close="closeModal">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Report</h2>

			<select
				name="depot-list"
				id="depot-list"
				class="form-control"
				v-model="selectedDepot"
				@change="getRegionList">
				<option :value="null">Select Depot</option>
				<option v-for="depot in depotList" :key="depot.id" :value="depot">{{ depot.wh_name }}</option>
			</select>

			<select
				name="region-list"
				id="region-list"
				class="form-control"
				v-model="selectedRegion"
				@change="getAreaList">
				<option :value="null">Select Region</option>
				<option v-for="region in regionsList" :key="region.id" :value="region">
					{{ region.area_name }}
				</option>
			</select>

			<select
				name="area-list"
				id="area-list"
				class="form-control"
				v-model="selectedArea"
				@change="getTerritoryList">
				<option :value="null">Select Area</option>
				<option v-for="area in areaList" :key="area.id" :value="area">{{ area.area_name }}</option>
			</select>

			<select name="territory-list" id="territory-list" class="form-control" v-model="selectedTerritory">
				<option :value="null">Select Territory</option>
				<option v-for="territory in territoryList" :key="territory.id" :value="territory">
					{{ territory.area_name }}
				</option>
			</select>

			<slot />

			<div class="grid grid-cols-2 gap-4">
				<div class="form-group">
					<label>Start Date</label>
					<input v-model="startDate" type="date" min="0" class="form-control" placeholder="Age Days" />
				</div>
				<div class="form-group">
					<label>End Date</label>
					<input v-model="endDate" type="date" min="0" class="form-control" placeholder="Overdue Days" />
				</div>
			</div>

			<div class="mt-6 flex justify-end">
				<SecondaryButton @click="closeModal"> Cancel </SecondaryButton>

				<PrimaryButton class="ml-3" @click="printReport"> Print </PrimaryButton>
			</div>
		</div>
	</Modal>
</template>
