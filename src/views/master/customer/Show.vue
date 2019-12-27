<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">{{ customer.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('customer')" :header="true">
        <router-link
          to="/master/customer/create"
          v-if="$permission.has('create customer')"
          slot="header"
          exact
          class="btn btn-outline-secondary btn-sm mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
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
            v-model="data.email"
            readonly/>
          <p-form-row
            id="address"
            label="Address"
            name="address"
            v-model="data.address"
            readonly/>
          <p-form-row
            id="phone"
            label="Phone"
            name="phone"
            v-model="data.phone"
            readonly/>
          <p-form-row
            id="pricing-group"
            label="Pricing Group"
            name="pricing-group"
            v-model="data.pricing_group.label"
            readonly/>

          <p-form-row
            id="group"
            :label="$t('group')"
            name="group"
            readonly>
            <div slot="body" class="col-lg-9">
              <table class="table">
                <thead></thead>
                <tbody>
                  <template v-for="(group, index) in customer.groups">
                    <tr :key="index">
                      <td>{{ group.name }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </p-form-row>

          <hr/>

          <router-link
            :to="{ path: '/master/customer/' + customer.id + '/edit', params: { id: customer.id }}"
            v-if="$permission.has('update customer')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete customer')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
          </button>
          <button
            type="button"
            @click="onArchive()"
            v-if="$permission.has('delete customer') && customer.archived_at == null"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-danger ml-5">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Archive
          </button>
          <button
            type="button"
            @click="onActivate()"
            v-if="$permission.has('delete customer') && customer.archived_at != null"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-primary ml-5">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Activate
          </button>
        </p-block-inner>
      </p-block>
      <p-block v-if="forms.length > 0 && isLoadingSalesVisitation == false">
        <p-block-inner :is-loading="isLoadingSalesVisitation">
          <point-table>
            <tr slot="p-head">
              <th></th>
              <th colspan="4"></th>
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
              <template v-if="form.details && form.details.length > 0">
                <tr slot="p-body" v-for="(detail, index2) in form.details" :key="index + '-' + index2">
                  <th>{{ form.form.date | dateFormat('DD MMM YYYY') }}</th>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <template v-if="form.interest_reasons">
                      <template v-for="(interestReason, index) in form.interest_reasons">
                        <p :key="index" class="mb-0">- {{ interestReason.name }}</p>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(notInterestReason, index) in form.not_interest_reasons">
                        <p :key="index" class="mb-0">- {{ notInterestReason.name }}</p>
                      </template>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, index) in form.similar_products">
                      <p :key="index" class="mb-0">- {{ similarProduct.name }}</p>
                    </template>
                  </td>
                  <td>
                    {{ detail.item.name }}
                  </td>
                  <td class="text-right">
                    {{ detail.quantity | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ detail.price | numberFormat }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr slot="p-body" :key="index">
                  <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <template v-if="form.interest_reasons">
                      <template v-for="(interestReason, index) in form.interest_reasons">
                        <p :key="index" class="mb-0">- {{ interestReason.name }}</p>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(notInterestReason, index) in form.not_interest_reasons">
                        <p :key="index" class="mb-0">- {{ notInterestReason.name }}</p>
                      </template>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, index) in form.similar_products">
                      <p :key="index" class="mb-0">- {{ similarProduct.name }}</p>
                    </template>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
            </template>
          </point-table>
          <p-pagination
            :current-page="currentPage"
            :last-page="lastPage"
            @updatePage="updatePage">
          </p-pagination>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      isLoadingSalesVisitation: false,
      data: {
        email: null,
        address: null,
        phone: null,
        pricing_group: {
          label: null
        }
      },
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer']),
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('masterCustomer', ['find', 'delete', 'archive', 'activate']),
    ...mapActions('pluginPinPointSalesVisitationForm', ['get', 'export']),
    updatePage (value) {
      this.currentPage = value
      this.getSalesVisitationRequest()
    },
    getSalesVisitationRequest () {
      this.get({
        params: {
          filter_equal: {
            'customer.id': this.id
          },
          date_from: this.$moment('1970-01-01').format('YYYY-MM-DD 00:00:00'),
          date_to: this.$moment().format('YYYY-MM-DD 23:59:59'),
          limit: 20,
          page: this.currentPage,
          sort_by: '-forms.date'
        }
      }).then(response => {
        this.isLoadingSalesVisitation = false
      }).catch(error => {
        this.isLoadingSalesVisitation = false
        this.$notification.error(error.message)
      })
    },
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$router.push('/master/customer')
      }).catch(response => {
        this.isDeleting = false
        this.$notification.error('cannot delete this customer')
      })
    },
    onArchive () {
      this.isDeleting = true
      this.archive({
        id: this.id
      }).then(response => {
        this.isDeleting = false
      }).catch(response => {
        this.isDeleting = false
        this.$notification.error('cannot archive this customer')
      })
    },
    onActivate () {
      this.isDeleting = true
      this.activate({
        id: this.id
      }).then(response => {
        this.isDeleting = false
      }).catch(response => {
        this.isDeleting = false
        this.$notification.error('cannot activate this customer')
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'addresses;phones;emails;groups;pricingGroup'
      }
    }).then(response => {
      this.isLoading = false
      this.data.name = response.data.name
      if (response.data.pricing_group) {
        this.data.pricing_group.label = response.data.pricing_group.label
      }
      if (response.data.emails.length > 0) {
        this.data.email = response.data.emails[0].email
      }
      if (response.data.addresses.length > 0) {
        this.data.address = response.data.addresses[0].address
      }
      if (response.data.phones.length > 0) {
        this.data.phone = response.data.phones[0].number
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
    this.isLoadingSalesVisitation = true
    this.getSalesVisitationRequest()
  }
}
</script>
