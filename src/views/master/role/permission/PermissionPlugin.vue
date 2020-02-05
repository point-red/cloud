<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td>Plugin</td>
        <td><p-form-check-box ref="menu plugin" @click.native="togglePermission('menu plugin')" :checked="$rolePermission.has('menu plugin', permissions)" :description="'Menu'"/></td>
      </tr>
    </p-table>
    <h2 class="content-heading">{{ $t('scale weight') | uppercase }}</h2>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Scale Weight</b></td>
        <td><p-form-check-box ref="menu scale weight" @click.native="togglePermission('menu scale weight')" :checked="$rolePermission.has('menu scale weight', permissions)" :description="'Menu'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)" :checked="checkPermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)" :description="''"/></td>
        <td><b>Scale Weight - Truck</b></td>
        <td><p-form-check-box ref="create scale weight truck" @click.native="togglePermission('create scale weight truck')" :checked="$rolePermission.has('create scale weight truck', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read scale weight truck" @click.native="togglePermission('read scale weight truck')" :checked="$rolePermission.has('read scale weight truck', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update scale weight truck" @click.native="togglePermission('update scale weight truck')" :checked="$rolePermission.has('update scale weight truck', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete scale weight truck" @click.native="togglePermission('delete scale weight truck')" :checked="$rolePermission.has('delete scale weight truck', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)" :checked="checkPermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)" :description="''"/></td>
        <td><b>Scale Weight - Item</b></td>
        <td><p-form-check-box ref="create scale weight item" @click.native="togglePermission('create scale weight item')" :checked="$rolePermission.has('create scale weight item', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read scale weight item" @click.native="togglePermission('read scale weight item')" :checked="$rolePermission.has('read scale weight item', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update scale weight item" @click.native="togglePermission('update scale weight item')" :checked="$rolePermission.has('update scale weight item', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete scale weight item" @click.native="togglePermission('delete scale weight item')" :checked="$rolePermission.has('delete scale weight item', permissions)" :description="'Delete'"/></td>
      </tr>
    </p-table>
    <h2 class="content-heading">{{ $t('pin point') | uppercase }}</h2>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Pin Point</b></td>
        <td><p-form-check-box ref="menu pin point" @click.native="togglePermission('menu pin point')" :checked="$rolePermission.has('menu pin point', permissions)" :description="'Menu'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)" :checked="checkPermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)" :description="''"/></td>
        <td><b>Sales Visitation Form</b></td>
        <td><p-form-check-box ref="create pin point sales visitation form" @click.native="togglePermission('create pin point sales visitation form')" :checked="$rolePermission.has('create pin point sales visitation form', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read pin point sales visitation form" @click.native="togglePermission('read pin point sales visitation form')" :checked="$rolePermission.has('read pin point sales visitation form', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update pin point sales visitation form" @click.native="togglePermission('update pin point sales visitation form')" :checked="$rolePermission.has('update pin point sales visitation form', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete pin point sales visitation form" @click.native="togglePermission('delete pin point sales visitation form')" :checked="$rolePermission.has('delete pin point sales visitation form', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Sales Visitation Form Report</b></td>
        <td><p-form-check-box ref="read pin point sales visitation form report" @click.native="togglePermission('read pin point sales visitation form report')" :checked="$rolePermission.has('read pin point sales visitation form report', permissions)" :description="'Read'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Attendance Report</b></td>
        <td><p-form-check-box ref="read pin point attendance report" @click.native="togglePermission('read pin point attendance report')" :checked="$rolePermission.has('read pin point attendance report', permissions)" :description="'Read'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Sales Visitation Report</b></td>
        <td><p-form-check-box ref="read pin point sales visitation report" @click.native="togglePermission('read pin point sales visitation report')" :checked="$rolePermission.has('read pin point sales visitation report', permissions)" :description="'Read'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Notification Sales</b></td>
        <td><p-form-check-box ref="notification pin point sales" @click.native="togglePermission('notification pin point sales')" :checked="$rolePermission.has('notification pin point sales', permissions)" :description="'Read'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Notification Supervisor</b></td>
        <td><p-form-check-box ref="notification pin point supervisor" @click.native="togglePermission('notification pin point supervisor')" :checked="$rolePermission.has('notification pin point supervisor', permissions)" :description="'Read'"/></td>
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
