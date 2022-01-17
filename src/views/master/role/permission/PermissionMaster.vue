<template>
  <div>
    <p-table>
      <tr slot="p-head">
        <th width="5px" />
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="menu master"
            :is-form="false"
            :checked="$rolePermission.has('menu master', permissions)"
            @click.native="togglePermission('menu master')"
          />
        </td>
        <td><b>{{ $t('master') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)"
            @click.native="togglePermissionRow(['create user', 'read user', 'update user', 'delete user'], permissions)"
          />
        </td>
        <td><b>{{ $t('user') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create user"
            :is-form="false"
            :checked="$rolePermission.has('create user', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create user')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read user"
            :is-form="false"
            :checked="$rolePermission.has('read user', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read user')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update user"
            :is-form="false"
            :checked="$rolePermission.has('update user', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update user')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete user"
            :is-form="false"
            :checked="$rolePermission.has('delete user', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete user')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)"
            @click.native="togglePermissionRow(['create role', 'read role', 'update role', 'delete role'], permissions)"
          />
        </td>
        <td><b>{{ $t('role & permission') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create role"
            :is-form="false"
            :checked="$rolePermission.has('create role', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create role')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read role"
            :is-form="false"
            :checked="$rolePermission.has('read role', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read role')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update role"
            :is-form="false"
            :checked="$rolePermission.has('update role', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update role')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete role"
            :is-form="false"
            :checked="$rolePermission.has('delete role', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete role')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create branch', 'read branch', 'update branch', 'delete branch'], permissions)"
            @click.native="togglePermissionRow(['create branch', 'read branch', 'update branch', 'delete branch'], permissions)"
          />
        </td>
        <td><b>{{ $t('branch') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create branch"
            :is-form="false"
            :checked="$rolePermission.has('create branch', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create branch')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read branch"
            :is-form="false"
            :checked="$rolePermission.has('read branch', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read branch')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update branch"
            :is-form="false"
            :checked="$rolePermission.has('update branch', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update branch')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete branch"
            :is-form="false"
            :checked="$rolePermission.has('delete branch', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete branch')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)"
            @click.native="togglePermissionRow(['create customer', 'read customer', 'update customer', 'delete customer'], permissions)"
          />
        </td>
        <td><b>{{ $t('customer') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create customer"
            :is-form="false"
            :checked="$rolePermission.has('create customer', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create customer')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read customer"
            :is-form="false"
            :checked="$rolePermission.has('read customer', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read customer')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update customer"
            :is-form="false"
            :checked="$rolePermission.has('update customer', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update customer')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete customer"
            :is-form="false"
            :checked="$rolePermission.has('delete customer', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete customer')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create supplier', 'read supplier', 'update supplier', 'delete supplier'], permissions)"
            @click.native="togglePermissionRow(['create supplier', 'read supplier', 'update supplier', 'delete supplier'], permissions)"
          />
        </td>
        <td><b>{{ $t('supplier') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create supplier"
            :is-form="false"
            :checked="$rolePermission.has('create supplier', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create supplier')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read supplier"
            :is-form="false"
            :checked="$rolePermission.has('read supplier', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read supplier')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update supplier"
            :is-form="false"
            :checked="$rolePermission.has('update supplier', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update supplier')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete supplier"
            :is-form="false"
            :checked="$rolePermission.has('delete supplier', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete supplier')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create item', 'read item', 'update item', 'delete item'], permissions)"
            @click.native="togglePermissionRow(['create item', 'read item', 'update item', 'delete item'], permissions)"
          />
        </td>
        <td><b>{{ $t('item') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create item"
            :is-form="false"
            :checked="$rolePermission.has('create item', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read item"
            :is-form="false"
            :checked="$rolePermission.has('read item', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update item"
            :is-form="false"
            :checked="$rolePermission.has('update item', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete item"
            :is-form="false"
            :checked="$rolePermission.has('delete item', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete item')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create service', 'read service', 'update service', 'delete service'], permissions)"
            @click.native="togglePermissionRow(['create service', 'read service', 'update service', 'delete service'], permissions)"
          />
        </td>
        <td><b>{{ $t('service') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create service"
            :is-form="false"
            :checked="$rolePermission.has('create service', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create service')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read service"
            :is-form="false"
            :checked="$rolePermission.has('read service', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read service')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update service"
            :is-form="false"
            :checked="$rolePermission.has('update service', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update service')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete service"
            :is-form="false"
            :checked="$rolePermission.has('delete service', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete service')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create warehouse', 'read warehouse', 'update warehouse', 'delete warehouse'], permissions)"
            @click.native="togglePermissionRow(['create warehouse', 'read warehouse', 'update warehouse', 'delete warehouse'], permissions)"
          />
        </td>
        <td><b>{{ $t('warehouse') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create warehouse"
            :is-form="false"
            :checked="$rolePermission.has('create warehouse', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create warehouse')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read warehouse"
            :is-form="false"
            :checked="$rolePermission.has('read warehouse', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read warehouse')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update warehouse"
            :is-form="false"
            :checked="$rolePermission.has('update warehouse', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update warehouse')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete warehouse"
            :is-form="false"
            :checked="$rolePermission.has('delete warehouse', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete warehouse')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create allocation', 'read allocation', 'update allocation', 'delete allocation'], permissions)"
            @click.native="togglePermissionRow(['create allocation', 'read allocation', 'update allocation', 'delete allocation'], permissions)"
          />
        </td>
        <td><b>{{ $t('allocation') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create allocation"
            :is-form="false"
            :checked="$rolePermission.has('create allocation', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create allocation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read allocation"
            :is-form="false"
            :checked="$rolePermission.has('read allocation', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read allocation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update allocation"
            :is-form="false"
            :checked="$rolePermission.has('update allocation', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update allocation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete allocation"
            :is-form="false"
            :checked="$rolePermission.has('delete allocation', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete allocation')"
          />
        </td>
      </tr>

      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create fixed asset', 'read fixed asset', 'update fixed asset', 'delete fixed asset'], permissions)"
            @click.native="togglePermissionRow(['create fixed asset', 'read fixed asset', 'update fixed asset', 'delete fixed asset'], permissions)"
          />
        </td>
        <td><b>{{ $t('fixed asset') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create fixed asset"
            :is-form="false"
            :checked="$rolePermission.has('create fixed asset', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create fixed asset')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read fixed asset"
            :is-form="false"
            :checked="$rolePermission.has('read fixed asset', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read fixed asset')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update fixed asset"
            :is-form="false"
            :checked="$rolePermission.has('update fixed asset', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update fixed asset')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete fixed asset"
            :is-form="false"
            :checked="$rolePermission.has('delete fixed asset', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete fixed asset')"
          />
        </td>
      </tr>
    </p-table>

    <button
      class="btn btn-primary"
      @click="save()"
    >
      SAVE
    </button>
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
    save () {
      this.$alert.success('Save Success')
    },
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
