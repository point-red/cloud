<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/warehouse"
        class="breadcrumb-item"
      >
        {{ $t('warehouse') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ warehouse.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <a
            v-if="$permission.has('create warehouse')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addWarehouse.open()"
          >
            {{ $t('create') | uppercase }}
          </a>
          <a
            v-if="$permission.has('update warehouse')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editWarehouse.open(warehouse.id)"
          >
            {{ $t('edit') | uppercase }}
          </a>
          <button
            v-if="$permission.has('delete warehouse')"
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
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            v-if="data.branch"
            id="branch"
            v-model="data.branch.name"
            label="branch"
            name="branch"
            readonly
          />

          <p-form-row
            id="name"
            v-model="data.name"
            label="name"
            name="name"
            readonly
          />

          <p-form-row
            id="address"
            v-model="data.address"
            :disabled="true"
            :label="$t('address')"
            name="address"
          />

          <p-form-row
            id="phone"
            v-model="data.phone"
            :disabled="true"
            :label="$t('phone')"
            name="phone"
          />

          <p-separator />
          <h5>{{ $t('user access') | uppercase }}</h5>
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>user</th>
              <th class="text-center">
                access
              </th>
              <th class="text-center">
                set as default
                <i
                  class="fa fa-info-circle"
                  @click="$alert.show('info', $t('branch - set as default'))"
                />
              </th>
            </tr>
            <tr
              v-for="(user, index) in users"
              slot="p-body"
              :key="'user-' + index"
            >
              <th width="50px">
                {{ index + 1 }}
              </th>
              <td>{{ user.full_name }}</td>
              <td class="text-center">
                <input
                  type="checkbox"
                  :checked="isChecked(user.id)"
                  @click="toggleRelation(user.id)"
                >
              </td>
              <td class="text-center">
                <input
                  v-if="isChecked(user.id)"
                  type="checkbox"
                  :checked="isDefault(user)"
                  @click="toggleDefault(user.id)"
                >
              </td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-warehouse
      ref="addWarehouse"
      @added="onAddedWarehouse($event)"
    />
    <m-edit-warehouse
      ref="editWarehouse"
      @updated="onUpdatedWarehouse($event)"
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
      isDeleting: false,
      data: {
        branch_id: null,
        name: null,
        address: null,
        phone: null,
        branch: {
          name: null
        }
      }
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse']),
    ...mapGetters('masterUser', ['users'])
  },
  created () {
    this.findWarehouse()
  },
  methods: {
    ...mapActions('masterWarehouse', ['find', 'delete']),
    ...mapActions('masterUser', ['get']),
    ...mapActions('masterUserWarehouse', ['attach', 'detach', 'updateDefault']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.isDeleting = false
            this.$router.push('/master/warehouse')
          }).catch(response => {
            this.isDeleting = false
            this.$notification.error('cannot delete this service')
          })
      })
    },
    toggleRelation (userId) {
      if (this.isChecked(userId)) {
        this.detach({
          user_id: userId,
          warehouse_id: this.id
        }).then(response => {
          this.warehouse.users.splice(this.warehouse.users.indexOf(userId), 1)
        })
      } else {
        this.attach({
          user_id: userId,
          warehouse_id: this.id
        }).then(response => {
          this.warehouse.users.push({
            id: userId
          })
          this.findWarehouse()
        })
      }
    },
    toggleDefault (userId) {
      this.warehouse.users.some(user => {
        if (user.id == userId) {
          this.updateDefault({
            user_id: userId,
            warehouse_id: this.id,
            is_default: !user.pivot.is_default
          }).then(response => {
            user.pivot.is_default = !user.pivot.is_default
          })
        }
      })
    },
    isDefault (user) {
      return user.warehouses.some(element => {
        return (this.warehouse.id == element.id && element.pivot.is_default)
      })
    },
    isChecked (userId) {
      if (this.warehouse.users) {
        return this.warehouse.users.some(user => {
          return user.id == userId
        })
      }
    },
    findWarehouse () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'branch;users'
        }
      }).then(response => {
        this.isLoading = false
        this.data.branch_id = response.data.branch_id
        this.data.name = response.data.name
        this.data.address = response.data.address
        this.data.phone = response.data.phone
        this.data.branch = response.data.branch
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })

      this.get({
        params: {
          includes: 'warehouses'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onAddedWarehouse (warehouse) {
      this.$router.push('/master/warehouse/' + warehouse.id)
      this.id = warehouse.id
      this.findWarehouse()
    },
    onUpdatedWarehouse (warehouse) {
      this.findWarehouse()
    }
  }
}
</script>
