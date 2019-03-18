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

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
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
            id="priority"
            :label="''"
            name="priority">
            <div slot="body" class="col-lg-9">
              <p-form-check-box
                id="priority"
                name="priority"
                :checked="data.priority"
                :description="'Priority Customer'"/>
            </div>          
          </p-form-row>

          <hr/>
          <router-link
            :to="{ path: '/master/customer/' + customer.id + '/edit', params: { id: customer.id }}"
            v-if="$permission.has('update customer')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
        </p-block-inner>
      </p-block>
      <p-block v-if="forms.length > 0 && isLoadingSalesVisitation == false">
        <p-block-inner :is-loading="isLoadingSalesVisitation">
          <point-table>
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
              <template v-if="form.details && form.details.length > 0">
                <tr slot="p-body" v-for="(detail, index2) in form.details" :key="index + '-' + index2">
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
              <template v-else>
                <tr slot="p-body" :key="index">
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
      title: 'Customer',
      isLoading: false,
      isLoadingSalesVisitation: false,
      data: {
        name: null,
        email: null,
        address: null,
        phone: null,
        priority: false,
      },
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('Customer', ['customer']),
    ...mapGetters('SalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('Customer', ['find']),
    ...mapActions('SalesVisitationForm', ['get', 'export']),
    updatePage (value) {
      this.currentPage = value
      this.getSalesVisitationRequest()
    },
    getSalesVisitationRequest () {
      this.get({
        params: {
          filter_equal: {
            'customers.id': this.id
          },
          date_from: this.$moment('1970-01-01').format('YYYY-MM-DD 00:00:00'),
          date_to: this.$moment().format('YYYY-MM-DD 23:59:59'),
          limit: 20,
          page: this.currentPage,
          sort_by: '-forms.date'
        }
      }).then(response => {
        console.log(response)
        this.isLoadingSalesVisitation = false          
      }).catch(error => {
        this.isLoadingSalesVisitation = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false

        this.data.name = response.data.name
        if (response.data.emails) {
          this.data.email = response.data.emails[0].email
        }
        if (response.data.addresses) {
          this.data.address = response.data.addresses[0].address
        }
        if (response.data.phones) {
          this.data.phone = response.data.phones[0].number
        }
        if (response.data.groups) {
          if (response.data.groups[0].name == 'priority') {
            this.data.priority = true
          }
        }
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    this.isLoadingSalesVisitation = true
    this.getSalesVisitationRequest()
  }
}
</script>
