<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Glossary' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <a
            v-if="$permission.has('create play book glossary')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.modalAddGlossary.open()"
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
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Code</th>
              <th>Name</th>
              <th>Abbreviation</th>
              <th>Note</th>
              <th class="text-center">
                History
              </th>
            </tr>
            <tr
              v-for="(glossary, index) in glossaries"
              :key="glossary.id"
              slot="p-body"
            >
              <th>{{ (++index) + ((page - 1) * limit) }}</th>
              <td>
                <router-link :to="`/plugin/play-book/glossary/${glossary.id}`">
                  {{ glossary.code }}
                </router-link>
              </td>
              <td>{{ glossary.name }}</td>
              <td>{{ glossary.abbreviation | uppercase }}</td>
              <td>{{ glossary.note }}</td>
              <td class="text-center">
                <router-link
                  class="btn btn-sm btn-light"
                  :to="`/plugin/play-book/glossary/${glossary.id}/histories`"
                >
                  SEE HISTORY
                </router-link>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-glossary
      ref="modalAddGlossary"
      @added="getGlossaryRequest"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      isAdvanceFilter: false,
      statusId: this.$route.query.statusId,
      statusLabel: null
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookGlossary', ['glossaries', 'pagination'])
  },
  mounted () {
    this.getGlossaryRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginPlayBookGlossary', [
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
      this.getGlossaryRequest()
    }, 300),
    async getGlossaryRequest () {
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
      this.getGlossaryRequest()
    }
  }
}
</script>
