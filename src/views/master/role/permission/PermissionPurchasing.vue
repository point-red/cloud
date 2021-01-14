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
            ref="menu purchase"
            :is-form="false"
            :checked="$rolePermission.has('menu purchase', permissions)"
            @click.native="togglePermission('menu purchase')"
          />
        </td>
        <td><b>{{ $t('purchasing') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase contract', 'read purchase contract', 'update purchase contract', 'delete purchase contract'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase contract', 'read purchase contract', 'update purchase contract', 'delete purchase contract'], permissions)"
          />
        </td>
        <td><b>{{ $t('contract') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase contract"
            :is-form="false"
            :checked="$rolePermission.has('create purchase contract', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase contract"
            :is-form="false"
            :checked="$rolePermission.has('read purchase contract', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase contract"
            :is-form="false"
            :checked="$rolePermission.has('update purchase contract', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase contract')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase contract"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase contract', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase contract')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase request', 'read purchase request', 'update purchase request', 'delete purchase request'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase request', 'read purchase request', 'update purchase request', 'delete purchase request'], permissions)"
          />
        </td>
        <td><b>{{ $t('purchase request') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase request"
            :is-form="false"
            :checked="$rolePermission.has('create purchase request', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase request')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase request"
            :is-form="false"
            :checked="$rolePermission.has('read purchase request', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase request')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase request"
            :is-form="false"
            :checked="$rolePermission.has('update purchase request', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase request')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase request"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase request', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase request')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase order', 'read purchase order', 'update purchase order', 'delete purchase order'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase order', 'read purchase order', 'update purchase order', 'delete purchase order'], permissions)"
          />
        </td>
        <td><b>{{ $t('purchase order') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase order"
            :is-form="false"
            :checked="$rolePermission.has('create purchase order', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase order"
            :is-form="false"
            :checked="$rolePermission.has('read purchase order', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase order"
            :is-form="false"
            :checked="$rolePermission.has('update purchase order', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase order"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase order', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase order')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase down payment', 'read purchase down payment', 'update purchase down payment', 'delete purchase down payment'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase down payment', 'read purchase down payment', 'update purchase down payment', 'delete purchase down payment'], permissions)"
          />
        </td>
        <td><b>{{ $t('down payment') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase down payment"
            :is-form="false"
            :checked="$rolePermission.has('create purchase down payment', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase down payment"
            :is-form="false"
            :checked="$rolePermission.has('read purchase down payment', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase down payment"
            :is-form="false"
            :checked="$rolePermission.has('update purchase down payment', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase down payment"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase down payment', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase down payment')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase receive', 'read purchase receive', 'update purchase receive', 'delete purchase receive'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase receive', 'read purchase receive', 'update purchase receive', 'delete purchase receive'], permissions)"
          />
        </td>
        <td><b>{{ $t('purchase receive') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase receive"
            :is-form="false"
            :checked="$rolePermission.has('create purchase receive', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase receive')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase receive"
            :is-form="false"
            :checked="$rolePermission.has('read purchase receive', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase receive')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase receive"
            :is-form="false"
            :checked="$rolePermission.has('update purchase receive', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase receive')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase receive"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase receive', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase receive')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase invoice', 'read purchase invoice', 'update purchase invoice', 'delete purchase invoice'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase invoice', 'read purchase invoice', 'update purchase invoice', 'delete purchase invoice'], permissions)"
          />
        </td>
        <td><b>{{ $t('invoice') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase invoice"
            :is-form="false"
            :checked="$rolePermission.has('create purchase invoice', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase invoice"
            :is-form="false"
            :checked="$rolePermission.has('read purchase invoice', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase invoice"
            :is-form="false"
            :checked="$rolePermission.has('update purchase invoice', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase invoice"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase invoice', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase invoice')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create purchase return', 'read purchase return', 'update purchase return', 'delete purchase return'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create purchase return', 'read purchase return', 'update purchase return', 'delete purchase return'], permissions)"
          />
        </td>
        <td><b>{{ $t('return') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create purchase return"
            :is-form="false"
            :checked="$rolePermission.has('create purchase return', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create purchase return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read purchase return"
            :is-form="false"
            :checked="$rolePermission.has('read purchase return', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read purchase return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update purchase return"
            :is-form="false"
            :checked="$rolePermission.has('update purchase return', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update purchase return')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete purchase return"
            :is-form="false"
            :checked="$rolePermission.has('delete purchase return', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete purchase return')"
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
