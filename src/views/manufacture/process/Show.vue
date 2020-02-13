<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link to="/manufacture/process" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ process.name | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            :label="$t('name')"
            name="name"
            v-model="process.name"
            readonly/>

          <p-form-row
            id="notes"
            :label="$t('notes')"
            name="notes"
            v-model="process.notes"
            readonly/>

          <hr>

          <router-link
            :to="{ path: '/manufacture/process/' + process.id + '/edit', params: { id: process.id }}"
            v-if="$permission.has('update manufacture process')"
            class="btn btn-sm btn-primary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete manufacture process')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
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
      title: 'Process',
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('manufactureProcess', ['process'])
  },
  methods: {
    ...mapActions('manufactureProcess', ['find', 'delete']),
    onDelete () {
      this.isDeleting = true
      this.delete({ id: this.id })
        .then(response => {
          this.$notification.success('delete success')
          this.$router.push('/manufacture/process')
          this.isDeleting = false
        }).catch(error => {
          this.$notification.error(error.message)
          this.isDeleting = false
        })
    }
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
  }
}
</script>
