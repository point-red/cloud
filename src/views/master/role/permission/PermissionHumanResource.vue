<template>
  <div>
    <h2 class="content-heading"><i class="si si-emoticon-smile fa-fw"></i> Human Resource</h2>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><i class="si si-emoticon-smile fa-fw"></i> Human Resource</td>
        <td><p-form-check-box ref="menu human resource" @click.native="togglePermission('menu human resource')" :checked="$rolePermission.has('menu human resource', permissions)" :description="'Menu'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)" :checked="checkPermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)" :description="''"/></td>
        <td><i class="si si-users fa-fw"></i> Employee</td>
        <td><p-form-check-box ref="create employee" @click.native="togglePermission('create employee')" :checked="$rolePermission.has('create employee', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read employee" @click.native="togglePermission('read employee')" :checked="$rolePermission.has('read employee', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update employee" @click.native="togglePermission('update employee')" :checked="$rolePermission.has('update employee', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete employee" @click.native="togglePermission('delete employee')" :checked="$rolePermission.has('delete employee', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)" :checked="checkPermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)" :description="''"/></td>
        <td><i class="si si-badge fa-fw"></i> KPI Template</td>
        <td><p-form-check-box ref="create employee kpi" @click.native="togglePermission('create employee kpi')" :checked="$rolePermission.has('create employee kpi', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read employee kpi" @click.native="togglePermission('read employee kpi')" :checked="$rolePermission.has('read employee kpi', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update employee kpi" @click.native="togglePermission('update employee kpi')" :checked="$rolePermission.has('update employee kpi', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete employee kpi" @click.native="togglePermission('delete employee kpi')" :checked="$rolePermission.has('delete employee kpi', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)" :checked="checkPermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)" :description="''"/></td>
        <td><i class="si si-note fa-fw"></i> KPI Assessment</td>
        <td><p-form-check-box ref="create employee assessment" @click.native="togglePermission('create employee assessment')" :checked="$rolePermission.has('create employee assessment', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read employee assessment" @click.native="togglePermission('read employee assessment')" :checked="$rolePermission.has('read employee assessment', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update employee assessment" @click.native="togglePermission('update employee assessment')" :checked="$rolePermission.has('update employee assessment', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete employee assessment" @click.native="togglePermission('delete employee assessment')" :checked="$rolePermission.has('delete employee assessment', permissions)" :description="'Delete'"/></td>
      </tr>
    </p-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    roleId: {
      required: true
    }
  },
  computed: {
    ...mapGetters('masterPermission', ['permissions'])
  },
  methods: {
    ...mapActions('masterPermission', ['update', 'bulkUpdate']),
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
