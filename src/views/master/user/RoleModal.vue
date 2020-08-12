<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitRole"
    >
      <p-modal
        id="assignRole"
        ref="assignRole"
        :title="$t('employee assessment')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(role, index) in roles">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="javascript:void(0)"
                @click="onSubmitRole(role, index)"
              >
                <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ role.name | uppercase }}</span>
              </a>
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="$refs.assignRole.close()"
          >
            {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters('masterRole', ['roles'])
  },
  watch: {
    'assignRole' () {
      this.$emit('value', this.assignRole)
    }
  },
  created () {
    this.get()
  },
  methods: {
    ...mapActions('masterRole', ['get']),
    ...mapActions('masterUserRole', ['update']),
    ...mapActions('masterUser', {
      findUser: 'find'
    }),
    show (user) {
      this.user = user
      this.$refs.assignRole.show()
    },
    close () {
      this.$refs.assignRole.close()
    },
    onSubmitRole (role, index) {
      this.update({ id: this.user.id, role_id: role.id })
        .then((response) => {
          this.findUser({
            id: this.user.id,
            params: {
              includes: 'roles'
            }
          })
        }, (error) => {
          console.log(error.message)
        })
      this.$refs.assignRole.close()
    }
  }
}
</script>
