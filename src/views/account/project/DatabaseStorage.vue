<template>
  <div>
    <h5>{{ tableName }}</h5>
    <p-block-inner>
      <template
        v-if="rows && rows.length > 0"
        :is-loading="isLoading"
      >
        <point-table>
          <tr slot="p-head">
            <th>#</th>
            <th
              v-for="(row, index) in Object.keys(rows[0])"
              :key="index"
            >
              {{ row }}
            </th>
          </tr>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            slot="p-body"
          >
            <th>{{ index + 1 }}</th>
            <td
              v-for="(col, index2) in row"
              :key="index + '-' + index2"
            >
              {{ col }}
            </td>
          </tr>
        </point-table>
      </template>
      <template v-else-if="!isLoading">
        There is no data for table "{{ name }}"
      </template>
    </p-block-inner>
  </div>
</template>

<script>
import PointTable from 'point-table-vue'

export default {
  components: {
    PointTable
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    tableName: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rows: this.data,
      name: this.tableName
    }
  },
  watch: {
    data () {
      this.rows = this.data
    },
    tableName () {
      this.name = this.tableName
    }
  }
}
</script>
