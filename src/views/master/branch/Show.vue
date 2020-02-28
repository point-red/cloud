<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/branch" class="breadcrumb-item">{{ $t('branch') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ branch.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            to="/master/branch/create"
            v-if="$permission.has('create branch')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/master/branch/' + branch.id + '/edit', params: { id: branch.id }}"
            v-if="$permission.has('update branch')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete branch')"
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
            v-model="data.name"
            readonly/>
          <hr>
          <p-separator></p-separator>
          <h5>{{ $t('user access') | uppercase }}</h5>
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>user</th>
              <th class="text-center">access</th>
              <th class="text-center">
                set as default
                <i class="fa fa-info-circle" @click="$alert.show('info', $t('branch - set as default'))"></i>
              </th>
            </tr>
            <tr slot="p-body" v-for="(user, index) in users" :key="'user-' + index">
              <th width="50px">1</th>
              <td>{{ user.full_name }}</td>
              <td class="text-center">
                <input
                  type="checkbox"
                  :checked="isChecked(user.id)"
                  @click="toggleRelation(user.id)">
              </td>
              <td class="text-center">
                <input
                  type="checkbox"
                  v-if="isChecked(user.id)"
                  :checked="user.branch_id == branch.id"
                  @click="toggleDefault(user.id)">
              </td>
            </tr>
          </point-table>
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
      isLoading: false,
      isDeleting: false,
      data: {
        name: null
      }
    }
  },
  computed: {
    ...mapGetters('masterBranch', ['branch']),
    ...mapGetters('masterUser', ['users'])
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
      if (this.isChecked(userId)) {
        this.detach({
          user_id: userId,
          branch_id: this.id
        }).then(response => {
          this.branch.users.splice(this.branch.users.indexOf(userId), 1)
        })
      } else {
        this.attach({
          user_id: userId,
          branch_id: this.id
        }).then(response => {
          this.branch.users.push({
            id: userId
          })
        })
      }
    },
    toggleDefault (userId) {
      this.branch.users.some(user => {
        if (user.id == userId) {
          console.log(user)
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
    isChecked (userId) {
      if (this.branch.users) {
        return this.branch.users.some(user => {
          return user.id == userId
        })
      }
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'users'
      }
    }).then((response) => {
      this.isLoading = false
      this.data.name = response.data.name
    }, (error) => {
      this.isLoading = false
      this.$notification.error(error.message)
    })

    this.get({
      params: {
        branch_id: this.branch.id
      }
    }).then(response => {
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
