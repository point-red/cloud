<template>
  <div class="row gutters-tiny">
    <p-box
      :name="$t('main menu')"
      link="/menu"
      icon="si si-layers"/>
    <p-box
      name="Kpi"
      v-if="$plugin.has('KPI') && ($permission.has('create employee assessment') && isShow(employee.scorers) || $plugin.has('KPI') && $permission.has('read employee assessment'))"
      :link="$t('/human-resource/employee')"
      icon="si si-badge"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'dashboard',
  data () {
    return {
      isLoading: false,
      id: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employee'])
  },
  methods: {
    ...mapActions('auth', ['tryAutoLogin']),
    isShow (scorers) {
      if (!scorers) {
        return false
      }
      return scorers.some(element => {
        return element.id == this.authUser.id
      })
    }
  },
  created () {
    this.isLoading = true
    this.tryAutoLogin()
    .then((response) => {
      this.isLoading = false
      this.id = this.authUser.id
      console.log(this.id)
    }, (error) => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
