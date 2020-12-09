<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/branch"
        class="breadcrumb-item"
      >
        {{ $t('branch') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ branch.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <a
            v-if="$permission.has('create branch')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addBranch.open()"
          >
            {{ $t('create') | uppercase }}
          </a>
          <a
            v-if="$permission.has('update branch')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editBranch.open(branch.id)"
          >
            {{ $t('edit') | uppercase }}
          </a>
          <button
            v-if="$permission.has('delete branch')"
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
            v-model="data.name"
            :label="$t('name') | uppercase"
            name="name"
            readonly
          />
          <p-form-row
            id="address"
            v-model="data.address"
            :label="$t('address') | uppercase"
            name="address"
            readonly
          />
          <p-form-row
            id="phone"
            v-model="data.phone"
            :label="$t('phone') | uppercase"
            name="phone"
            readonly
          />
          <hr>
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

    <m-add-branch
      ref="addBranch"
      @added="onAddedBranch($event)"
    />
    <m-edit-branch
      ref="editBranch"
      @updated="onUpdatedBranch($event)"
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
      isUpdating: false,
      isDeleting: false,
      data: {
        name: null,
        address: null,
        phone: null
      }
    }
  },
  computed: {
    ...mapGetters('masterBranch', ['branch']),
    ...mapGetters('masterUser', ['users'])
  },
  created () {
    this.findBranch()
  },
  methods: {
    ...mapActions('masterBranch', ['find', 'delete']),
    ...mapActions('masterUser', ['get']),
    ...mapActions('masterBranchUser', ['attach', 'detach', 'updateDefault']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.isDeleting = false
            this.$router.push('/master/branch')
          }).catch(response => {
            this.isDeleting = false
            this.$notification.error('cannot delete this service')
          })
      })
    },
    toggleRelation (userId) {
      if (this.isUpdating === false && this.isChecked(userId)) {
        this.isUpdating = true
        this.detach({
          user_id: userId,
          branch_id: this.id
        }).then(response => {
          this.branch.users.splice(this.branch.users.findIndex(obj => obj.id == userId), 1)
        }).finally(() => {
          this.isUpdating = false
        })
      } else {
        this.attach({
          user_id: userId,
          branch_id: this.id
        }).then(response => {
          this.branch.users.push({
            id: userId
          })
          this.findBranch()
        }).finally(() => {
          this.isUpdating = false
        })
      }
    },
    toggleDefault (userId) {
      this.branch.users.some(user => {
        if (user.id == userId) {
          this.updateDefault({
            user_id: userId,
            branch_id: this.id,
            is_default: !user.pivot.is_default
          }).then(response => {
            user.pivot.is_default = !user.pivot.is_default
          })
        }
      })
    },
    isDefault (user) {
      return user.branches.some(element => {
        return (this.branch.id == element.id && element.pivot.is_default)
      })
    },
    isChecked (userId) {
      if (this.branch.users) {
        return this.branch.users.some(user => {
          return user.id == userId
        })
      }
    },
    onAddedBranch (branch) {
      this.$router.push('/master/branch/' + branch.id)
      this.id = branch.id
      this.findBranch()
    },
    onUpdatedBranch (branch) {
      this.findBranch()
    },
    findBranch () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'users'
        }
      }).then(response => {
        this.isLoading = false
        this.data.name = response.data.name
        this.data.address = response.data.address
        this.data.phone = response.data.phone
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })

      this.get({
        params: {
          includes: 'branches'
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
