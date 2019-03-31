<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Role & Permission</span>
    </breadcrumb>

    <tab-menu>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('master')" :class="{'active': choosen == 'master'}">Master</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('human-resource')" :class="{'active': choosen == 'human-resource'}">Human Resource</a>
      </li>
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('plugin')" :class="{'active': choosen == 'plugin'}">Plugin</a>
      </li>
    </tab-menu>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <permission-master :roleId="id" v-show="choosen === 'master'" />
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
import PermissionHumanResource from './permission/PermissionHumanResource'
import PermissionPlugin from './permission/PermissionPlugin'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PermissionMaster,
    PermissionHumanResource,
    PermissionPlugin,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Role & Permission',
      loading: true,
      choosen: 'master'
    }
  },
  computed: {
    ...mapGetters('masterRole', ['role']),
    ...mapGetters('masterPermission', ['permissions'])
  },
  created () {
    this.loading = true
    this.findRole({ id: this.id })
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
    this.getPermissions({ id: this.id })
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
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
