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
            v-model="customer.address"
            readonly/>
          <p-form-row
            id="phone"
            label="Phone"
            name="phone"
            v-model="customer.phone"
            readonly/>
        </p-block-inner>
      </p-block>
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="table-responsive">
            <p-table>
              <tr slot="p-head">
                <th width="150px">{{ $t('date') }}</th>
                <th width="50px">{{ $t('time') }}</th>
                <th width="150px">{{ $t('sales') }}</th>
                <th width="150px">{{ $t('group') }}</th>
                <th width="150px">{{ $t('customer') }}</th>
                <th width="200px">{{ $t('address') }}</th>
                <th width="100px">{{ $t('phone') }}</th>
                <th width="250px">{{ $t('interest reason') }}</th>
                <th width="250px">{{ $t('no interest reason') }}</th>
                <th width="250px">{{ $t('similar product') }}</th>
                <th width="250px">{{ $t('item sold') }}</th>
              </tr>
              <tr slot="p-body" v-for="(form, index) in forms" :key="index">
                <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                <td>{{ form.group }}</td>
                <td>{{ form.name }}</td>
                <td>{{ form.address }}</td>
                <td>{{ form.phone }}</td>
                <td>
                    <ol>
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ interestReason.name }}
                      </li>
                    </ol>
                </td>
                <td>
                    <ol>
                      <li v-for="(notInterestReason, index) in form.not_interest_reasons" :key="index">
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
                <td>
                  <template v-if="form.is_repeat_order">
                    <b>[REPEAT]</b> <br>
                  </template>
                  <ol>
                    <li v-for="(detail, index) in form.details" :key="index">
                      {{ detail.item.name }} (Qty: {{ detail.quantity | numberFormat }}) (Price: {{ detail.price | numberFormat }}) (Total: {{ detail.quantity * detail.price | numberFormat }})
                    </li>
                  </ol>
                </td>
              </tr>
            </p-table>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <role-modal id="role" ref="role" :title="'Roles'"/>
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
        }).then((response) => {
            console.log('ga')
            this.isLoading = false
          }, (error) => {
            console.log('gb')
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
