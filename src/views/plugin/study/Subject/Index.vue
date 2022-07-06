<template>
  <div>
    <plugin-study-tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create study subjects')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.modalCreate.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
          <p-form-input
            id="search-text"
            name="search-text"
            :placeholder="$t('search') | capitalize"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>
                #
              </th>
              <th>
                {{ $t('name') }}
              </th>
              <th class="text-center">
                {{ $t('study sheet') }}
              </th>
              <th
                v-if="$permission.has('edit study subjects') || $permission.has('delete study subjects')"
                class="text-center"
                width="1px"
              >
                {{ $t('action') }}
              </th>
            </tr>
            <tr
              v-for="(subject, index) in filteredSubjects"
              :key="subject.id"
              slot="p-body"
            >
              <th>{{ index + 1 | numberFormat }}</th>
              <td>{{ subject.name }}</td>
              <td class="text-center">
                <router-link
                  class="border-bottom"
                  :to="{name: 'PluginStudySheetIndex', query: {subject: subject.id}}"
                >
                  {{ subject.count_sheet | numberFormat }}
                </router-link>
              </td>
              <td
                v-if="$permission.has('edit study subjects') || $permission.has('delete study subjects')"
                class="text-center"
              >
                <div style="display: flex;">
                  <button
                    v-if="$permission.has('edit study subjects')"
                    class="btn btn-light btn-action mr-2"
                    :title="$t('edit') | capitalize"
                    @click="$refs.modalEdit.open(subject)"
                  >
                    <i class="fa fa-edit" />
                  </button>
                  <button
                    v-if="$permission.has('delete study subjects')"
                    class="btn btn-light btn-action"
                    :title="$t('delete') | capitalize"
                    @click="$refs.modalDelete.open(subject)"
                  >
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>

    <m-create
      ref="modalCreate"
      @create="subjectCreated"
    />
    <m-edit
      ref="modalEdit"
      @update="subjectEdited"
    />
    <m-delete
      ref="modalDelete"
      @delete="subjectDeleted"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import axios from '@/axios'
import PointTable from 'point-table-vue'
import PluginStudyTabMenu from '../TabMenu.vue'
import MCreate from './Create.vue'
import MEdit from './Edit.vue'
import MDelete from './Delete.vue'
export default {
  name: 'PluginStudySubject',
  components: {
    PointTable,
    PluginStudyTabMenu,
    MCreate,
    MEdit,
    MDelete
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search ?? '',
      subjects: []
    }
  },
  computed: {
    filteredSubjects () {
      const search = this.searchText.toLocaleLowerCase()
      return this.subjects.filter(subject => {
        const name = subject.name.toLocaleLowerCase()
        return name.includes(search)
      })
    }
  },
  created () {
    this.getStudySubjects()
  },
  methods: {
    getStudySubjects () {
      const apiParams = {
        sort_by: 'name'
      }
      axios.get('/plugin/study/subject', { params: apiParams })
        .then(response => {
          this.subjects = response.data.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    subjectCreated (subject) {
      this.subjects.push(subject)
    },
    subjectEdited (subject) {
      const index = this.subjects.findIndex(({ id }) => id === subject.id)
      this.subjects[index].name = subject.name
    },
    subjectDeleted (subjectId) {
      this.subjects = this.subjects.filter(({ id }) => id !== subjectId)
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value || undefined } })
      this.searchText = value.trim()
    }, 300)
  }
}
</script>

<style scoped>
:deep(.btn-action) {
  padding: 0;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
