<template>
  <div>
    <h5 class="content-heading">
      {{ $t('plugin') | uppercase }}
    </h5>
    <p-table>
      <tr slot="p-head">
        <th width="5px" />
        <th>Feature</th>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            ref="menu plugin"
            :is-form="false"
            :checked="$rolePermission.has('menu plugin', permissions)"
            :description="''"
            @click.native="togglePermission('menu plugin')"
          />
        </td>
        <td><b>{{ $t('plugin') | uppercase }}</b></td>
      </tr>
    </p-table>
    <p-separator />
    <h5 class="content-heading">
      {{ $t('scale weight') | uppercase }}
    </h5>
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
            ref="menu scale weight"
            :is-form="false"
            :checked="$rolePermission.has('menu scale weight', permissions)"
            @click.native="togglePermission('menu scale weight')"
          />
        </td>
        <td><b>{{ $t('scale weight') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create scale weight truck', 'read scale weight truck', 'update scale weight truck', 'delete scale weight truck'], permissions)"
          />
        </td>
        <td><b>{{ $t('scale weight truck') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create scale weight truck"
            :is-form="false"
            :checked="$rolePermission.has('create scale weight truck', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create scale weight truck')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read scale weight truck"
            :is-form="false"
            :checked="$rolePermission.has('read scale weight truck', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read scale weight truck')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update scale weight truck"
            :is-form="false"
            :checked="$rolePermission.has('update scale weight truck', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update scale weight truck')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete scale weight truck"
            :is-form="false"
            :checked="$rolePermission.has('delete scale weight truck', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete scale weight truck')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create scale weight item', 'read scale weight item', 'update scale weight item', 'delete scale weight item'], permissions)"
          />
        </td>
        <td><b>{{ $t('scale weight item') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create scale weight item"
            :is-form="false"
            :checked="$rolePermission.has('create scale weight item', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create scale weight item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read scale weight item"
            :is-form="false"
            :checked="$rolePermission.has('read scale weight item', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read scale weight item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update scale weight item"
            :is-form="false"
            :checked="$rolePermission.has('update scale weight item', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update scale weight item')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete scale weight item"
            :is-form="false"
            :checked="$rolePermission.has('delete scale weight item', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete scale weight item')"
          />
        </td>
      </tr>
    </p-table>
    <p-separator />
    <h2 class="content-heading">
      {{ $t('sales visitation') | uppercase }}
    </h2>
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
            ref="menu pin point"
            :is-form="false"
            :checked="$rolePermission.has('menu pin point', permissions)"
            @click.native="togglePermission('menu pin point')"
          />
        </td>
        <td><b>{{ $t('sales visitation') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create pin point sales visitation form', 'read pin point sales visitation form', 'update pin point sales visitation form', 'delete pin point sales visitation form'], permissions)"
          />
        </td>
        <td><b>{{ $t('sales visitation') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create pin point sales visitation form"
            :is-form="false"
            :checked="$rolePermission.has('create pin point sales visitation form', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create pin point sales visitation form')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read pin point sales visitation form"
            :is-form="false"
            :checked="$rolePermission.has('read pin point sales visitation form', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read pin point sales visitation form')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update pin point sales visitation form"
            :is-form="false"
            :checked="$rolePermission.has('update pin point sales visitation form', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update pin point sales visitation form')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete pin point sales visitation form"
            :is-form="false"
            :checked="$rolePermission.has('delete pin point sales visitation form', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete pin point sales visitation form')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td />
        <td><b>{{ $t('report') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="read pin point sales visitation form report"
            :is-form="false"
            :checked="$rolePermission.has('read pin point sales visitation form report', permissions)"
            :description="'sales visitation form' | uppercase"
            @click.native="togglePermission('read pin point sales visitation form report')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read pin point attendance report"
            :is-form="false"
            :checked="$rolePermission.has('read pin point attendance report', permissions)"
            :description="'attendance' | uppercase"
            @click.native="togglePermission('read pin point attendance report')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read pin point sales visitation report"
            :is-form="false"
            :checked="$rolePermission.has('read pin point sales visitation report', permissions)"
            :description="'sales visitation' | uppercase"
            @click.native="togglePermission('read pin point sales visitation report')"
          />
        </td>
        <td />
      </tr>
      <tr slot="p-body">
        <td />
        <td><b>{{ $t('notification') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="notification pin point sales"
            :is-form="false"
            :checked="$rolePermission.has('notification pin point sales', permissions)"
            :description="'sales' | uppercase"
            @click.native="togglePermission('notification pin point sales')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="notification pin point supervisor"
            :is-form="false"
            :checked="$rolePermission.has('notification pin point supervisor', permissions)"
            :description="'supervisor' | uppercase"
            @click.native="togglePermission('notification pin point supervisor')"
          />
        </td>
        <td />
        <td />
      </tr>
    </p-table>
    <p-separator />
    <h2 class="content-heading">
      {{ $t('play book') | uppercase }}
    </h2>
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
            ref="menu play book"
            :is-form="false"
            :checked="$rolePermission.has('menu play book', permissions)"
            @click.native="togglePermission('menu play book')"
          />
        </td>
        <td><b>{{ $t('play book') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create play book glossary', 'read play book glossary', 'update play book glossary', 'delete play book glossary'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create play book glossary', 'read play book glossary', 'update play book glossary', 'delete play book glossary'], permissions)"
          />
        </td>
        <td><b>{{ $t('glossary') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create play book glossary"
            :is-form="false"
            :checked="$rolePermission.has('create play book glossary', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create play book glossary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read play book glossary"
            :is-form="false"
            :checked="$rolePermission.has('read play book glossary', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read play book glossary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update play book glossary"
            :is-form="false"
            :checked="$rolePermission.has('update play book glossary', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update play book glossary')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete play book glossary"
            :is-form="false"
            :checked="$rolePermission.has('delete play book glossary', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete play book glossary')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create play book procedure', 'read play book procedure', 'update play book procedure', 'delete play book procedure'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create play book procedure', 'read play book procedure', 'update play book procedure', 'delete play book procedure'], permissions)"
          />
        </td>
        <td><b>{{ $t('procedure') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create play book procedure"
            :is-form="false"
            :checked="$rolePermission.has('create play book procedure', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create play book procedure')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read play book procedure"
            :is-form="false"
            :checked="$rolePermission.has('read play book procedure', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read play book procedure')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update play book procedure"
            :is-form="false"
            :checked="$rolePermission.has('update play book procedure', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update play book procedure')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete play book procedure"
            :is-form="false"
            :checked="$rolePermission.has('delete play book procedure', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete play book procedure')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create play book instruction', 'read play book instruction', 'update play book instruction', 'delete play book instruction'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create play book instruction', 'read play book instruction', 'update play book instruction', 'delete play book instruction'], permissions)"
          />
        </td>
        <td><b>{{ $t('instruction') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create play book instruction"
            :is-form="false"
            :checked="$rolePermission.has('create play book instruction', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create play book instruction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read play book instruction"
            :is-form="false"
            :checked="$rolePermission.has('read play book instruction', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read play book instruction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update play book instruction"
            :is-form="false"
            :checked="$rolePermission.has('update play book instruction', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update play book instruction')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete play book instruction"
            :is-form="false"
            :checked="$rolePermission.has('delete play book instruction', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete play book instruction')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['approve play book instruction', 'approve play book procedure'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['approve play book instruction', 'approve play book procedure'], permissions)"
          />
        </td>
        <td><b>{{ $t('approval') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="approve play book procedure"
            :is-form="false"
            :checked="$rolePermission.has('approve play book procedure', permissions)"
            :description="'procedure' | uppercase"
            @click.native="togglePermission('approve play book procedure')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="approve play book instruction"
            :is-form="false"
            :checked="$rolePermission.has('approve play book instruction', permissions)"
            :description="'instruction' | uppercase"
            @click.native="togglePermission('approve play book instruction')"
          />
        </td>
        <td />
        <td />
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
