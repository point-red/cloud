<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('notification') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner>
          <p-table>
            <tr slot="p-head">
              <th />
              <th>Push Notification</th>
              <th>Email Notification</th>
            </tr>
            <tr slot="p-body">
              <td>Employee Contract</td>
              <td>
                <!-- <template v-for="(project, index) in projects">
                  <p-form-check-box :key="index" :ref="'push-notification-employee-contract-' + project.code" @click.native="togglePermission('push-notification', 'employee-contract', project.code)" :description="project.code"/>
                </template> -->
                <p-form-check-box
                  ref="abc-def"
                  :description="'abc'"
                  @click.native="togglePermission('abc-def', '', '')"
                />
              </td>
              <td>
                <template v-for="(project, index) in projects">
                  <p-form-check-box
                    :key="index"
                    :ref="'email-notification-employee-contract-' + project.code"
                    :description="project.code"
                    @click.native="togglePermission('email-notification', 'employee-contract', project.code)"
                  />
                </template>
              </td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      isSaving: false,
      userId: parseInt(localStorage.getItem('userId'))
    }
  },
  computed: {
    ...mapGetters('accountProject', ['projects'])
  },
  created () {
    this.getProject()
  },
  methods: {
    ...mapActions('accountProject', {
      getProject: 'get'
    }),
    togglePermission (notificationMethod, feature, projectCode) {
      var ref = notificationMethod + '-' + feature + '-' + projectCode
      this.$refs[ref].togglePerm()
    }
  }
}
</script>
