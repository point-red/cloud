<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/user"
        class="breadcrumb-item"
      >
        {{ $t('user') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ user.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <template v-if="authUser.tenant_owner_id != user.id">
            <a
              v-if="$permission.has('update user')"
              href="javascript:void(0)"
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="$refs.editUser.open(user.id)"
            >
              {{ $t('edit') | uppercase }}
            </a>
            <!-- <button
              type="button"
              @click="onDelete()"
              v-if="$permission.has('delete user')"
              :disabled="isDeleting"
              class="btn btn-sm btn-outline-secondary">
              <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
            </button> -->
          </template>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="user.name"
            label="name"
            name="name"
            readonly
          />
          <p-form-row
            id="email"
            v-model="user.email"
            label="email"
            name="email"
            readonly
          />
          <p-form-row
            id="first_name"
            v-model="user.first_name"
            label="first name"
            name="first_name"
            readonly
          />
          <p-form-row
            id="last_name"
            v-model="user.last_name"
            label="last name"
            name="last_name"
            readonly
          />
          <p-form-row
            id="address"
            v-model="user.address"
            label="address"
            name="address"
            readonly
          />
          <p-form-row
            id="phone"
            v-model="user.phone"
            label="phone"
            name="phone"
            readonly
          />

          <p-separator />

          <h5>{{ $t('role') | uppercase }}</h5>
          <template v-if="user.roles && user.roles.length == 0">
            <a
              v-if="$permission.has('update user')"
              href="javascript:void(0)"
              @click="$refs.role.show(user)"
            >{{ 'select' | uppercase }}</a>
          </template>
          <template v-for="role in user.roles">
            <template v-if="authUser.tenant_owner_id == user.id">
              {{ role.name | uppercase }}
            </template>
            <template v-else>
              <a
                v-if="$permission.has('update user')"
                :key="role.id"
                href="javascript:void(0)"
                @click="$refs.role.show(user)"
              >{{ role.name | uppercase }}</a>
            </template>
          </template>
        </p-block-inner>
      </p-block>
    </div>
    <role-modal
      id="role"
      ref="role"
    />
    <m-edit-user
      ref="editUser"
      @updated="onUpdatedUser($event)"
    />
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
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('masterUser', ['user']),
    ...mapGetters('masterRole', ['roles'])
  },
  created () {
    this.findUser()
  },
  methods: {
    ...mapActions('masterUser', ['find']),
    onUpdatedUser (branch) {
      this.findUser()
    },
    findUser () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'roles'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
