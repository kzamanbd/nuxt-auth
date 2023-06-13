<script setup>
	defineProps({
		showModal: {
			type: Boolean,
			default: false
		}
	});

	const selectClasses = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`;

	const emit = defineEmits(['close', 'update-report']);
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

	const customerType = ref(0);
	const ageDays = ref(null);
	const odDays = ref(null);

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
		console.log('print report');

		const response = await $http('/web/am-wise-aging-due-all-sdr048', {
			method: 'POST',
			body: {
				depot_id: selectedDepot.value.id || 0,
				area_id: 0,
				customer_type: 0,
				age_days: 0,
				od_days: 0,
				date_from: dateFormat(startDate.value),
				date_to: dateFormat(endDate.value)
			}
		});
		emit('update-report', response.data);
	}
</script>

<template>
	<Modal :show="showModal" @close="closeModal">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
				Are you sure you want to delete your account?
			</h2>

			<p class="mt-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
				Once your account is deleted, all of its resources and data will be permanently deleted. Please enter
				your password to confirm you would like to permanently delete your account.
			</p>

			<select
				name="depot-list"
				id="depot-list"
				:class="selectClasses"
				v-model="selectedDepot"
				@change="getRegionList">
				<option :value="null">Select Depot</option>
				<option v-for="depot in depotList" :key="depot.id" :value="depot">{{ depot.wh_name }}</option>
			</select>

			<select
				name="region-list"
				id="region-list"
				:class="selectClasses"
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
				:class="selectClasses"
				v-model="selectedArea"
				@change="getTerritoryList">
				<option :value="null">Select Area</option>
				<option v-for="area in areaList" :key="area.id" :value="area">{{ area.area_name }}</option>
			</select>

			<select name="territory-list" id="territory-list" :class="selectClasses" v-model="selectedTerritory">
				<option :value="null">Select Territory</option>
				<option v-for="territory in territoryList" :key="territory.id" :value="territory">
					{{ territory.area_name }}
				</option>
			</select>

			<label for="customer_type">Customer Type</label>
			<select v-model="customerType" :class="selectClasses" id="customer_type">
				<option value="0">Select Customer Type</option>
				<option value="1">Cash</option>
				<option value="2">Credit</option>
				<option value="3">SC/Institute</option>
			</select>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-group">
					<label>Age Days</label>
					<input v-model="ageDays" type="number" min="0" :class="selectClasses" placeholder="Age Days" />
				</div>
				<div class="form-group">
					<label>Overdue Days</label>
					<input v-model="odDays" type="number" min="0" :class="selectClasses" placeholder="Overdue Days" />
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-group">
					<label>Start Date</label>
					<input v-model="startDate" type="date" min="0" :class="selectClasses" placeholder="Age Days" />
				</div>
				<div class="form-group">
					<label>End Date</label>
					<input v-model="endDate" type="date" min="0" :class="selectClasses" placeholder="Overdue Days" />
				</div>
			</div>

			<div class="mt-6 flex justify-end">
				<SecondaryButton @click="closeModal"> Cancel </SecondaryButton>

				<PrimaryButton class="ml-3" @click="printReport"> Print </PrimaryButton>
			</div>
		</div>
	</Modal>
</template>
