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
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="menu manufacture" @click.native="togglePermission('menu manufacture')" :checked="$rolePermission.has('menu manufacture', permissions)"/></td>
        <td><b>{{ $t('manufacture') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create manufacture', 'read manufacture', 'update manufacture', 'delete manufacture'], permissions)" :checked="checkPermissionRow(['create manufacture', 'read manufacture', 'update manufacture', 'delete manufacture'], permissions)" :description="''"/></td>
        <td><b>{{ $t('production') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create manufacture" @click.native="togglePermission('create manufacture')" :checked="$rolePermission.has('create manufacture', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read manufacture" @click.native="togglePermission('read manufacture')" :checked="$rolePermission.has('read manufacture', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update manufacture" @click.native="togglePermission('update manufacture')" :checked="$rolePermission.has('update manufacture', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete manufacture" @click.native="togglePermission('delete manufacture')" :checked="$rolePermission.has('delete manufacture', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create manufacture machine', 'read manufacture machine', 'update manufacture machine', 'delete manufacture machine'], permissions)" :checked="checkPermissionRow(['create manufacture machine', 'read manufacture machine', 'update manufacture machine', 'delete manufacture machine'], permissions)" :description="''"/></td>
        <td><b>{{ $t('machine') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create manufacture machine" @click.native="togglePermission('create manufacture machine')" :checked="$rolePermission.has('create manufacture machine', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read manufacture machine" @click.native="togglePermission('read manufacture machine')" :checked="$rolePermission.has('read manufacture machine', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update manufacture machine" @click.native="togglePermission('update manufacture machine')" :checked="$rolePermission.has('update manufacture machine', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete manufacture machine" @click.native="togglePermission('delete manufacture machine')" :checked="$rolePermission.has('delete manufacture machine', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create manufacture process', 'read manufacture process', 'update manufacture process', 'delete manufacture process'], permissions)" :checked="checkPermissionRow(['create manufacture process', 'read manufacture process', 'update manufacture process', 'delete manufacture process'], permissions)" :description="''"/></td>
        <td><b>{{ $t('process') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create manufacture process" @click.native="togglePermission('create manufacture process')" :checked="$rolePermission.has('create manufacture process', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read manufacture process" @click.native="togglePermission('read manufacture process')" :checked="$rolePermission.has('read manufacture process', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update manufacture process" @click.native="togglePermission('update manufacture process')" :checked="$rolePermission.has('update manufacture process', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete manufacture process" @click.native="togglePermission('delete manufacture process')" :checked="$rolePermission.has('delete manufacture process', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create manufacture formula', 'read manufacture formula', 'update manufacture formula', 'delete manufacture formula'], permissions)" :checked="checkPermissionRow(['create manufacture formula', 'read manufacture formula', 'update manufacture formula', 'delete manufacture formula'], permissions)" :description="''"/></td>
        <td><b>{{ $t('formula') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create manufacture formula" @click.native="togglePermission('create manufacture formula')" :checked="$rolePermission.has('create manufacture formula', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read manufacture formula" @click.native="togglePermission('read manufacture formula')" :checked="$rolePermission.has('read manufacture formula', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update manufacture formula" @click.native="togglePermission('update manufacture formula')" :checked="$rolePermission.has('update manufacture formula', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete manufacture formula" @click.native="togglePermission('delete manufacture formula')" :checked="$rolePermission.has('delete manufacture formula', permissions)" :description="'delete' | uppercase"/></td>
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
