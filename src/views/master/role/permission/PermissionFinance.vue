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
            ref="menu finance"
            :is-form="false"
            :checked="$rolePermission.has('menu finance', permissions)"
            @click.native="togglePermission('menu finance')"
          />
        </td>
        <td><b>{{ $t('finance') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create payment order', 'read payment order', 'update payment order', 'delete payment order'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create payment order', 'read payment order', 'update payment order', 'delete payment order'], permissions)"
          />
        </td>
        <td><b>{{ $t('payment order') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create payment order"
            :is-form="false"
            :checked="$rolePermission.has('create payment order', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create payment order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read payment order"
            :is-form="false"
            :checked="$rolePermission.has('read payment order', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read payment order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update payment order"
            :is-form="false"
            :checked="$rolePermission.has('update payment order', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update payment order')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete payment order"
            :is-form="false"
            :checked="$rolePermission.has('delete payment order', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete payment order')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create cash advance', 'read cash advance', 'update cash advance', 'delete cash advance'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create cash advance', 'read cash advance', 'update cash advance', 'delete cash advance'], permissions)"
          />
        </td>
        <td><b>{{ $t('cash advance') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create cash advance"
            :is-form="false"
            :checked="$rolePermission.has('create cash advance', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create cash advance')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read cash advance"
            :is-form="false"
            :checked="$rolePermission.has('read cash advance', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read cash advance')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update cash advance"
            :is-form="false"
            :checked="$rolePermission.has('update cash advance', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update cash advance')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete cash advance"
            :is-form="false"
            :checked="$rolePermission.has('delete cash advance', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete cash advance')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create cash', 'read cash', 'update cash', 'delete cash'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create cash', 'read cash', 'update cash', 'delete cash'], permissions)"
          />
        </td>
        <td><b>{{ $t('cash') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create cash"
            :is-form="false"
            :checked="$rolePermission.has('create cash', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create cash')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read cash"
            :is-form="false"
            :checked="$rolePermission.has('read cash', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read cash')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update cash"
            :is-form="false"
            :checked="$rolePermission.has('update cash', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update cash')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete cash"
            :is-form="false"
            :checked="$rolePermission.has('delete cash', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete cash')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create bank', 'read bank', 'update bank', 'delete bank'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create bank', 'read bank', 'update bank', 'delete bank'], permissions)"
          />
        </td>
        <td><b>{{ $t('bank') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create bank"
            :is-form="false"
            :checked="$rolePermission.has('create bank', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create bank')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read bank"
            :is-form="false"
            :checked="$rolePermission.has('read bank', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read bank')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update bank"
            :is-form="false"
            :checked="$rolePermission.has('update bank', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update bank')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete bank"
            :is-form="false"
            :checked="$rolePermission.has('delete bank', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete bank')"
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
