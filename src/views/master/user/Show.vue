<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/user" class="breadcrumb-item">{{ $t('user') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ user.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="user.name"
            readonly/>
          <p-form-row
            id="email"
            label="Email"
            name="email"
            v-model="user.email"
            readonly/>
          <p-form-row
            id="address"
            label="Address"
            name="address"
            v-model="user.address"
            readonly/>
          <p-form-row
            id="phone"
            label="Phone"
            name="phone"
            v-model="user.phone"
            readonly/>
          <div class="form-group row">
            <label class="col-form-label col-lg-3">{{ $t('role') | uppercase }}</label>
            <div class="col-lg-9 mt-5">
              <template v-for="role in user.roles">
                <template v-if="authUser.tenant_owner_id == user.id">
                  {{ role.name | uppercase }}
                </template>
                <template v-else>
                  <a v-if="$permission.has('update user')" href="javascript:void(0)" :key="role.id" @click="$refs.role.show(user)">{{ role.name | uppercase }}</a>
                </template>
              </template>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <role-modal id="role" ref="role"/>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import RoleModal from './RoleModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    RoleModal,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('masterUser', ['user']),
    ...mapGetters('masterRole', ['roles'])
  },
  methods: {
    ...mapActions('masterUser', ['find'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'roles'
      }
    }).then((response) => {
      this.isLoading = false
    }, (error) => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
