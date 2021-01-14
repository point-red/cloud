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
            ref="menu manufacture"
            :is-form="false"
            :checked="$rolePermission.has('menu manufacture', permissions)"
            @click.native="togglePermission('menu manufacture')"
          />
        </td>
        <td><b>{{ $t('manufacture') | uppercase }}</b></td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create manufacture processing', 'read manufacture processing', 'update manufacture processing', 'delete manufacture processing'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create manufacture processing', 'read manufacture processing', 'update manufacture processing', 'delete manufacture processing'], permissions)"
          />
        </td>
        <td><b>{{ $t('processing') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create manufacture processing"
            :is-form="false"
            :checked="$rolePermission.has('create manufacture processing', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create manufacture processing')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read manufacture processing"
            :is-form="false"
            :checked="$rolePermission.has('read manufacture processing', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read manufacture processing')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update manufacture processing"
            :is-form="false"
            :checked="$rolePermission.has('update manufacture processing', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update manufacture processing')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete manufacture processing"
            :is-form="false"
            :checked="$rolePermission.has('delete manufacture processing', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete manufacture processing')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create manufacture machine', 'read manufacture machine', 'update manufacture machine', 'delete manufacture machine'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create manufacture machine', 'read manufacture machine', 'update manufacture machine', 'delete manufacture machine'], permissions)"
          />
        </td>
        <td><b>{{ $t('machine') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create manufacture machine"
            :is-form="false"
            :checked="$rolePermission.has('create manufacture machine', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create manufacture machine')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read manufacture machine"
            :is-form="false"
            :checked="$rolePermission.has('read manufacture machine', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read manufacture machine')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update manufacture machine"
            :is-form="false"
            :checked="$rolePermission.has('update manufacture machine', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update manufacture machine')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete manufacture machine"
            :is-form="false"
            :checked="$rolePermission.has('delete manufacture machine', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete manufacture machine')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create manufacture process', 'read manufacture process', 'update manufacture process', 'delete manufacture process'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create manufacture process', 'read manufacture process', 'update manufacture process', 'delete manufacture process'], permissions)"
          />
        </td>
        <td><b>{{ $t('process') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create manufacture process"
            :is-form="false"
            :checked="$rolePermission.has('create manufacture process', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create manufacture process')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read manufacture process"
            :is-form="false"
            :checked="$rolePermission.has('read manufacture process', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read manufacture process')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update manufacture process"
            :is-form="false"
            :checked="$rolePermission.has('update manufacture process', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update manufacture process')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete manufacture process"
            :is-form="false"
            :checked="$rolePermission.has('delete manufacture process', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete manufacture process')"
          />
        </td>
      </tr>
      <tr slot="p-body">
        <td>
          <p-form-check-box
            :is-form="false"
            :checked="checkPermissionRow(['create manufacture formula', 'read manufacture formula', 'update manufacture formula', 'delete manufacture formula'], permissions)"
            :description="''"
            @click.native="togglePermissionRow(['create manufacture formula', 'read manufacture formula', 'update manufacture formula', 'delete manufacture formula'], permissions)"
          />
        </td>
        <td><b>{{ $t('formula') | uppercase }}</b></td>
        <td>
          <p-form-check-box
            ref="create manufacture formula"
            :is-form="false"
            :checked="$rolePermission.has('create manufacture formula', permissions)"
            :description="'create' | uppercase"
            @click.native="togglePermission('create manufacture formula')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="read manufacture formula"
            :is-form="false"
            :checked="$rolePermission.has('read manufacture formula', permissions)"
            :description="'read' | uppercase"
            @click.native="togglePermission('read manufacture formula')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="update manufacture formula"
            :is-form="false"
            :checked="$rolePermission.has('update manufacture formula', permissions)"
            :description="'update' | uppercase"
            @click.native="togglePermission('update manufacture formula')"
          />
        </td>
        <td>
          <p-form-check-box
            ref="delete manufacture formula"
            :is-form="false"
            :checked="$rolePermission.has('delete manufacture formula', permissions)"
            :description="'delete' | uppercase"
            @click.native="togglePermission('delete manufacture formula')"
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
