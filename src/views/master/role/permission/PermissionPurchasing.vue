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
        <td><p-form-check-box :is-form="false" ref="menu purchase" @click.native="togglePermission('menu purchase')" :checked="$rolePermission.has('menu purchase', permissions)"/></td>
        <td><b>{{ $t('purchasing') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase contract', 'read purchase contract', 'update purchase contract', 'delete purchase contract'], permissions)" :checked="checkPermissionRow(['create purchase contract', 'read purchase contract', 'update purchase contract', 'delete purchase contract'], permissions)" :description="''"/></td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase contract" @click.native="togglePermission('create purchase contract')" :checked="$rolePermission.has('create purchase contract', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase contract" @click.native="togglePermission('read purchase contract')" :checked="$rolePermission.has('read purchase contract', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase contract" @click.native="togglePermission('update purchase contract')" :checked="$rolePermission.has('update purchase contract', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase contract" @click.native="togglePermission('delete purchase contract')" :checked="$rolePermission.has('delete purchase contract', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase request', 'read purchase request', 'update purchase request', 'delete purchase request'], permissions)" :checked="checkPermissionRow(['create purchase request', 'read purchase request', 'update purchase request', 'delete purchase request'], permissions)" :description="''"/></td>
        <td><b>{{ $t('purchase request') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase request" @click.native="togglePermission('create purchase request')" :checked="$rolePermission.has('create purchase request', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase request" @click.native="togglePermission('read purchase request')" :checked="$rolePermission.has('read purchase request', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase request" @click.native="togglePermission('update purchase request')" :checked="$rolePermission.has('update purchase request', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase request" @click.native="togglePermission('delete purchase request')" :checked="$rolePermission.has('delete purchase request', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase order', 'read purchase order', 'update purchase order', 'delete purchase order'], permissions)" :checked="checkPermissionRow(['create purchase order', 'read purchase order', 'update purchase order', 'delete purchase order'], permissions)" :description="''"/></td>
        <td><b>{{ $t('purchase order') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase order" @click.native="togglePermission('create purchase order')" :checked="$rolePermission.has('create purchase order', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase order" @click.native="togglePermission('read purchase order')" :checked="$rolePermission.has('read purchase order', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase order" @click.native="togglePermission('update purchase order')" :checked="$rolePermission.has('update purchase order', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase order" @click.native="togglePermission('delete purchase order')" :checked="$rolePermission.has('delete purchase order', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase down payment', 'read purchase down payment', 'update purchase down payment', 'delete purchase down payment'], permissions)" :checked="checkPermissionRow(['create purchase down payment', 'read purchase down payment', 'update purchase down payment', 'delete purchase down payment'], permissions)" :description="''"/></td>
        <td><b>{{ $t('down payment') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase down payment" @click.native="togglePermission('create purchase down payment')" :checked="$rolePermission.has('create purchase down payment', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase down payment" @click.native="togglePermission('read purchase down payment')" :checked="$rolePermission.has('read purchase down payment', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase down payment" @click.native="togglePermission('update purchase down payment')" :checked="$rolePermission.has('update purchase down payment', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase down payment" @click.native="togglePermission('delete purchase down payment')" :checked="$rolePermission.has('delete purchase down payment', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase receive', 'read purchase receive', 'update purchase receive', 'delete purchase receive'], permissions)" :checked="checkPermissionRow(['create purchase receive', 'read purchase receive', 'update purchase receive', 'delete purchase receive'], permissions)" :description="''"/></td>
        <td><b>{{ $t('purchase receive') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase receive" @click.native="togglePermission('create purchase receive')" :checked="$rolePermission.has('create purchase receive', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase receive" @click.native="togglePermission('read purchase receive')" :checked="$rolePermission.has('read purchase receive', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase receive" @click.native="togglePermission('update purchase receive')" :checked="$rolePermission.has('update purchase receive', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase receive" @click.native="togglePermission('delete purchase receive')" :checked="$rolePermission.has('delete purchase receive', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase invoice', 'read purchase invoice', 'update purchase invoice', 'delete purchase invoice'], permissions)" :checked="checkPermissionRow(['create purchase invoice', 'read purchase invoice', 'update purchase invoice', 'delete purchase invoice'], permissions)" :description="''"/></td>
        <td><b>{{ $t('invoice') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase invoice" @click.native="togglePermission('create purchase invoice')" :checked="$rolePermission.has('create purchase invoice', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase invoice" @click.native="togglePermission('read purchase invoice')" :checked="$rolePermission.has('read purchase invoice', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase invoice" @click.native="togglePermission('update purchase invoice')" :checked="$rolePermission.has('update purchase invoice', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase invoice" @click.native="togglePermission('delete purchase invoice')" :checked="$rolePermission.has('delete purchase invoice', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create purchase return', 'read purchase return', 'update purchase return', 'delete purchase return'], permissions)" :checked="checkPermissionRow(['create purchase return', 'read purchase return', 'update purchase return', 'delete purchase return'], permissions)" :description="''"/></td>
        <td><b>{{ $t('return') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create purchase return" @click.native="togglePermission('create purchase return')" :checked="$rolePermission.has('create purchase return', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read purchase return" @click.native="togglePermission('read purchase return')" :checked="$rolePermission.has('read purchase return', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update purchase return" @click.native="togglePermission('update purchase return')" :checked="$rolePermission.has('update purchase return', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete purchase return" @click.native="togglePermission('delete purchase return')" :checked="$rolePermission.has('delete purchase return', permissions)" :description="'delete' | uppercase"/></td>
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
