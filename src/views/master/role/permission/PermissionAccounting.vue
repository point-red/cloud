<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>Accounting</b></td>
        <td><p-form-check-box :is-form="false" ref="menu accounting" @click.native="togglePermission('menu accounting')" :checked="$rolePermission.has('menu accounting', permissions)" :description="'Menu'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create chart of account', 'read chart of account', 'update chart of account', 'delete chart of account'], permissions)" :checked="checkPermissionRow(['create chart of account', 'read chart of account', 'update chart of account', 'delete chart of account'], permissions)" :description="''"/></td>
        <td><b>Chart of Account</b></td>
        <td><p-form-check-box :is-form="false" ref="create chart of account" @click.native="togglePermission('create chart of account')" :checked="$rolePermission.has('create chart of account', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box :is-form="false" ref="read chart of account" @click.native="togglePermission('read chart of account')" :checked="$rolePermission.has('read chart of account', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box :is-form="false" ref="update chart of account" @click.native="togglePermission('update chart of account')" :checked="$rolePermission.has('update chart of account', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box :is-form="false" ref="delete chart of account" @click.native="togglePermission('delete chart of account')" :checked="$rolePermission.has('delete chart of account', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create cut off', 'read cut off', 'update cut off', 'delete cut off'], permissions)" :checked="checkPermissionRow(['create cut off', 'read cut off', 'update cut off', 'delete cut off'], permissions)" :description="''"/></td>
        <td><b>Cut Off</b></td>
        <td><p-form-check-box :is-form="false" ref="create cut off" @click.native="togglePermission('create cut off')" :checked="$rolePermission.has('create cut off', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box :is-form="false" ref="read cut off" @click.native="togglePermission('read cut off')" :checked="$rolePermission.has('read cut off', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box :is-form="false" ref="update cut off" @click.native="togglePermission('update cut off')" :checked="$rolePermission.has('update cut off', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box :is-form="false" ref="delete cut off" @click.native="togglePermission('delete cut off')" :checked="$rolePermission.has('delete cut off', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create memo journal', 'read memo journal', 'update memo journal', 'delete memo journal'], permissions)" :checked="checkPermissionRow(['create memo journal', 'read memo journal', 'update memo journal', 'delete memo journal'], permissions)" :description="''"/></td>
        <td><b>Memo Journal</b></td>
        <td><p-form-check-box :is-form="false" ref="create memo journal" @click.native="togglePermission('create memo journal')" :checked="$rolePermission.has('create memo journal', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box :is-form="false" ref="read memo journal" @click.native="togglePermission('read memo journal')" :checked="$rolePermission.has('read memo journal', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box :is-form="false" ref="update memo journal" @click.native="togglePermission('update memo journal')" :checked="$rolePermission.has('update memo journal', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box :is-form="false" ref="delete memo journal" @click.native="togglePermission('delete memo journal')" :checked="$rolePermission.has('delete memo journal', permissions)" :description="'Delete'"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false"
          @click.native="togglePermissionRow(['read balance sheet', 'read profit and loss', 'read general ledger', 'read sub ledger', 'read trial balance', 'read ratio report'], permissions)"
          :checked="checkPermissionRow(['read balance sheet', 'read profit and loss', 'read general ledger', 'read sub ledger', 'read trial balance', 'read ratio report'], permissions)" :description="''"/></td>
        <td><b>Report</b></td>
        <td><p-form-check-box :is-form="false" ref="read balance sheet" @click.native="togglePermission('read balance sheet')" :checked="$rolePermission.has('read balance sheet', permissions)" :description="'Balance Sheet'"/></td>
        <td><p-form-check-box :is-form="false" ref="read profit and loss" @click.native="togglePermission('read profit and loss')" :checked="$rolePermission.has('read profit and loss', permissions)" :description="'Profit & Loss'"/></td>
        <td><p-form-check-box :is-form="false" ref="read general ledger" @click.native="togglePermission('read general ledger')" :checked="$rolePermission.has('read general ledger', permissions)" :description="'General Ledger'"/></td>
        <td><p-form-check-box :is-form="false" ref="read sub ledger" @click.native="togglePermission('read sub ledger')" :checked="$rolePermission.has('read sub ledger', permissions)" :description="'Sub Ledger'"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td></td>
        <td><p-form-check-box :is-form="false" ref="read trial balance" @click.native="togglePermission('read trial balance')" :checked="$rolePermission.has('read trial balance', permissions)" :description="'Trial Balance'"/></td>
        <td><p-form-check-box :is-form="false" ref="read ratio report" @click.native="togglePermission('read ratio report')" :checked="$rolePermission.has('read ratio report', permissions)" :description="'Ratio Report'"/></td>
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
