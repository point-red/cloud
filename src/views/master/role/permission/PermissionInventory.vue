<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="menu inventory" @click.native="togglePermission('menu inventory')" :checked="$rolePermission.has('menu inventory', permissions)"/></td>
        <td><b>{{ $t('inventory') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create inventory audit', 'read inventory audit', 'update inventory audit', 'delete inventory audit'], permissions)" :checked="checkPermissionRow(['create inventory audit', 'read inventory audit', 'update inventory audit', 'delete inventory audit'], permissions)" :description="''"/></td>
        <td><b>{{ $t('inventory audit') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create inventory audit" @click.native="togglePermission('create inventory audit')" :checked="$rolePermission.has('create inventory audit', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read inventory audit" @click.native="togglePermission('read inventory audit')" :checked="$rolePermission.has('read inventory audit', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update inventory audit" @click.native="togglePermission('update inventory audit')" :checked="$rolePermission.has('update inventory audit', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete inventory audit" @click.native="togglePermission('delete inventory audit')" :checked="$rolePermission.has('delete inventory audit', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create stock correction', 'read stock correction', 'update stock correction', 'delete stock correction'], permissions)" :checked="checkPermissionRow(['create stock correction', 'read stock correction', 'update stock correction', 'delete stock correction'], permissions)" :description="''"/></td>
        <td><b>{{ $t('stock correction') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create stock correction" @click.native="togglePermission('create stock correction')" :checked="$rolePermission.has('create stock correction', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read stock correction" @click.native="togglePermission('read stock correction')" :checked="$rolePermission.has('read stock correction', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update stock correction" @click.native="togglePermission('update stock correction')" :checked="$rolePermission.has('update stock correction', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete stock correction" @click.native="togglePermission('delete stock correction')" :checked="$rolePermission.has('delete stock correction', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create transfer item', 'read transfer item', 'update transfer item', 'delete transfer item'], permissions)" :checked="checkPermissionRow(['create transfer item', 'read transfer item', 'update transfer item', 'delete transfer item'], permissions)" :description="''"/></td>
        <td><b>{{ $t('transfer item') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create transfer item" @click.native="togglePermission('create transfer item')" :checked="$rolePermission.has('create transfer item', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read transfer item" @click.native="togglePermission('read transfer item')" :checked="$rolePermission.has('read transfer item', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update transfer item" @click.native="togglePermission('update transfer item')" :checked="$rolePermission.has('update transfer item', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete transfer item" @click.native="togglePermission('delete transfer item')" :checked="$rolePermission.has('delete transfer item', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create inventory usage', 'read inventory usage', 'update inventory usage', 'delete inventory usage'], permissions)" :checked="checkPermissionRow(['create inventory usage', 'read inventory usage', 'update inventory usage', 'delete inventory usage'], permissions)" :description="''"/></td>
        <td><b>{{ $t('inventory usage') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create inventory usage" @click.native="togglePermission('create inventory usage')" :checked="$rolePermission.has('create inventory usage', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read inventory usage" @click.native="togglePermission('read inventory usage')" :checked="$rolePermission.has('read inventory usage', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update inventory usage" @click.native="togglePermission('update inventory usage')" :checked="$rolePermission.has('update inventory usage', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete inventory usage" @click.native="togglePermission('delete inventory usage')" :checked="$rolePermission.has('delete inventory usage', permissions)" :description="'delete' | uppercase"/></td>
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
        haystack.some(function (el2, index2) {
          if (el === el2) {
            totalIndex++
          }
        })
      })
      return totalIndex == needle.length
    }
  }
}
</script>
