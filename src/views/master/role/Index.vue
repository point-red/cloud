<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Role & Permission</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
            </tr>
            <tr
              v-for="role in roles"
              :key="role.id"
              slot="p-body">
              <td>
                <template v-if="role.id == 1">
                  {{ role.name | titlecase }}
                </template>
                <router-link v-if="role.id != 1" :to="{ name: 'RoleShow', params: { id: role.id }}">
                  {{ role.name | titlecase }}
                </router-link>
              </td>
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
      title: 'Role & Permission',
      loading: true
    }
  },
  computed: {
    ...mapGetters('Role', ['roles'])
  },
  created () {
    this.loading = true
    this.getRoles()
      .then((response) => {
        console.log('reponse role ' + JSON.stringify(response))
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('Role', {
      getRoles: 'get'
    })
  }
}
</script>
