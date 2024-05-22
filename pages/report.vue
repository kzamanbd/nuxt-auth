<script setup>
    definePageMeta({ middleware: ['auth'] });
    useHead({
        title: 'Report Overview'
    });

    const showModal = ref(false);
    const reportResponse = ref(null);
    const closeModal = () => {
        showModal.value = false;
    };
    const toast = useToast();
    const openModal = () => {
        showModal.value = true;
        reportResponse.value = null;
        toast.add({ title: 'Hello world!' });
    };

    // get query params
    const ageDays = ref(null);
    const odDays = ref(null);
    const customerType = ref(0);

    async function submitHandler(value) {
        const response = await $http('/web/am-wise-aging-due-all-sdr048', {
            method: 'POST',
            body: {
                depot_id: value.depot || 0,
                area_id: value.salesAreaId || 0,
                customer_type: customerType.value || 0,
                age_days: 0,
                od_days: 0,
                date_from: value.startDate,
                date_to: value.endDate
            }
        });
        reportResponse.value = response;
        console.log(value);
        showModal.value = false;
    }
    const customerTypeList = ref([
        { value: 1, name: 'Cash' },
        { value: 2, name: 'Credit' },
        { value: 3, name: 'SC/Institute' }
    ]);
</script>

<template>
    <div class="print:hidden max-w-7xl mx-auto flex justify-center px-4 sm:px-6 lg:px-8 mt-4">
        <SecondaryButton @click="openModal"> Open </SecondaryButton>
    </div>

    <ReportModal :show="showModal" @close="closeModal" @submit="submitHandler">
        <USelect
            v-model="customerType"
            :options="customerTypeList"
            option-attribute="name"
            value-attribute="value"
            placeholder="Customer Type...">
        </USelect>

        <UInput v-model="ageDays" type="number" min="0" placeholder="Age Days" />
        <UInput v-model="odDays" type="number" min="0" placeholder="Overdue Days" />
    </ReportModal>
    <!-- display report -->

    <table class="w-full" v-if="reportResponse?.rep_detail">
        <thead>
            <tr>
                <th style="border: 1px solid #000000">Chemist Code</th>
                <th style="border: 1px solid #000000; width: 20%">Name & Address</th>
                <th style="border: 1px solid #000000">Invoice No</th>
                <th style="border: 1px solid #000000">Date</th>
                <th style="border: 1px solid #000000">Despatch</th>
                <th style="border: 1px solid #000000">Return</th>
                <th style="border: 1px solid #000000">Total Paid</th>
                <th style="border: 1px solid #000000">Balance</th>
                <th style="border: 1px solid #000000">Age Days</th>
                <th style="border: 1px solid #000000">Duration</th>
                <th style="border: 1px solid #000000">OD Days</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="net_detail in reportResponse.rep_detail" :key="net_detail.id">
                <template v-for="wh_detail in net_detail.nat_data" :key="wh_detail.wh_name">
                    <!-- wh detail -->
                    <tr>
                        <td>{{ wh_detail.wh_area_code }}</td>
                        <td>{{ wh_detail.wh_name }}</td>
                        <td colspan="7"></td>
                    </tr>

                    <template v-for="rsm_detail in wh_detail.wh_data" :key="rsm_detail.id">
                        <tr>
                            <td>{{ rsm_detail.rsm_area_code }}</td>
                            <td>{{ rsm_detail.rsm_name }}</td>
                            <td colspan="10"></td>
                        </tr>

                        <template v-for="am_detail in rsm_detail.rsm_data" :key="am_detail.rsm_area_code">
                            <template v-for="mio in am_detail.am_data" :key="mio.id">
                                <template v-for="mio_data in mio.mio_data" :key="mio_data.mio_area_code">
                                    <tr>
                                        <td></td>
                                        <td>{{ mio.mio_name }}</td>
                                        <td colspan="3">Territory Code:</td>
                                        <td>{{ mio.mio_area_code }}</td>
                                        <td colspan="5">
                                            {{ mio_data.inv_type }}
                                        </td>
                                    </tr>
                                    <template v-for="inv in mio_data.inv_data" :key="inv.invoice_no">
                                        <tr>
                                            <td>{{ inv.cust_code }}</td>
                                            <td>{{ inv.cust_name }}</td>
                                            <td>{{ inv.invoice_no }}</td>
                                            <td>{{ inv.inv_date }}</td>
                                            <td>{{ inv.despatch }}</td>
                                            <td>{{ inv.return_total }}</td>
                                            <td>{{ inv.total_paid }}</td>
                                            <td>{{ inv.due_amt }}</td>
                                            <td>{{ inv.age_days }}</td>
                                            <td>{{ inv.duration }}</td>
                                            <td>{{ inv.od_days }}</td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <td colspan="4">
                                            <b>{{ mio_data.inv_type }} Total :</b>
                                        </td>
                                        <td>{{ mio_data.inv_net_total }}</td>
                                        <td>{{ mio_data.inv_return_total }}</td>
                                        <td>{{ mio_data.inv_total_paid }}</td>
                                        <td>{{ mio_data.inv_due_amt }}</td>
                                    </tr>
                                </template>
                                <tr>
                                    <td colspan="4">
                                        {{ mio.mio_oname }}, Total ({{
                                            mio.mio_data.map((_item) => _item.inv_type).join(' & ')
                                        }}) :
                                    </td>
                                    <td>{{ mio.mio_despatch }}</td>
                                    <td>{{ mio.mio_return_total }}</td>
                                    <td>{{ mio.mio_total_paid }}</td>
                                    <td>{{ mio.mio_due_amt }}</td>
                                </tr>
                            </template>
                            <tr>
                                <td colspan="4">
                                    <b>{{ am_detail.am_name }}, Total:</b>
                                </td>
                                <td>{{ am_detail.am_despatch }}</td>
                                <td>{{ am_detail.am_return_total }}</td>
                                <td>{{ am_detail.am_total_paid }}</td>
                                <td>{{ am_detail.am_due_amt }}</td>
                            </tr>
                        </template>
                        <tr>
                            <td colspan="4">
                                <b>{{ rsm_detail.rsm_name }}, Total:</b>
                            </td>
                            <td>{{ rsm_detail.rsm_despatch }}</td>
                            <td>{{ rsm_detail.rsm_return_total }}</td>
                            <td>{{ rsm_detail.rsm_total_paid }}</td>
                            <td>{{ rsm_detail.rsm_due_amt }}</td>
                        </tr>
                    </template>
                    <tr>
                        <td colspan="4">
                            <b>{{ wh_detail.wh_name }}, Total:</b>
                        </td>
                        <td>{{ wh_detail.wh_despatch }}</td>
                        <td>{{ wh_detail.wh_return_total }}</td>
                        <td>{{ wh_detail.wh_total_paid }}</td>
                        <td>{{ wh_detail.wh_due_amt }}</td>
                    </tr>
                </template>
                <tr>
                    <td colspan="4">
                        <b>Grand Total:</b>
                    </td>
                    <td>{{ net_detail.despatch }}</td>
                    <td>{{ net_detail.return_total }}</td>
                    <td>{{ net_detail.total_paid }}</td>
                    <td>{{ net_detail.due_amt }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style scoped>
    @page {
        size: 8.5in 11in;
        margin: 1in 0.5in 0.5in 1in;
        border: 1px solid #000000;
    }
    p {
        margin: 0;
        font-family: 'Calibri';
    }
    table {
        width: 100%;
        border-collapse: collapse;
        color: black;
        font-size: 11px;
        text-align: center;
        font-family: 'Calibri';
        page-break-inside: auto;
    }
    table tr th,
    table tbody tr td {
        font-family: 'Arial Narrow' !important;
    }

    thead p {
        line-height: 1;
        font-weight: 600;
        padding: 2px 0;
    }
    .total-row {
        border-top: 1px solid #000000 !important;
        font-weight: 600;
        text-align: right;
        font-size: 12px;
    }
    .total-row.no-border {
        border: none;
    }
    @media print {
        table {
            font-size: 14px;
        }
    }
    .border {
        border: 1px solid #000000 !important;
    }
    .left {
        text-align: left;
    }
    .right {
        text-align: right;
    }
    .center {
        text-align: center;
    }
    .bold {
        font-weight: 600;
    }
</style>
