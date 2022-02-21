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
            ref="menu accounting"
            :is-form="false"
            :checked="$rolePermission.has('menu accounting', permissions)"
            @click.native="togglePermission('menu accounting')"
          />
        </td>
        <td><b>{{ $t('accounting') | uppercase }}</b></td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create chart of account', 'read chart of account', 'update chart of account', 'delete chart of account'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create chart of account', 'read chart of account', 'update chart of account', 'delete chart of account'], permissions)"
          />
        </td>
        <td><b>{{ $t('chart of account') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create chart of account"
            :is-form="false"
            :checked="$rolePermission.has('create chart of account', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create chart of account')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read chart of account"
            :is-form="false"
            :checked="$rolePermission.has('read chart of account', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read chart of account')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update chart of account"
            :is-form="false"
            :checked="$rolePermission.has('update chart of account', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update chart of account')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete chart of account"
            :is-form="false"
            :checked="$rolePermission.has('delete chart of account', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete chart of account')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create cut off', 'read cut off', 'update cut off', 'delete cut off'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['approve cut off', 'create cut off', 'read cut off', 'update cut off', 'delete cut off'], permissions)"
          />
        </td>
        <td><b>{{ $t('cut off') | uppercase }}</b></td>
        <!-- <td>
          <p-form-check-box
            ref="approve cut off"
            :is-form="false"
            :checked="$rolePermission.has('approve cut off', permissions)"
            :description="'approve' | uppercase"
            @click.native="togglePermission('approve cut off')"
          />
        </td> -->
        <td>
          <p-form-check-box
            ref="create cut off"
            :is-form="false"
            :checked="$rolePermission.has('create cut off', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create cut off')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read cut off"
            :is-form="false"
            :checked="$rolePermission.has('read cut off', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read cut off')"
          />
        </td>
        <!-- <td>
          <p-form-check-box
            ref="update cut off"
            :is-form="false"
            :checked="$rolePermission.has('update cut off', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update cut off')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete cut off"
            :is-form="false"
            :checked="$rolePermission.has('delete cut off', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete cut off')"
          />
        </td> -->
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create memo journal', 'read memo journal', 'update memo journal', 'delete memo journal'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create memo journal', 'read memo journal', 'update memo journal', 'delete memo journal'], permissions)"
          />
        </td>
        <td><b>{{ $t('memo journal') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create memo journal"
            :is-form="false"
            :checked="$rolePermission.has('create memo journal', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create memo journal')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read memo journal"
            :is-form="false"
            :checked="$rolePermission.has('read memo journal', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read memo journal')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update memo journal"
            :is-form="false"
            :checked="$rolePermission.has('update memo journal', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update memo journal')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete memo journal"
            :is-form="false"
            :checked="$rolePermission.has('delete memo journal', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete memo journal')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['read balance sheet', 'read profit and loss', 'read general ledger', 'read sub ledger', 'read trial balance', 'read ratio report'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['read balance sheet', 'read profit and loss', 'read general ledger', 'read sub ledger', 'read trial balance', 'read ratio report'], permissions)"
          />
        </td>
        <td><b>{{ $t('report') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="read balance sheet"
            :is-form="false"
            :checked="$rolePermission.has('read balance sheet', permissions)"
            :description="'balance sheet' | uppercase"
            @click.native="togglePermission('read balance sheet')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read profit and loss"
            :is-form="false"
            :checked="$rolePermission.has('read profit and loss', permissions)"
            :description="'profit & loss' | uppercase"
            @click.native="togglePermission('read profit and loss')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read general ledger"
            :is-form="false"
            :checked="$rolePermission.has('read general ledger', permissions)"
            :description="'general ledger' | uppercase"
            @click.native="togglePermission('read general ledger')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read sub ledger"
            :is-form="false"
            :checked="$rolePermission.has('read sub ledger', permissions)"
            :description="'sub ledger' | uppercase"
            @click.native="togglePermission('read sub ledger')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td />
        <td />
        <td>
          <p-form-check-box
            ref="read trial balance"
            :is-form="false"
            :checked="$rolePermission.has('read trial balance', permissions)"
            :description="'trial balance' | uppercase"
            @click.native="togglePermission('read trial balance')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read ratio report"
            :is-form="false"
            :checked="$rolePermission.has('read ratio report', permissions)"
            :description="'ratio report' | uppercase"
            @click.native="togglePermission('read ratio report')"
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
