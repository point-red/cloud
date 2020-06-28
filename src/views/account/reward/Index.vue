<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('reward') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <div class="col-md-6 col-xl-3">
        <a
          class="block block-link-shadow text-right"
          href="javascript:void(0)"
        >
          <div class="block-content block-content-full clearfix">
            <div class="float-left mt-10">
              <i class="si si-disc fa-3x text-body-bg-dark" />
            </div>
            <div class="font-size-h3 font-w600">{{ balance || 0 }}</div>
            <div class="font-size-sm font-w600 text-uppercase text-muted">Token</div>
          </div>
        </a>
      </div>
    </div>

    <div class="row">
      <p-block
        :header="true"
        title="Point"
        :is-loading="isLoading"
      >
        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th style="width:200px">
                Date
              </th>
              <th>Source</th>
              <th class="text-right">
                Token
              </th>
            </tr>
            <tr
              v-for="token of tokens"
              slot="p-body"
              :key="token.id"
            >
              <td>
                <span class="text-muted">{{ (new Date(token.created_at)).toLocaleString() }}</span>
              </td>
              <td>{{ token.source }}</td>
              <td class="text-right">
                + {{ token.amount }}
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="getTokens"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    Breadcrumb,
    PointTable
  },
  data: () => ({
    isLoading: true
  }),
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('accountRewardToken', ['tokens', 'balance']),
    ...mapState('accountRewardToken', ['meta']),
    currentPage () {
      return parseInt(this.$route.query.page) || 1
    },
    lastPage () {
      return this.meta ? this.meta.last_page : 1
    }
  },
  async mounted () {
    this.getTokens()
  },
  methods: {
    async getTokens (page) {
      try {
        this.isLoading = true
        page = page || 1
        await this.$store.dispatch('accountRewardToken/get', { page, limit: 10 })
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
