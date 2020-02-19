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
        <td><p-form-check-box :is-form="false" ref="menu finance" @click.native="togglePermission('menu finance')" :checked="$rolePermission.has('menu finance', permissions)"/></td>
        <td><b>{{ $t('finance') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create payment order', 'read payment order', 'update payment order', 'delete payment order'], permissions)" :checked="checkPermissionRow(['create payment order', 'read payment order', 'update payment order', 'delete payment order'], permissions)" :description="''"/></td>
        <td><b>{{ $t('payment order') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create payment order" @click.native="togglePermission('create payment order')" :checked="$rolePermission.has('create payment order', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read payment order" @click.native="togglePermission('read payment order')" :checked="$rolePermission.has('read payment order', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update payment order" @click.native="togglePermission('update payment order')" :checked="$rolePermission.has('update payment order', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete payment order" @click.native="togglePermission('delete payment order')" :checked="$rolePermission.has('delete payment order', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create cash advance', 'read cash advance', 'update cash advance', 'delete cash advance'], permissions)" :checked="checkPermissionRow(['create cash advance', 'read cash advance', 'update cash advance', 'delete cash advance'], permissions)" :description="''"/></td>
        <td><b>{{ $t('cash advance') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create cash advance" @click.native="togglePermission('create cash advance')" :checked="$rolePermission.has('create cash advance', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read cash advance" @click.native="togglePermission('read cash advance')" :checked="$rolePermission.has('read cash advance', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update cash advance" @click.native="togglePermission('update cash advance')" :checked="$rolePermission.has('update cash advance', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete cash advance" @click.native="togglePermission('delete cash advance')" :checked="$rolePermission.has('delete cash advance', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create cash', 'read cash', 'update cash', 'delete cash'], permissions)" :checked="checkPermissionRow(['create cash', 'read cash', 'update cash', 'delete cash'], permissions)" :description="''"/></td>
        <td><b>{{ $t('cash') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create cash" @click.native="togglePermission('create cash')" :checked="$rolePermission.has('create cash', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read cash" @click.native="togglePermission('read cash')" :checked="$rolePermission.has('read cash', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update cash" @click.native="togglePermission('update cash')" :checked="$rolePermission.has('update cash', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete cash" @click.native="togglePermission('delete cash')" :checked="$rolePermission.has('delete cash', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create bank', 'read bank', 'update bank', 'delete bank'], permissions)" :checked="checkPermissionRow(['create bank', 'read bank', 'update bank', 'delete bank'], permissions)" :description="''"/></td>
        <td><b>{{ $t('bank') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create bank" @click.native="togglePermission('create bank')" :checked="$rolePermission.has('create bank', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read bank" @click.native="togglePermission('read bank')" :checked="$rolePermission.has('read bank', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update bank" @click.native="togglePermission('update bank')" :checked="$rolePermission.has('update bank', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete bank" @click.native="togglePermission('delete bank')" :checked="$rolePermission.has('delete bank', permissions)" :description="'delete' | uppercase"/></td>
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
