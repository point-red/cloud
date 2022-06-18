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
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="menu sales"
            :is-form="false"
            :checked="$rolePermission.has('menu sales', permissions)"
            @click.native="togglePermission('menu sales')"
          />
        </td>
        <td><b>{{ $t('sales') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales contract', 'read sales contract', 'update sales contract', 'delete sales contract'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales contract', 'read sales contract', 'update sales contract', 'delete sales contract'], permissions)"
          />
        </td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales contract"
            :is-form="false"
            :checked="$rolePermission.has('create sales contract', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales contract"
            :is-form="false"
            :checked="$rolePermission.has('read sales contract', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales contract"
            :is-form="false"
            :checked="$rolePermission.has('update sales contract', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales contract"
            :is-form="false"
            :checked="$rolePermission.has('delete sales contract', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales contract')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales quotation', 'read sales quotation', 'update sales quotation', 'delete sales quotation'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales quotation', 'read sales quotation', 'update sales quotation', 'delete sales quotation'], permissions)"
          />
        </td>
        <td><b>{{ $t('sales quotation') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales quotation"
            :is-form="false"
            :checked="$rolePermission.has('create sales quotation', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales quotation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales quotation"
            :is-form="false"
            :checked="$rolePermission.has('read sales quotation', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales quotation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales quotation"
            :is-form="false"
            :checked="$rolePermission.has('update sales quotation', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales quotation')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales quotation"
            :is-form="false"
            :checked="$rolePermission.has('delete sales quotation', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales quotation')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales order', 'read sales order', 'update sales order', 'delete sales order'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales order', 'read sales order', 'update sales order', 'delete sales order'], permissions)"
          />
        </td>
        <td><b>{{ $t('sales order') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales order"
            :is-form="false"
            :checked="$rolePermission.has('create sales order', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales order"
            :is-form="false"
            :checked="$rolePermission.has('read sales order', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales order"
            :is-form="false"
            :checked="$rolePermission.has('update sales order', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales order"
            :is-form="false"
            :checked="$rolePermission.has('delete sales order', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales order')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales down payment', 'read sales down payment', 'update sales down payment', 'delete sales down payment'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales down payment', 'read sales down payment', 'update sales down payment', 'delete sales down payment'], permissions)"
          />
        </td>
        <td><b>{{ $t('down payment') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales down payment"
            :is-form="false"
            :checked="$rolePermission.has('create sales down payment', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales down payment"
            :is-form="false"
            :checked="$rolePermission.has('read sales down payment', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales down payment"
            :is-form="false"
            :checked="$rolePermission.has('update sales down payment', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales down payment"
            :is-form="false"
            :checked="$rolePermission.has('delete sales down payment', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales down payment')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales delivery order', 'read sales delivery order', 'update sales delivery order', 'delete sales delivery order'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales delivery order', 'read sales delivery order', 'update sales delivery order', 'delete sales delivery order'], permissions)"
          />
        </td>
        <td><b>{{ $t('delivery order') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales delivery order"
            :is-form="false"
            :checked="$rolePermission.has('create sales delivery order', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales delivery order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales delivery order"
            :is-form="false"
            :checked="$rolePermission.has('read sales delivery order', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales delivery order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales delivery order"
            :is-form="false"
            :checked="$rolePermission.has('update sales delivery order', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales delivery order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales delivery order"
            :is-form="false"
            :checked="$rolePermission.has('delete sales delivery order', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales delivery order')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales delivery note', 'read sales delivery note', 'update sales delivery note', 'delete sales delivery note'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales delivery note', 'read sales delivery note', 'update sales delivery note', 'delete sales delivery note'], permissions)"
          />
        </td>
        <td><b>{{ $t('delivery note') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales delivery note"
            :is-form="false"
            :checked="$rolePermission.has('create sales delivery note', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales delivery note')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales delivery note"
            :is-form="false"
            :checked="$rolePermission.has('read sales delivery note', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales delivery note')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales delivery note"
            :is-form="false"
            :checked="$rolePermission.has('update sales delivery note', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales delivery note')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales delivery note"
            :is-form="false"
            :checked="$rolePermission.has('delete sales delivery note', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales delivery note')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales invoice', 'read sales invoice', 'update sales invoice', 'delete sales invoice'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales invoice', 'read sales invoice', 'update sales invoice', 'delete sales invoice'], permissions)"
          />
        </td>
        <td><b>{{ $t('invoice') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales invoice"
            :is-form="false"
            :checked="$rolePermission.has('create sales invoice', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales invoice"
            :is-form="false"
            :checked="$rolePermission.has('read sales invoice', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales invoice"
            :is-form="false"
            :checked="$rolePermission.has('update sales invoice', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales invoice"
            :is-form="false"
            :checked="$rolePermission.has('delete sales invoice', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales invoice')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create sales return', 'read sales return', 'update sales return', 'delete sales return'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create sales return', 'read sales return', 'update sales return', 'delete sales return'], permissions)"
          />
        </td>
        <td><b>{{ $t('return') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create sales return"
            :is-form="false"
            :checked="$rolePermission.has('create sales return', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create sales return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sales return"
            :is-form="false"
            :checked="$rolePermission.has('read sales return', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read sales return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update sales return"
            :is-form="false"
            :checked="$rolePermission.has('update sales return', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update sales return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete sales return"
            :is-form="false"
            :checked="$rolePermission.has('delete sales return', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete sales return')"
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
      this.$notification.success('result')
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
