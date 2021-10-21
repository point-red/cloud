<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('role & permission') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <a
            v-if="$permission.has('create role')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addRole.open()"
          >
            {{ $t('create') | uppercase }}
          </a>
          <a
            v-if="$permission.has('update role')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editRole.open(role.id)"
          >
            {{ $t('edit') | uppercase }}
          </a>
          <button
            v-if="$permission.has('delete role')"
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
            id="name"
            v-model="role.name"
            :label="$t('name') | uppercase"
            name="name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>

    <ul
      class="nav nav-tabs nav-tabs-alt mb-10"
      data-toggle="tabs"
      role="tablist"
    >
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'master'}"
          @click="choose('master')"
        >{{ $t('master') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'purchasing'}"
          @click="choose('purchasing')"
        >{{ $t('purchasing') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'sales'}"
          @click="choose('sales')"
        >{{ $t('sales') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'inventory'}"
          @click="choose('inventory')"
        >{{ $t('inventory') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'manufacture'}"
          @click="choose('manufacture')"
        >{{ $t('manufacture') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'finance'}"
          @click="choose('finance')"
        >{{ $t('finance') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'accounting'}"
          @click="choose('accounting')"
        >{{ $t('accounting') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'human-resource'}"
          @click="choose('human-resource')"
        >{{ $t('human resource') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'plugin'}"
          @click="choose('plugin')"
        >{{ $t('plugin') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          :class="{'active': choosen == 'setting'}"
          @click="choose('setting')"
        >{{ $t('setting') | uppercase }}</a>
      </li>
    </ul>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <permission-master
            v-show="choosen === 'master'"
            :role-id="id"
          />
          <permission-purchasing
            v-show="choosen === 'purchasing'"
            :role-id="id"
          />
          <permission-sales
            v-show="choosen === 'sales'"
            :role-id="id"
          />
          <permission-inventory
            v-show="choosen === 'inventory'"
            :role-id="id"
          />
          <permission-manufacture
            v-show="choosen === 'manufacture'"
            :role-id="id"
          />
          <permission-finance
            v-show="choosen === 'finance'"
            :role-id="id"
          />
          <permission-accounting
            v-show="choosen === 'accounting'"
            :role-id="id"
          />
          <permission-human-resource
            v-show="choosen === 'human-resource'"
            :role-id="id"
          />
          <permission-plugin
            v-show="choosen === 'plugin'"
            :role-id="id"
          />
          <permission-setting
            v-show="choosen === 'setting'"
            :role-id="id"
          />
        </p-block-inner>
      </p-block>
    </div>

    <m-add-role
      ref="addRole"
      @added="onAddedRole($event)"
    />
    <m-edit-role
      ref="editRole"
      @updated="onUpdatedRole($event)"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import PermissionMaster from './permission/PermissionMaster'
import PermissionPurchasing from './permission/PermissionPurchasing'
import PermissionSales from './permission/PermissionSales'
import PermissionInventory from './permission/PermissionInventory'
import PermissionManufacture from './permission/PermissionManufacture'
import PermissionFinance from './permission/PermissionFinance'
import PermissionAccounting from './permission/PermissionAccounting'
import PermissionHumanResource from './permission/PermissionHumanResource'
import PermissionPlugin from './permission/PermissionPlugin'
import PermissionSetting from './permission/PermissionSetting'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PermissionMaster,
    PermissionPurchasing,
    PermissionSales,
    PermissionInventory,
    PermissionManufacture,
    PermissionFinance,
    PermissionAccounting,
    PermissionHumanResource,
    PermissionPlugin,
    PermissionSetting,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: parseInt(this.$route.params.id, 10),
      isLoading: true,
      isDeleting: false,
      isArchiving: false,
      choosen: 'master'
    }
  },
  computed: {
    ...mapGetters('masterRole', ['role']),
    ...mapGetters('masterPermission', ['permissions'])
  },
  created () {
    this.findRole()
  },
  methods: {
    ...mapActions('masterRole', {
      find: 'find',
      delete: 'delete'
    }),
    ...mapActions('masterPermission', { getPermissions: 'get' }),
    choose (feature) {
      this.choosen = feature
    },
    onAddedRole (role) {
      this.$router.push('/master/role/' + role.id)
      this.id = role.id
      this.findRole()
    },
    onUpdatedRole (role) {
      this.findRole()
    },
    findRole () {
      this.isLoading = true
      this.find({ id: this.id })
        .then((response) => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      this.getPermissions({ id: this.id })
        .then((response) => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
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
          this.$router.push('/master/role')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this role')
        })
      })
    }
  }
}
</script>
