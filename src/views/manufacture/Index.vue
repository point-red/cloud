<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('manufacture') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />
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
  created () {
    this.getManufactureProcesses()
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
  }
}
</script>
