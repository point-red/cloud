<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="menu master" @click.native="togglePermission('menu master')" :checked="$rolePermission.has('menu master', permissions)"/></td>
        <td><b>{{ $t('master') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)" :checked="checkPermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)"/></td>
        <td><b>{{ $t('user') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create user" @click.native="togglePermission('create user')" :checked="$rolePermission.has('create user', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read user" @click.native="togglePermission('read user')" :checked="$rolePermission.has('read user', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update user" @click.native="togglePermission('update user')" :checked="$rolePermission.has('update user', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete user" @click.native="togglePermission('delete user')" :checked="$rolePermission.has('delete user', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)" :checked="checkPermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)"/></td>
        <td><b>{{ $t('role & permission') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create role" @click.native="togglePermission('create role')" :checked="$rolePermission.has('create role', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read role" @click.native="togglePermission('read role')" :checked="$rolePermission.has('read role', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update role" @click.native="togglePermission('update role')" :checked="$rolePermission.has('update role', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete role" @click.native="togglePermission('delete role')" :checked="$rolePermission.has('delete role', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)" :checked="checkPermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)"/></td>
        <td><b>{{ $t('customer') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create customer" @click.native="togglePermission('create customer')" :checked="$rolePermission.has('create customer', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read customer" @click.native="togglePermission('read customer')" :checked="$rolePermission.has('read customer', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update customer" @click.native="togglePermission('update customer')" :checked="$rolePermission.has('update customer', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete customer" @click.native="togglePermission('delete customer')" :checked="$rolePermission.has('delete customer', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create supplier', 'read supplier', 'update supplier', 'delete supplier'], permissions)" :checked="checkPermissionRow(['create supplier', 'read supplier', 'update supplier', 'delete supplier'], permissions)"/></td>
        <td><b>{{ $t('supplier') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create supplier" @click.native="togglePermission('create supplier')" :checked="$rolePermission.has('create supplier', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read supplier" @click.native="togglePermission('read supplier')" :checked="$rolePermission.has('read supplier', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update supplier" @click.native="togglePermission('update supplier')" :checked="$rolePermission.has('update supplier', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete supplier" @click.native="togglePermission('delete supplier')" :checked="$rolePermission.has('delete supplier', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create item', 'read item', 'update item', 'delete item'], permissions)" :checked="checkPermissionRow(['create item', 'read item', 'update item', 'delete item'], permissions)"/></td>
        <td><b>{{ $t('item') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create item" @click.native="togglePermission('create item')" :checked="$rolePermission.has('create item', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read item" @click.native="togglePermission('read item')" :checked="$rolePermission.has('read item', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update item" @click.native="togglePermission('update item')" :checked="$rolePermission.has('update item', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete item" @click.native="togglePermission('delete item')" :checked="$rolePermission.has('delete item', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create service', 'read service', 'update service', 'delete service'], permissions)" :checked="checkPermissionRow(['create service', 'read service', 'update service', 'delete service'], permissions)"/></td>
        <td><b>{{ $t('service') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create service" @click.native="togglePermission('create service')" :checked="$rolePermission.has('create service', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read service" @click.native="togglePermission('read service')" :checked="$rolePermission.has('read service', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update service" @click.native="togglePermission('update service')" :checked="$rolePermission.has('update service', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete service" @click.native="togglePermission('delete service')" :checked="$rolePermission.has('delete service', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create warehouse', 'read warehouse', 'update warehouse', 'delete warehouse'], permissions)" :checked="checkPermissionRow(['create warehouse', 'read warehouse', 'update warehouse', 'delete warehouse'], permissions)"/></td>
        <td><b>{{ $t('warehouse') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create warehouse" @click.native="togglePermission('create warehouse')" :checked="$rolePermission.has('create warehouse', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read warehouse" @click.native="togglePermission('read warehouse')" :checked="$rolePermission.has('read warehouse', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update warehouse" @click.native="togglePermission('update warehouse')" :checked="$rolePermission.has('update warehouse', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete warehouse" @click.native="togglePermission('delete warehouse')" :checked="$rolePermission.has('delete warehouse', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create allocation', 'read allocation', 'update allocation', 'delete allocation'], permissions)" :checked="checkPermissionRow(['create allocation', 'read allocation', 'update allocation', 'delete allocation'], permissions)"/></td>
        <td><b>{{ $t('allocation') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create allocation" @click.native="togglePermission('create allocation')" :checked="$rolePermission.has('create allocation', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read allocation" @click.native="togglePermission('read allocation')" :checked="$rolePermission.has('read allocation', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update allocation" @click.native="togglePermission('update allocation')" :checked="$rolePermission.has('update allocation', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete allocation" @click.native="togglePermission('delete allocation')" :checked="$rolePermission.has('delete allocation', permissions)" :description="'delete' | uppercase"/></td>
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
