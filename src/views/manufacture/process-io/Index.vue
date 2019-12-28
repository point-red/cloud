<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <span class="breadcrumb-item active">{{ $t('proccess') | uppercase }}</span>
      <span class="breadcrumb-item active">{{ process.name | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu></manufacture-menu>

    <hr>

    <div class="row gutters-tiny">
      <p-box
        id="input"
        :name="$t('input')"
        :link="'/manufacture/process-io/' + process.id + '/input'"
        icon="fa fa-toggle-on"/>
      <p-box
        id="output"
        :name="$t('output')"
        :link="'/manufacture/process-io/' + process.id + '/output'"
        icon="fa fa-toggle-off"/>
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
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('manufactureProcess', ['process'])
  },
  methods: {
    ...mapActions('manufactureProcess', ['find'])
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
