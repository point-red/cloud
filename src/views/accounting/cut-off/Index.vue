<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Cut Off</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <div class="col-sm-12">
        <form class="row" @submit.prevent="onSubmit">
          <p-block :title="$t('cut off')" :header="true">
            <p-block-inner :is-loading="loading">
              <p-table>
                <tr slot="p-head">
                  <th>Date</th>
                  <th>Cut Off</th>
                </tr>
                <tr
                  v-for="(cutOff, index) in cutOffs"
                  :key="index"
                  slot="p-body">
                  <td>{{ cutOff.date | dateFormat('DD MMM YYYY') }}</td>
                  <td>
                    <router-link :to="{ name: 'AccountingCutOffShow', params: { id: cutOff.id }}">
                      {{ cutOff.number }}
                    </router-link>
                  </td>
                </tr>
              </p-table>
            </p-block-inner>
          </p-block>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  computed: {
    ...mapGetters('CutOff', ['cutOffs'])
  },
  methods: {
    ...mapActions('CutOff', ['get'])
  },
  created () {
    this.loading = true
    this.get()
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
