<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px" />
        <th>Feature</th>
        <th />
        <th />
        <th />
        <th />
        <th />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="menu human resource"
            :is-form="false"
            :checked="$rolePermission.has('menu human resource', permissions)"
            @click.native="togglePermission('menu human resource')"
          />
        </td>
        <td><b>{{ $t('human resource') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)"
          />
        </td>
        <td><b>{{ $t('employee') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee"
            :is-form="false"
            :checked="$rolePermission.has('create employee', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee"
            :is-form="false"
            :checked="$rolePermission.has('read employee', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee"
            :is-form="false"
            :checked="$rolePermission.has('update employee', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee"
            :is-form="false"
            :checked="$rolePermission.has('delete employee', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee salary', 'read employee salary', 'update employee salary', 'delete employee salary', 'print employee salary'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee salary', 'read employee salary', 'update employee salary', 'delete employee salary', 'print employee salary'], permissions)"
          />
        </td>
        <td><b>{{ $t('salary') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee salary"
            :is-form="false"
            :checked="$rolePermission.has('create employee salary', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee salary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee salary"
            :is-form="false"
            :checked="$rolePermission.has('read employee salary', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee salary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee salary"
            :is-form="false"
            :checked="$rolePermission.has('update employee salary', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee salary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee salary"
            :is-form="false"
            :checked="$rolePermission.has('delete employee salary', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee salary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="print employee salary"
            :is-form="false"
            :checked="$rolePermission.has('print employee salary', permissions)"
            :description="'print' | uppercase"
            @click.native="togglePermission('print employee salary')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="manage employee contract"
            :is-form="false"
            :checked="$rolePermission.has('manage employee contract', permissions)"
            @click.native="togglePermission('manage employee contract')"
          />
        </td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)"
          />
        </td>
        <td><b>{{ $t('kpi template') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('create employee kpi', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('read employee kpi', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('update employee kpi', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('delete employee kpi', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee kpi')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)"
          />
        </td>
        <td><b>{{ $t('kpi assessment') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('create employee assessment', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('read employee assessment', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('update employee assessment', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('delete employee assessment', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee assessment')"
          />
        </td>
        <td />
      </tr>
    </p-table>
    <button
      class="btn btn-primary"
      @click="save()"
    >
      SAVE
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    roleId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters('masterPermission', ['permissions'])
  },
  methods: {
    ...mapActions('masterPermission', ['update', 'bulkUpdate']),
    save () {
      this.$alert.success('Save Success')
    },
    togglePermission (permissionName) {
      var result = this.permissions.find((element) => {
        if (element.name === permissionName) {
          this.$refs[permissionName].togglePerm()
          return element
        }
      })
      if (result === undefined) {
        this.$refs[permissionName].togglePerm()
      }
      this.update({
        role_id: this.roleId,
        permission_name: permissionName
      })
    },
    togglePermissionRow (needle, haystack) {
      var self = this
      var result = needle.some(function (el, index) {
        var compare = haystack.some(function (el2, index2) {
          return el === el2
        })

        if (compare === false) {
          return false
        }

        if (needle.length == index + 1) {
          return true
        }
      })

      if (result) {
        self.bulkUpdate({
          role_id: self.roleId,
          permission_names: needle,
          action: 'revoke'
        })
      } else {
        self.bulkUpdate({
          role_id: self.roleId,
          permission_names: needle,
          action: 'give'
        })
      }
    },
    checkPermissionRow (needle, haystack) {
      var totalIndex = 0
      needle.some(function (el, index) {
        var compare = haystack.some(function (el2, index2) {
          return el === el2
        })
        totalIndex++
        if (compare === false) {
          return compare === false
        }
        return needle.length == (index + 1)
      })
      return totalIndex == needle.length
    }
  }
}
</script>
