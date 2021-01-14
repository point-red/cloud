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
            ref="menu expedition"
            :is-form="false"
            :checked="$rolePermission.has('menu expedition', permissions)"
            @click.native="togglePermission('menu expedition')"
          />
        </td>
        <td><b>{{ $t('expedition') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create expedition order', 'read expedition order', 'update expedition order', 'delete expedition order'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create expedition order', 'read expedition order', 'update expedition order', 'delete expedition order'], permissions)"
          />
        </td>
        <td><b>{{ $t('expedition order') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create expedition order"
            :is-form="false"
            :checked="$rolePermission.has('create expedition order', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create expedition order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read expedition order"
            :is-form="false"
            :checked="$rolePermission.has('read expedition order', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read expedition order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update expedition order"
            :is-form="false"
            :checked="$rolePermission.has('update expedition order', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update expedition order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete expedition order"
            :is-form="false"
            :checked="$rolePermission.has('delete expedition order', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete expedition order')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create expedition down payment', 'read expedition down payment', 'update expedition down payment', 'delete expedition down payment'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create expedition down payment', 'read expedition down payment', 'update expedition down payment', 'delete expedition down payment'], permissions)"
          />
        </td>
        <td><b>{{ $t('down payment') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create expedition down payment"
            :is-form="false"
            :checked="$rolePermission.has('create expedition down payment', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create expedition down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read expedition down payment"
            :is-form="false"
            :checked="$rolePermission.has('read expedition down payment', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read expedition down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update expedition down payment"
            :is-form="false"
            :checked="$rolePermission.has('update expedition down payment', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update expedition down payment')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete expedition down payment"
            :is-form="false"
            :checked="$rolePermission.has('delete expedition down payment', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete expedition down payment')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create expedition invoice', 'read expedition invoice', 'update expedition invoice', 'delete expedition invoice'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create expedition invoice', 'read expedition invoice', 'update expedition invoice', 'delete expedition invoice'], permissions)"
          />
        </td>
        <td><b>{{ $t('invoice') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create expedition invoice"
            :is-form="false"
            :checked="$rolePermission.has('create expedition invoice', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create expedition invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read expedition invoice"
            :is-form="false"
            :checked="$rolePermission.has('read expedition invoice', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read expedition invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update expedition invoice"
            :is-form="false"
            :checked="$rolePermission.has('update expedition invoice', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update expedition invoice')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete expedition invoice"
            :is-form="false"
            :checked="$rolePermission.has('delete expedition invoice', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete expedition invoice')"
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
