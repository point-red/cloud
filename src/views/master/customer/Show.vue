<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/customer"
        class="breadcrumb-item"
      >
        {{ $t('customer') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ customer.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create customer')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addCustomer.open()"
          >
            {{ $t('create') | uppercase }}
          </button>
          <button
            v-if="$permission.has('update customer')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editCustomer.open(customer.id)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete customer')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete customer') && customer.archived_at == null"
            type="button"
            :disabled="isArchiving"
            class="btn btn-sm btn-outline-secondary ml-5"
            @click="onArchive()"
          >
            <i
              v-show="isArchiving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('archive') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete customer') && customer.archived_at != null"
            type="button"
            :disabled="isArchiving"
            class="btn btn-sm btn-outline-secondary ml-5"
            @click="onActivate()"
          >
            <i
              v-show="isArchiving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('activate') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="code"
            v-model="customer.code"
            label="Code"
            name="code"
            readonly
          />
          <p-form-row
            id="name"
            v-model="customer.name"
            label="Name"
            name="name"
            readonly
          />
          <p-form-row
            id="email"
            v-model="data.email"
            label="Email"
            name="email"
            readonly
          />
          <p-form-row
            id="address"
            v-model="data.address"
            label="Address"
            name="address"
            readonly
          />
          <p-form-row
            id="phone"
            v-model="data.phone"
            label="Phone"
            name="phone"
            readonly
          />

          <p-separator />

          <h5>{{ $t('credit limit') | uppercase }}</h5>
          <p>{{ $t('create customer helper - credit limit') }}</p>

          {{ data.credit_limit | numberFormat }}

          <p-separator />

          <h5>{{ $t('pricing group') | uppercase }}</h5>
          <p>{{ $t('create customer helper - pricing group') }}</p>

          <ul v-if="data.pricing_group.label != null">
            <li>{{ data.pricing_group.label }}</li>
          </ul>

          <p-separator />

          <h5>{{ $t('customer group') | uppercase }}</h5>
          <p>{{ $t('create customer helper - group') }}</p>
          <ul
            v-for="(group, index) in customer.groups"
            :key="index"
          >
            <li>{{ group.name }}</li>
          </ul>
        </p-block-inner>
      </p-block>
      <p-block v-if="forms.length > 0 && isLoadingSalesVisitation == false">
        <p-block-inner :is-loading="isLoadingSalesVisitation">
          <point-table>
            <tr slot="p-head">
              <th />
              <th colspan="4" />
              <th
                colspan="3"
                width="250px"
                style="border: 1px solid black;text-align: center"
              >
                {{ $t('item sold') }}
              </th>
            </tr>
            <tr slot="p-head">
              <th
                style="border: 1px solid black;text-align: center"
                width="150px"
              >
                {{ $t('date') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="50px"
              >
                {{ $t('time') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="150px"
              >
                {{ $t('sales') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="250px"
              >
                {{ $t('reason') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="250px"
              >
                {{ $t('similar product') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="250px"
              >
                {{ $t('item') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="250px"
              >
                {{ $t('quantity') }}
              </th>
              <th
                style="border: 1px solid black;text-align: center"
                width="250px"
              >
                {{ $t('price') }}
              </th>
            </tr>
            <template v-for="(form, index) in forms">
              <template v-if="form.details && form.details.length > 0">
                <tr
                  v-for="(detail, index2) in form.details"
                  slot="p-body"
                  :key="index + '-' + index2"
                >
                  <th>{{ form.form.date | dateFormat('DD MMM YYYY') }}</th>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <template v-if="form.interest_reasons">
                      <template v-for="(interestReason, interestIndex) in form.interest_reasons">
                        <p
                          :key="interestIndex"
                          class="mb-0"
                        >
                          - {{ interestReason.name }}
                        </p>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(noInterestReason, noInterestIndex) in form.no_interest_reasons">
                        <p
                          :key="noInterestIndex"
                          class="mb-0"
                        >
                          - {{ noInterestReason.name }}
                        </p>
                      </template>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, similarProductIndex) in form.similar_products">
                      <p
                        :key="similarProductIndex"
                        class="mb-0"
                      >
                        - {{ similarProduct.name }}
                      </p>
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
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                  <td>{{ form.form.created_at | dateFormat('HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>
                    <template v-if="form.interest_reasons">
                      <template v-for="(interestReason, interestIndex) in form.interest_reasons">
                        <p
                          :key="interestIndex"
                          class="mb-0"
                        >
                          - {{ interestReason.name }}
                        </p>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(noInterestReason, interestIndex) in form.no_interest_reasons">
                        <p
                          :key="interestIndex"
                          class="mb-0"
                        >
                          - {{ noInterestReason.name }}
                        </p>
                      </template>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, similarProductIndex) in form.similar_products">
                      <p
                        :key="similarProductIndex"
                        class="mb-0"
                      >
                        - {{ similarProduct.name }}
                      </p>
                    </template>
                  </td>
                  <td />
                  <td />
                  <td />
                </tr>
              </template>
            </template>
          </point-table>
          <p-pagination
            :current-page="page"
            :last-page="lastPage"
            @updatePage="updatePage"
          />
        </p-block-inner>
      </p-block>
    </div>
    <m-add-customer
      ref="addCustomer"
      @added="onAddedCustomer($event)"
    />
    <m-edit-customer
      ref="editCustomer"
      @updated="onUpdatedCustomer($event)"
    />
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
      isArchiving: false,
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer']),
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms'])
  },
  created () {
    this.findCustomer()
  },
  methods: {
    ...mapActions('masterCustomer', ['find', 'delete', 'archive', 'activate']),
    ...mapActions('pluginPinPointSalesVisitationForm', ['get', 'export']),
    updatePage (value) {
      this.page = value
      this.getSalesVisitationRequest()
    },
    findCustomer () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'addresses;phones;emails;groups;pricingGroup'
        }
      }).then(response => {
        this.isLoading = false
        this.data.name = response.data.name
        this.data.email = response.data.email
        this.data.address = response.data.address
        this.data.phone = response.data.phone
        this.data.credit_limit = response.data.credit_limit
        if (response.data.pricing_group) {
          this.data.pricing_group.label = response.data.pricing_group.label
        }
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
      this.isLoadingSalesVisitation = true
      this.getSalesVisitationRequest()
    },
    getSalesVisitationRequest () {
      this.get({
        params: {
          join: 'customer,created_by',
          filter_equal: {
            'sales_visitation.customer_id': this.id
          },
          date_from: this.$moment('1970-01-01').format('YYYY-MM-DD 00:00:00'),
          date_to: this.$moment().format('YYYY-MM-DD 23:59:59'),
          limit: 20,
          page: this.page,
          sort_by: '-form.date'
        }
      }).then(response => {
        this.isLoadingSalesVisitation = false
      }).catch(error => {
        this.isLoadingSalesVisitation = false
        this.$notification.error(error.message)
      })
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
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
      })
    },
    onAddedCustomer (customer) {
      this.$router.push('/master/customer/' + customer.id)
      this.id = customer.id
      this.findCustomer()
    },
    onUpdatedCustomer (customer) {
      this.findCustomer()
    },
    onArchive () {
      this.$alert.confirm(this.$t('archive'), this.$t('confirmation archive message')).then(response => {
        this.isArchiving = true
        this.archive({
          id: this.id
        }).then(response => {
          this.isArchiving = false
        }).catch(response => {
          this.isArchiving = false
          this.$notification.error('cannot archive this customer')
        })
      })
    },
    onActivate () {
      this.$alert.confirm(this.$t('activate'), this.$t('confirmation activate message')).then(response => {
        this.isArchiving = true
        this.activate({
          id: this.id
        }).then(response => {
          this.isArchiving = false
        }).catch(response => {
          this.isArchiving = false
          this.$notification.error('cannot activate this customer')
        })
      })
    }
  }
}
</script>
