<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('manufacture') | titlecase }}</span>
    </breadcrumb>

    <manufacture-menu></manufacture-menu>

    <hr>

    <p-block-inner :is-loading="isLoading" :background-color="'transparent'">
      <div class="row gutters-tiny">
        <template v-for="(process, index) in processes">
          <p-box-process
            :id="'process-' + index"
            :key="'process-' + index"
            :name="$t('process') + ' ' + process.name"
            :link="'/manufacture/io-process/' + process.id"
            icon="fa fa-cogs"/>
        </template>
      </div>
    </p-block-inner>
  </div>
</template>

<script>
import ManufactureMenu from './Menu'
import Breadcrumb from '@/views/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    Breadcrumb
  },
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('manufactureProcess', ['processes'])
  },
  methods: {
    ...mapActions('manufactureProcess', ['get']),
    getManufactureProcesses () {
      this.isLoading = true
      this.get()
        .then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.getManufactureProcesses()
  }
}
</script>
