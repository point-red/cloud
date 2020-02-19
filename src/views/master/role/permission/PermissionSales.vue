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
        <td><p-form-check-box :is-form="false" ref="menu sales" @click.native="togglePermission('menu sales')" :checked="$rolePermission.has('menu sales', permissions)"/></td>
        <td><b>{{ $t('sales') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales contract', 'read sales contract', 'update sales contract', 'delete sales contract'], permissions)" :checked="checkPermissionRow(['create sales contract', 'read sales contract', 'update sales contract', 'delete sales contract'], permissions)" :description="''"/></td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales contract" @click.native="togglePermission('create sales contract')" :checked="$rolePermission.has('create sales contract', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales contract" @click.native="togglePermission('read sales contract')" :checked="$rolePermission.has('read sales contract', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales contract" @click.native="togglePermission('update sales contract')" :checked="$rolePermission.has('update sales contract', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales contract" @click.native="togglePermission('delete sales contract')" :checked="$rolePermission.has('delete sales contract', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales quotation', 'read sales quotation', 'update sales quotation', 'delete sales quotation'], permissions)" :checked="checkPermissionRow(['create sales quotation', 'read sales quotation', 'update sales quotation', 'delete sales quotation'], permissions)" :description="''"/></td>
        <td><b>{{ $t('quotation') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales quotation" @click.native="togglePermission('create sales quotation')" :checked="$rolePermission.has('create sales quotation', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales quotation" @click.native="togglePermission('read sales quotation')" :checked="$rolePermission.has('read sales quotation', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales quotation" @click.native="togglePermission('update sales quotation')" :checked="$rolePermission.has('update sales quotation', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales quotation" @click.native="togglePermission('delete sales quotation')" :checked="$rolePermission.has('delete sales quotation', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales order', 'read sales order', 'update sales order', 'delete sales order'], permissions)" :checked="checkPermissionRow(['create sales order', 'read sales order', 'update sales order', 'delete sales order'], permissions)" :description="''"/></td>
        <td><b>{{ $t('order') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales order" @click.native="togglePermission('create sales order')" :checked="$rolePermission.has('create sales order', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales order" @click.native="togglePermission('read sales order')" :checked="$rolePermission.has('read sales order', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales order" @click.native="togglePermission('update sales order')" :checked="$rolePermission.has('update sales order', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales order" @click.native="togglePermission('delete sales order')" :checked="$rolePermission.has('delete sales order', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales down payment', 'read sales down payment', 'update sales down payment', 'delete sales down payment'], permissions)" :checked="checkPermissionRow(['create sales down payment', 'read sales down payment', 'update sales down payment', 'delete sales down payment'], permissions)" :description="''"/></td>
        <td><b>{{ $t('down payment') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales down payment" @click.native="togglePermission('create sales down payment')" :checked="$rolePermission.has('create sales down payment', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales down payment" @click.native="togglePermission('read sales down payment')" :checked="$rolePermission.has('read sales down payment', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales down payment" @click.native="togglePermission('update sales down payment')" :checked="$rolePermission.has('update sales down payment', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales down payment" @click.native="togglePermission('delete sales down payment')" :checked="$rolePermission.has('delete sales down payment', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales delivery order', 'read sales delivery order', 'update sales delivery order', 'delete sales delivery order'], permissions)" :checked="checkPermissionRow(['create sales delivery order', 'read sales delivery order', 'update sales delivery order', 'delete sales delivery order'], permissions)" :description="''"/></td>
        <td><b>{{ $t('delivery order') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales delivery order" @click.native="togglePermission('create sales delivery order')" :checked="$rolePermission.has('create sales delivery order', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales delivery order" @click.native="togglePermission('read sales delivery order')" :checked="$rolePermission.has('read sales delivery order', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales delivery order" @click.native="togglePermission('update sales delivery order')" :checked="$rolePermission.has('update sales delivery order', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales delivery order" @click.native="togglePermission('delete sales delivery order')" :checked="$rolePermission.has('delete sales delivery order', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales delivery note', 'read sales delivery note', 'update sales delivery note', 'delete sales delivery note'], permissions)" :checked="checkPermissionRow(['create sales delivery note', 'read sales delivery note', 'update sales delivery note', 'delete sales delivery note'], permissions)" :description="''"/></td>
        <td><b>{{ $t('delivery note') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales delivery note" @click.native="togglePermission('create sales delivery note')" :checked="$rolePermission.has('create sales delivery note', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales delivery note" @click.native="togglePermission('read sales delivery note')" :checked="$rolePermission.has('read sales delivery note', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales delivery note" @click.native="togglePermission('update sales delivery note')" :checked="$rolePermission.has('update sales delivery note', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales delivery note" @click.native="togglePermission('delete sales delivery note')" :checked="$rolePermission.has('delete sales delivery note', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales invoice', 'read sales invoice', 'update sales invoice', 'delete sales invoice'], permissions)" :checked="checkPermissionRow(['create sales invoice', 'read sales invoice', 'update sales invoice', 'delete sales invoice'], permissions)" :description="''"/></td>
        <td><b>{{ $t('invoice') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales invoice" @click.native="togglePermission('create sales invoice')" :checked="$rolePermission.has('create sales invoice', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales invoice" @click.native="togglePermission('read sales invoice')" :checked="$rolePermission.has('read sales invoice', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales invoice" @click.native="togglePermission('update sales invoice')" :checked="$rolePermission.has('update sales invoice', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales invoice" @click.native="togglePermission('delete sales invoice')" :checked="$rolePermission.has('delete sales invoice', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create sales return', 'read sales return', 'update sales return', 'delete sales return'], permissions)" :checked="checkPermissionRow(['create sales return', 'read sales return', 'update sales return', 'delete sales return'], permissions)" :description="''"/></td>
        <td><b>{{ $t('return') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create sales return" @click.native="togglePermission('create sales return')" :checked="$rolePermission.has('create sales return', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read sales return" @click.native="togglePermission('read sales return')" :checked="$rolePermission.has('read sales return', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update sales return" @click.native="togglePermission('update sales return')" :checked="$rolePermission.has('update sales return', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete sales return" @click.native="togglePermission('delete sales return')" :checked="$rolePermission.has('delete sales return', permissions)" :description="'delete' | uppercase"/></td>
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
