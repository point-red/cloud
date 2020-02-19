<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('role & permission') | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            to="/master/role/create"
            v-if="$permission.has('update role')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/master/role/' + role.id + '/edit', params: { id: role.id }}"
            v-if="$permission.has('update role')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete role')"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            :label="$t('name') | uppercase"
            name="name"
            v-model="role.name"
            readonly/>
        </p-block-inner>
      </p-block>
    </div>

    <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('master')" :class="{'active': choosen == 'master'}">{{ $t('master') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('purchasing')" :class="{'active': choosen == 'purchasing'}">{{ $t('purchasing') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('sales')" :class="{'active': choosen == 'sales'}">{{ $t('sales') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('inventory')" :class="{'active': choosen == 'inventory'}">{{ $t('inventory') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('manufacture')" :class="{'active': choosen == 'manufacture'}">{{ $t('manufacture') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('finance')" :class="{'active': choosen == 'finance'}">{{ $t('finance') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('accounting')" :class="{'active': choosen == 'accounting'}">{{ $t('accounting') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('human-resource')" :class="{'active': choosen == 'human-resource'}">{{ $t('human resource') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('plugin')" :class="{'active': choosen == 'plugin'}">{{ $t('plugin') | uppercase }}</a>
      </li>
    </ul>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <permission-master :roleId="id" v-show="choosen === 'master'" />
          <permission-purchasing :roleId="id" v-show="choosen === 'purchasing'" />
          <permission-sales :roleId="id" v-show="choosen === 'sales'" />
          <permission-inventory :roleId="id" v-show="choosen === 'inventory'" />
          <permission-manufacture :roleId="id" v-show="choosen === 'manufacture'" />
          <permission-finance :roleId="id" v-show="choosen === 'finance'" />
          <permission-accounting :roleId="id" v-show="choosen === 'accounting'" />
          <permission-human-resource :roleId="id" v-show="choosen === 'human-resource'" />
          <permission-plugin :roleId="id" v-show="choosen === 'plugin'" />
        </p-block-inner>
      </p-block>
    </div>
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
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
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
    this.isLoading = true
    this.findRole({ id: this.id })
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
  methods: {
    ...mapActions('masterRole', {
      findRole: 'find',
      deleteRole: 'delete'
    }),
    ...mapActions('masterPermission', { getPermissions: 'get' }),
    choose (feature) {
      this.choosen = feature
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.deleteRole({
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
