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
            ref="menu inventory"
            :is-form="false"
            :checked="$rolePermission.has('menu inventory', permissions)"
            @click.native="togglePermission('menu inventory')"
          />
        </td>
        <td><b>{{ $t('inventory') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create inventory audit', 'read inventory audit', 'update inventory audit', 'delete inventory audit'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create inventory audit', 'read inventory audit', 'update inventory audit', 'delete inventory audit'], permissions)"
          />
        </td>
        <td><b>{{ $t('inventory audit') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create inventory audit"
            :is-form="false"
            :checked="$rolePermission.has('create inventory audit', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create inventory audit')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read inventory audit"
            :is-form="false"
            :checked="$rolePermission.has('read inventory audit', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read inventory audit')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update inventory audit"
            :is-form="false"
            :checked="$rolePermission.has('update inventory audit', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update inventory audit')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete inventory audit"
            :is-form="false"
            :checked="$rolePermission.has('delete inventory audit', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete inventory audit')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create stock correction', 'read stock correction', 'update stock correction', 'delete stock correction'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create stock correction', 'read stock correction', 'update stock correction', 'delete stock correction'], permissions)"
          />
        </td>
        <td><b>{{ $t('stock correction') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create stock correction"
            :is-form="false"
            :checked="$rolePermission.has('create stock correction', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create stock correction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read stock correction"
            :is-form="false"
            :checked="$rolePermission.has('read stock correction', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read stock correction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update stock correction"
            :is-form="false"
            :checked="$rolePermission.has('update stock correction', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update stock correction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete stock correction"
            :is-form="false"
            :checked="$rolePermission.has('delete stock correction', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete stock correction')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create transfer item', 'read transfer item', 'update transfer item', 'delete transfer item'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create transfer item', 'read transfer item', 'update transfer item', 'delete transfer item'], permissions)"
          />
        </td>
        <td><b>{{ $t('transfer item') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create transfer item"
            :is-form="false"
            :checked="$rolePermission.has('create transfer item', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create transfer item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read transfer item"
            :is-form="false"
            :checked="$rolePermission.has('read transfer item', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read transfer item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update transfer item"
            :is-form="false"
            :checked="$rolePermission.has('update transfer item', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update transfer item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete transfer item"
            :is-form="false"
            :checked="$rolePermission.has('delete transfer item', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete transfer item')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create inventory usage', 'read inventory usage', 'update inventory usage', 'delete inventory usage'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create inventory usage', 'read inventory usage', 'update inventory usage', 'delete inventory usage'], permissions)"
          />
        </td>
        <td><b>{{ $t('inventory usage') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create inventory usage"
            :is-form="false"
            :checked="$rolePermission.has('create inventory usage', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create inventory usage')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read inventory usage"
            :is-form="false"
            :checked="$rolePermission.has('read inventory usage', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read inventory usage')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update inventory usage"
            :is-form="false"
            :checked="$rolePermission.has('update inventory usage', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update inventory usage')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete inventory usage"
            :is-form="false"
            :checked="$rolePermission.has('delete inventory usage', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete inventory usage')"
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
