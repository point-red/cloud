<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">User</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
            </tr>
            <tr
              v-for="user in users"
              :key="user.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'UserShow', params: { id: user.id }}">
                  {{ user.name | titlecase }}
                </router-link>
              </td>
              <td>{{ user.email | lowercase }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <template v-for="role in user.roles">
                  {{ role.name | titlecase }}
                </template>
              </td>
            </tr>
            <tr
              v-for="userInvitation in userInvitations"
              :key="userInvitation.id"
              slot="p-body">
              <td>
                {{ userInvitation.user_name }}
                <br>
                <label for="pending" class="badge badge-danger"><i class="fa fa-warning"></i> PENDING INVITATION</label>
              </td>
              <td>{{ userInvitation.user_email }}</td>
              <td></td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'User',
      loading: true
    }
  },
  computed: {
    ...mapGetters('masterUser', ['users']),
    ...mapGetters('masterUserInvitation', ['userInvitations'])
  },
  methods: {
    ...mapActions('masterUser', {
      getUser: 'get'
    }),
    ...mapActions('masterUserInvitation', {
      getUserInvitation: 'get'
    })
  },
  created () {
    this.loading = true
    this.getUser({
      params: {
        limit: 10,
        includes: 'roles'
      }
    }).then((response) => {
      this.loading = false
    }, (error) => {
      this.loading = false
      this.$notifications.error(error)
    })
    this.getUserInvitation()
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notifications.error(error.message)
      })
  }
}
</script>
