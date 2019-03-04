<template>
  <div>
    <h2 class="content-heading"><i class="si si-layers fa-fw"></i> Master</h2>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><i class="si si-layers fa-fw"></i> Master</td>
        <td><p-form-check-box ref="menu master" @click.native="togglePermission('menu master')" :checked="$rolePermission.has('menu master', permissions)" :description="'Menu'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)" :checked="checkPermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)" :description="''"/></td>
        <td><i class="si si-users fa-fw"></i> User</td>
        <td><p-form-check-box ref="create user" @click.native="togglePermission('create user')" :checked="$rolePermission.has('create user', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read user" @click.native="togglePermission('read user')" :checked="$rolePermission.has('read user', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update user" @click.native="togglePermission('update user')" :checked="$rolePermission.has('update user', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete user" @click.native="togglePermission('delete user')" :checked="$rolePermission.has('delete user', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)" :checked="checkPermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)" :description="''"/></td>
        <td><i class="si si-equalizer fa-fw"></i> Role & Permission</td>
        <td><p-form-check-box ref="create role" @click.native="togglePermission('create role')" :checked="$rolePermission.has('create role', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read role" @click.native="togglePermission('read role')" :checked="$rolePermission.has('read role', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update role" @click.native="togglePermission('update role')" :checked="$rolePermission.has('update role', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete role" @click.native="togglePermission('delete role')" :checked="$rolePermission.has('delete role', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)" :checked="checkPermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)" :description="''"/></td>
        <td><i class="si si-customers fa-fw"></i> Customer</td>
        <td><p-form-check-box ref="create customer" @click.native="togglePermission('create customer')" :checked="$rolePermission.has('create customer', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read customer" @click.native="togglePermission('read customer')" :checked="$rolePermission.has('read customer', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update customer" @click.native="togglePermission('update customer')" :checked="$rolePermission.has('update customer', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete customer" @click.native="togglePermission('delete customer')" :checked="$rolePermission.has('delete customer', permissions)" :description="'Delete'"/></td>
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
    ...mapGetters('Permission', ['permissions'])
  },
  methods: {
    ...mapActions('Permission', ['update', 'bulkUpdate']),
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
