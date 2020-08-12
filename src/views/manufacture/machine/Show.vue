<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        to="/manufacture/machine"
        class="breadcrumb-item"
      >
        {{ $t('machine') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ machine.name | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            v-if="$permission.has('update manufacture machine')"
            :to="{ path: '/manufacture/machine/create' }"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            v-if="$permission.has('update manufacture machine')"
            :to="{ path: '/manufacture/machine/' + machine.id + '/edit', params: { id: machine.id }}"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            v-if="$permission.has('delete manufacture machine')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="code"
            v-model="machine.code"
            :label="$t('code')"
            name="code"
            readonly
          />

          <p-form-row
            id="name"
            v-model="machine.name"
            :label="$t('name')"
            name="name"
            readonly
          />

          <p-form-row
            id="notes"
            v-model="machine.notes"
            :label="$t('notes')"
            name="notes"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('manufactureMachine', ['machine'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('manufactureMachine', ['find', 'delete']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.$notification.success('delete success')
            this.$router.push('/manufacture/machine')
            this.isDeleting = false
          }).catch(error => {
            this.$notification.error(error.message)
            this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
            this.isDeleting = false
          })
      })
    }
  }
}
</script>
