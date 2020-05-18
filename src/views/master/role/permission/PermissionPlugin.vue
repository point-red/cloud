<template>
  <div>
    <h5 class="content-heading">{{ $t('plugin') | uppercase }}</h5>
    <p-table>
      <tr slot="p-head">
        <th width="5px"></th>
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="menu plugin" @click.native="togglePermission('menu plugin')" :checked="$rolePermission.has('menu plugin', permissions)" :description="''"/></td>
        <td><b>{{ $t('plugin') | uppercase }}</b></td>
      </tr>
    </p-table>
    <p-separator></p-separator>
    <h5 class="content-heading">{{ $t('scale weight') | uppercase }}</h5>
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
        <td><p-form-check-box :is-form="false" ref="menu scale weight" @click.native="togglePermission('menu scale weight')" :checked="$rolePermission.has('menu scale weight', permissions)"/></td>
        <td><b>{{ $t('scale weight') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)" :checked="checkPermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)" :description="''"/></td>
        <td><b>{{ $t('scale weight truck') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create scale weight truck" @click.native="togglePermission('create scale weight truck')" :checked="$rolePermission.has('create scale weight truck', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read scale weight truck" @click.native="togglePermission('read scale weight truck')" :checked="$rolePermission.has('read scale weight truck', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update scale weight truck" @click.native="togglePermission('update scale weight truck')" :checked="$rolePermission.has('update scale weight truck', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete scale weight truck" @click.native="togglePermission('delete scale weight truck')" :checked="$rolePermission.has('delete scale weight truck', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)" :checked="checkPermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)" :description="''"/></td>
        <td><b>{{ $t('scale weight item') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create scale weight item" @click.native="togglePermission('create scale weight item')" :checked="$rolePermission.has('create scale weight item', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read scale weight item" @click.native="togglePermission('read scale weight item')" :checked="$rolePermission.has('read scale weight item', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update scale weight item" @click.native="togglePermission('update scale weight item')" :checked="$rolePermission.has('update scale weight item', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete scale weight item" @click.native="togglePermission('delete scale weight item')" :checked="$rolePermission.has('delete scale weight item', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
    </p-table>
    <p-separator></p-separator>
    <h2 class="content-heading">{{ $t('pin point') | uppercase }}</h2>
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
        <td><p-form-check-box :is-form="false" ref="menu pin point" @click.native="togglePermission('menu pin point')" :checked="$rolePermission.has('menu pin point', permissions)"/></td>
        <td><b>{{ $t('pin point') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)" :checked="checkPermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)" :description="''"/></td>
        <td><b>{{ $t('sales visitation') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create pin point sales visitation form" @click.native="togglePermission('create pin point sales visitation form')" :checked="$rolePermission.has('create pin point sales visitation form', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read pin point sales visitation form" @click.native="togglePermission('read pin point sales visitation form')" :checked="$rolePermission.has('read pin point sales visitation form', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update pin point sales visitation form" @click.native="togglePermission('update pin point sales visitation form')" :checked="$rolePermission.has('update pin point sales visitation form', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete pin point sales visitation form" @click.native="togglePermission('delete pin point sales visitation form')" :checked="$rolePermission.has('delete pin point sales visitation form', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>{{ $t('report') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="read pin point sales visitation form report" @click.native="togglePermission('read pin point sales visitation form report')" :checked="$rolePermission.has('read pin point sales visitation form report', permissions)" :description="'sales visitation form' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read pin point attendance report" @click.native="togglePermission('read pin point attendance report')" :checked="$rolePermission.has('read pin point attendance report', permissions)" :description="'attendance' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read pin point sales visitation report" @click.native="togglePermission('read pin point sales visitation report')" :checked="$rolePermission.has('read pin point sales visitation report', permissions)" :description="'sales visitation' | uppercase"/></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td></td>
        <td><b>{{ $t('notification') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="notification pin point sales" @click.native="togglePermission('notification pin point sales')" :checked="$rolePermission.has('notification pin point sales', permissions)" :description="'sales' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="notification pin point supervisor" @click.native="togglePermission('notification pin point supervisor')" :checked="$rolePermission.has('notification pin point supervisor', permissions)" :description="'supervisor' | uppercase"/></td>
        <td></td>
        <td></td>
      </tr>
    </p-table>
    <p-separator></p-separator>
    <h2 class="content-heading">{{ $t('play book') | uppercase }}</h2>
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
        <td><p-form-check-box :is-form="false" ref="menu play book" @click.native="togglePermission('menu play book')" :checked="$rolePermission.has('menu play book', permissions)"/></td>
        <td><b>{{ $t('play book') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book glossaries', 'read play book glossaries', 'update play book glossaries', 'delete play book glossaries'], permissions)" :checked="checkPermissionRow(['create play book glossaries', 'read play book glossaries', 'update play book glossaries', 'delete play book glossaries'], permissions)" :description="''"/></td>
        <td><b>{{ $t('glossaries') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book glossaries" @click.native="togglePermission('create play book glossaries')" :checked="$rolePermission.has('create play book glossaries', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book glossaries" @click.native="togglePermission('read play book glossaries')" :checked="$rolePermission.has('read play book glossaries', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book glossaries" @click.native="togglePermission('update play book glossaries')" :checked="$rolePermission.has('update play book glossaries', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book glossaries" @click.native="togglePermission('delete play book glossaries')" :checked="$rolePermission.has('delete play book glossaries', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book procedures code', 'read play book procedures code', 'update play book procedures code', 'delete play book procedures code'], permissions)" :checked="checkPermissionRow(['create play book procedures code', 'read play book procedures code', 'update play book procedures code', 'delete play book procedures code'], permissions)" :description="''"/></td>
        <td><b>{{ $t('procedures code') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book procedures code" @click.native="togglePermission('create play book procedures code')" :checked="$rolePermission.has('create play book procedures code', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book procedures code" @click.native="togglePermission('read play book procedures code')" :checked="$rolePermission.has('read play book procedures code', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book procedures code" @click.native="togglePermission('update play book procedures code')" :checked="$rolePermission.has('update play book procedures code', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book procedures code" @click.native="togglePermission('delete play book procedures code')" :checked="$rolePermission.has('delete play book procedures code', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
       <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book procedures content', 'read play book procedures content', 'update play book procedures content', 'delete play book procedures content'], permissions)" :checked="checkPermissionRow(['create play book procedures content', 'read play book procedures content', 'update play book procedures content', 'delete play book procedures content'], permissions)" :description="''"/></td>
        <td><b>{{ $t('procedures content') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book procedures content" @click.native="togglePermission('create play book procedures content')" :checked="$rolePermission.has('create play book procedures content', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book procedures content" @click.native="togglePermission('read play book procedures content')" :checked="$rolePermission.has('read play book procedures content', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book procedures content" @click.native="togglePermission('update play book procedures content')" :checked="$rolePermission.has('update play book procedures content', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book procedures content" @click.native="togglePermission('delete play book procedures content')" :checked="$rolePermission.has('delete play book procedures content', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book instructions', 'read play book instructions', 'update play book instructions', 'delete play book instructions'], permissions)" :checked="checkPermissionRow(['create play book instructions', 'read play book instructions', 'update play book instructions', 'delete play book instructions'], permissions)" :description="''"/></td>
        <td><b>{{ $t('instructions') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book instructions" @click.native="togglePermission('create play book instructions')" :checked="$rolePermission.has('create play book instructions', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book instructions" @click.native="togglePermission('read play book instructions')" :checked="$rolePermission.has('read play book instructions', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book instructions" @click.native="togglePermission('update play book instructions')" :checked="$rolePermission.has('update play book instructions', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book instructions" @click.native="togglePermission('delete play book instructions')" :checked="$rolePermission.has('delete play book instructions', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" ref="accept play book approval" @click.native="togglePermissionRow(['accept play book approval procedures', 'accept play book approval instructions'], permissions)" :checked="checkPermissionRow(['accept play book approval procedures', 'accept play book approval instructions'], permissions)"/></td>
        <td><b>{{ $t('Approval') | uppercase }}</b></td>
        <td></td>
        <td></td>
        <td></td>
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
