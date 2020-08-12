<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <breadcrumb-procedure />
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <a
            v-if="$permission.has('create play book procedure')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.modalAddProcedure.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <procedure-code-item
            v-for="(procedure, i) in procedures"
            :key="procedure.id"
            :i="(++i) + ((page - 1) * limit)"
            :procedure="procedure"
            :with-add-button="true"
            @added="$router.push('/plugin/play-book/approval/procedure/send')"
          />
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-procedure
      ref="modalAddProcedure"
      @added="$router.push('/plugin/play-book/approval/procedure/send')"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbProcedure from '@/views/plugin/play-book/procedure/components/Breadcrumb'
import ProcedureCodeItem from './components/ProcedureCodeItem'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    BreadcrumbProcedure,
    ProcedureCodeItem
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 5,
      lastPage: 1,
      isAdvanceFilter: false,
      statusId: this.$route.query.statusId,
      statusLabel: null
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookProcedure', ['procedures', 'pagination'])
  },
  mounted () {
    this.getProcedures()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginPlayBookProcedure', [
      'get'
    ]),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          search: value,
          statusId: this.statusId
        }
      })
      this.searchText = value
      this.page = 1
      this.getProcedures()
    }, 300),
    async getProcedures () {
      try {
        this.isLoading = true
        await this.get({
          search: this.searchText,
          page: this.page,
          limit: this.limit,
          status: this.status
        })
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    updatePage (value) {
      this.page = value
      this.getProcedures()
    }
  }
}
</script>
