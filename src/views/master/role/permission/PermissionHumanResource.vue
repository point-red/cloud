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
        <th></th>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="menu human resource" @click.native="togglePermission('menu human resource')" :checked="$rolePermission.has('menu human resource', permissions)"/></td>
        <td><b>{{ $t('human resource') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)" :checked="checkPermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)" :description="''"/></td>
        <td><b>{{ $t('employee') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create employee" @click.native="togglePermission('create employee')" :checked="$rolePermission.has('create employee', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read employee" @click.native="togglePermission('read employee')" :checked="$rolePermission.has('read employee', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update employee" @click.native="togglePermission('update employee')" :checked="$rolePermission.has('update employee', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete employee" @click.native="togglePermission('delete employee')" :checked="$rolePermission.has('delete employee', permissions)" :description="'delete' | uppercase"/></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create employee salary', 'read employee salary', 'update employee salary', 'delete employee salary', 'print employee salary'], permissions)" :checked="checkPermissionRow(['create employee salary', 'read employee salary', 'update employee salary', 'delete employee salary', 'print employee salary'], permissions)" :description="''"/></td>
        <td><b>{{ $t('salary') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create employee salary" @click.native="togglePermission('create employee salary')" :checked="$rolePermission.has('create employee salary', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read employee salary" @click.native="togglePermission('read employee salary')" :checked="$rolePermission.has('read employee salary', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update employee salary" @click.native="togglePermission('update employee salary')" :checked="$rolePermission.has('update employee salary', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete employee salary" @click.native="togglePermission('delete employee salary')" :checked="$rolePermission.has('delete employee salary', permissions)" :description="'delete' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="print employee salary" @click.native="togglePermission('print employee salary')" :checked="$rolePermission.has('print employee salary', permissions)" :description="'print' | uppercase"/></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="manage employee contract" @click.native="togglePermission('manage employee contract')" :checked="$rolePermission.has('manage employee contract', permissions)"/></td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)" :checked="checkPermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)" :description="''"/></td>
        <td><b>{{ $t('kpi template') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create employee kpi" @click.native="togglePermission('create employee kpi')" :checked="$rolePermission.has('create employee kpi', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read employee kpi" @click.native="togglePermission('read employee kpi')" :checked="$rolePermission.has('read employee kpi', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update employee kpi" @click.native="togglePermission('update employee kpi')" :checked="$rolePermission.has('update employee kpi', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete employee kpi" @click.native="togglePermission('delete employee kpi')" :checked="$rolePermission.has('delete employee kpi', permissions)" :description="'delete' | uppercase"/></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)" :checked="checkPermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)" :description="''"/></td>
        <td><b>{{ $t('kpi assessment') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create employee assessment" @click.native="togglePermission('create employee assessment')" :checked="$rolePermission.has('create employee assessment', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read employee assessment" @click.native="togglePermission('read employee assessment')" :checked="$rolePermission.has('read employee assessment', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update employee assessment" @click.native="togglePermission('update employee assessment')" :checked="$rolePermission.has('update employee assessment', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete employee assessment" @click.native="togglePermission('delete employee assessment')" :checked="$rolePermission.has('delete employee assessment', permissions)" :description="'delete' | uppercase"/></td>
        <td></td>
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
