<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px" />
        <th>Feature</th>
        <th />
        <th />
        <th />
        <th />
        <th />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="menu human resource"
            :is-form="false"
            :checked="$rolePermission.has('menu human resource', permissions)"
            @click.native="togglePermission('menu human resource')"
          />
        </td>
        <td><b>{{ $t('human resource') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee', 'read employee', 'update employee', 'delete employee'], permissions)"
          />
        </td>
        <td><b>{{ $t('employee') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee"
            :is-form="false"
            :checked="$rolePermission.has('create employee', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee"
            :is-form="false"
            :checked="$rolePermission.has('read employee', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee"
            :is-form="false"
            :checked="$rolePermission.has('update employee', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee"
            :is-form="false"
            :checked="$rolePermission.has('delete employee', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box @click.native="togglePermissionRow(['create employee salary', 'read employee salary', 'update employee', 'delete employee'], permissions)" :checked="checkPermissionRow(['create employee', 'read employee', 'update employee salary', 'delete employee salary', 'print employee salary'], permissions)" :description="''"/></td>
        <td><i class="si si-users fa-fw"></i> Employee Salary</td>
        <td><p-form-check-box ref="create employee salary" @click.native="togglePermission('create employee salary')" :checked="$rolePermission.has('create employee salary', permissions)" :description="'Create'"/></td>
        <td><p-form-check-box ref="read employee salary" @click.native="togglePermission('read employee salary')" :checked="$rolePermission.has('read employee salary', permissions)" :description="'Read'"/></td>
        <td><p-form-check-box ref="update employee salary" @click.native="togglePermission('update employee salary')" :checked="$rolePermission.has('update employee salary', permissions)" :description="'Update'"/></td>
        <td><p-form-check-box ref="delete employee salary" @click.native="togglePermission('delete employee salary')" :checked="$rolePermission.has('delete employee salary', permissions)" :description="'Delete'"/></td>
        <td><p-form-check-box ref="export employee salary pdf" @click.native="togglePermission('export employee salary pdf')" :checked="$rolePermission.has('export employee salary pdf', permissions)" :description="'Export to PDF'"/></td>
        <td><p-form-check-box ref="export employee salary excel" @click.native="togglePermission('export employee salary excel')" :checked="$rolePermission.has('export employee salary excel', permissions)" :description="'Export to Excel'"/></td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="manage employee contract"
            :is-form="false"
            :checked="$rolePermission.has('manage employee contract', permissions)"
            @click.native="togglePermission('manage employee contract')"
          />
        </td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee kpi', 'read employee kpi', 'update employee kpi', 'delete employee kpi'], permissions)"
          />
        </td>
        <td><b>{{ $t('kpi template') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('create employee kpi', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('read employee kpi', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('update employee kpi', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee kpi')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee kpi"
            :is-form="false"
            :checked="$rolePermission.has('delete employee kpi', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee kpi')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create employee assessment', 'read employee assessment', 'update employee assessment', 'delete employee assessment'], permissions)"
          />
        </td>
        <td><b>{{ $t('kpi assessment') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('create employee assessment', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('read employee assessment', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('update employee assessment', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update employee assessment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete employee assessment"
            :is-form="false"
            :checked="$rolePermission.has('delete employee assessment', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete employee assessment')"
          />
        </td>
        <td />
      </tr>
    </p-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    roleId: {
      type: Number,
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
