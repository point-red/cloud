<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('role & permission') | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <div class="col-6 col-md-4 col-xl-2">
        <div class="block text-center" href="javascript:void(0)">
          <div class="block-content">
            <p class="mt-5">
              <i class="si si-badge fa-4x"></i>
            </p>
            <p class="font-w600">{{ role.name | uppercase }}</p>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-10">
        <div class="block" href="javascript:void(0)" style="height:136px">
          <div class="block-content">
            <p class="mt-5">
              <b>USERS :</b>
            </p>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('master')" :class="{'active': choosen == 'master'}">{{ $t('master') | uppercase }}</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('purchasing')" :class="{'active': choosen == 'purchasing'}">{{ $t('purchasing') | uppercase }}</a>
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
    ...mapActions('masterRole', { findRole: 'find' }),
    ...mapActions('masterPermission', { getPermissions: 'get' }),
    choose (feature) {
      this.choosen = feature
    }
  }
}
</script>
