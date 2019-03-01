<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/customer"
        class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">{{ customer.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="customer.name"
            readonly/>
          <p-form-row
            id="email"
            label="Email"
            name="email"
            v-model="customer.email"
            readonly/>
          <p-form-row
            id="address"
            label="Address"
            name="address"
            v-model="customer.addresses[0].address"
            readonly/>
          <p-form-row
            id="phone"
            label="Phone"
            name="phone"
            v-model="customer.phones[0].number"
            readonly/>
        </p-block-inner>
      </p-block>
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="table-responsive">
            <p-table>
              <tr slot="p-head">
                <th style="border: 1px solid black;text-align: center" colspan="5"></th>
                <th colspan="3" width="250px" style="border: 1px solid black;text-align: center">{{ $t('item sold') }}</th>
              </tr>
              <tr slot="p-head">
                <th style="border: 1px solid black;text-align: center" width="150px">{{ $t('date') }}</th>
                <th style="border: 1px solid black;text-align: center" width="50px">{{ $t('time') }}</th>
                <th style="border: 1px solid black;text-align: center" width="150px">{{ $t('sales') }}</th>
                <th style="border: 1px solid black;text-align: center" width="250px">{{ $t('reason') }}</th>
                <th style="border: 1px solid black;text-align: center" width="250px">{{ $t('similar product') }}</th>
                <th style="border: 1px solid black;text-align: center" width="250px">{{ $t('item') }}</th>
                <th style="border: 1px solid black;text-align: center" width="250px">{{ $t('quantity') }}</th>
                <th style="border: 1px solid black;text-align: center" width="250px">{{ $t('price') }}</th>
              </tr>
              <template v-for="(form, index) in forms">
                <tr slot="p-body" v-for="(detail, index2) in form.details">
                  <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <ol v-if="form.interest_reasons">
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ interestReason.name }}
                      </li>
                    </ol>
                    <ol v-else>
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ notInterestReason.name }}
                      </li>
                    </ol>
                  </td>
                  <td>
                    <ol>
                      <li v-for="(similarProduct, index) in form.similar_products" :key="index">
                        {{ similarProduct.name }}
                      </li>
                    </ol>
                  </td>
                  <td style="border: 1px solid black;text-align: center" :key="index2">
                    {{ detail.item.name }}
                  </td>
                  <td style="border: 1px solid black;text-align: center">
                    {{ detail.quantity | numberFormat }}
                  </td>
                  <td style="border: 1px solid black;text-align: center">
                    {{ detail.price | numberFormat }}
                  </td>
                </tr>
              </template>
              <template v-for="(form, index) in forms">
                <tr slot="p-body" :key="index" v-if="form.details.length == 0">
                  <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <ol v-if="form.interest_reasons">
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ interestReason.name }}
                      </li>
                    </ol>
                    <ol v-else>
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ notInterestReason.name }}
                      </li>
                    </ol>
                  </td>
                  <td>
                    <ol>
                      <li v-for="(similarProduct, index) in form.similar_products" :key="index">
                        {{ similarProduct.name }}
                      </li>
                    </ol>
                  </td>
                  <td colspan="3"></td>
                </tr>
              </template>
            </p-table>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Customer',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('Customer', ['customer']),
    ...mapGetters('SalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('Customer', ['find']),
    ...mapActions('SalesVisitationForm', ['get', 'export'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        console.log('find')
        this.get({
          params: {
            customer_id: this.customer.id,
            date_from: new Date('2000-01-01'),
            date_to: this.$moment().format('YYYY-MM-DD 23:59:59')
          }
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
