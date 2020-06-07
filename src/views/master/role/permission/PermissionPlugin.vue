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
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book glossary', 'read play book glossary', 'update play book glossary', 'delete play book glossary'], permissions)" :checked="checkPermissionRow(['create play book glossary', 'read play book glossary', 'update play book glossary', 'delete play book glossary'], permissions)" :description="''"/></td>
        <td><b>{{ $t('glossary') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book glossary" @click.native="togglePermission('create play book glossary')" :checked="$rolePermission.has('create play book glossary', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book glossary" @click.native="togglePermission('read play book glossary')" :checked="$rolePermission.has('read play book glossary', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book glossary" @click.native="togglePermission('update play book glossary')" :checked="$rolePermission.has('update play book glossary', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book glossary" @click.native="togglePermission('delete play book glossary')" :checked="$rolePermission.has('delete play book glossary', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book procedure', 'read play book procedure', 'update play book procedure', 'delete play book procedure'], permissions)" :checked="checkPermissionRow(['create play book procedure', 'read play book procedure', 'update play book procedure', 'delete play book procedure'], permissions)" :description="''"/></td>
        <td><b>{{ $t('procedure') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book procedure" @click.native="togglePermission('create play book procedure')" :checked="$rolePermission.has('create play book procedure', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book procedure" @click.native="togglePermission('read play book procedure')" :checked="$rolePermission.has('read play book procedure', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book procedure" @click.native="togglePermission('update play book procedure')" :checked="$rolePermission.has('update play book procedure', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book procedure" @click.native="togglePermission('delete play book procedure')" :checked="$rolePermission.has('delete play book procedure', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['create play book instruction', 'read play book instruction', 'update play book instruction', 'delete play book instruction'], permissions)" :checked="checkPermissionRow(['create play book instruction', 'read play book instruction', 'update play book instruction', 'delete play book instruction'], permissions)" :description="''"/></td>
        <td><b>{{ $t('instruction') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="create play book instruction" @click.native="togglePermission('create play book instruction')" :checked="$rolePermission.has('create play book instruction', permissions)" :description="'create' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="read play book instruction" @click.native="togglePermission('read play book instruction')" :checked="$rolePermission.has('read play book instruction', permissions)" :description="'read' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="update play book instruction" @click.native="togglePermission('update play book instruction')" :checked="$rolePermission.has('update play book instruction', permissions)" :description="'update' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="delete play book instruction" @click.native="togglePermission('delete play book instruction')" :checked="$rolePermission.has('delete play book instruction', permissions)" :description="'delete' | uppercase"/></td>
      </tr>
      <tr slot="p-body">
        <td><p-form-check-box :is-form="false" @click.native="togglePermissionRow(['approve play book instruction', 'approve play book procedure'], permissions)" :checked="checkPermissionRow(['approve play book instruction', 'approve play book procedure'], permissions)" :description="''"/></td>
        <td><b>{{ $t('approval') | uppercase }}</b></td>
        <td><p-form-check-box :is-form="false" ref="approve play book procedure" @click.native="togglePermission('approve play book procedure')" :checked="$rolePermission.has('approve play book procedure', permissions)" :description="'procedure' | uppercase"/></td>
        <td><p-form-check-box :is-form="false" ref="approve play book instruction" @click.native="togglePermission('approve play book instruction')" :checked="$rolePermission.has('approve play book instruction', permissions)" :description="'instruction' | uppercase"/></td>
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
