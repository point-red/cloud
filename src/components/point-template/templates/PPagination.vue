<template>
  <div class="block" v-if="currentPage > lastPage">
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" @click="paginatePrev" :disabled="mutableCurrentPage == 1">
          <span aria-hidden="true">
            <i class="fa fa-angle-left"></i>
          </span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <template v-for="(n, index) in lastPage">
      <li class="page-item" :class="{'active': mutableCurrentPage == n}" :key="index" v-if="showPageNumber(n)">
          <a class="page-link" href="javascript:void(0)" @click="paginatePage(n)">{{ n }}</a>
      </li>
      </template>
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" @click="paginateNext" :disabled="mutableCurrentPage == mutableLastPage">
          <span aria-hidden="true">
            <i class="fa fa-angle-right"></i>
          </span>
          <span class="sr-only">Next</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    lastPage: {
      type: Number
    }
  },
  data () {
    return {
      mutableCurrentPage: this.currentPage,
      mutableLastPage: this.lastPage
    }
  },
  watch: {
    currentPage () {
      this.mutableCurrentPage = this.currentPage
    },
    lastPage () {
      this.mutableLastPage = this.lastPage
    }
  },
  methods: {
    showPageNumber (n) {
      // first three number
      if (n <= 5 && this.mutableCurrentPage <= 3) {
        return true
      }
      // between first three number and last three number
      if (this.mutableCurrentPage >= 3 && n > this.mutableCurrentPage - 3 && n < this.mutableCurrentPage + 3) {
        return true
      }
      // last three number
      if (n > this.mutableLastPage - 5 && this.mutableCurrentPage > this.mutableLastPage - 3) {
        return true
      }

      return false
    },
    paginatePage (n) {
      this.mutableCurrentPage = n
      this.pushRouter()
      this.$emit('updatePage', this.mutableCurrentPage)
    },
    paginatePrev () {
      if (this.mutableCurrentPage > 1) {
        this.mutableCurrentPage -= 1
        this.pushRouter()
        this.$emit('updatePage', this.mutableCurrentPage)
      }
    },
    paginateNext () {
      if (this.mutableCurrentPage < this.mutableLastPage) {
        this.mutableCurrentPage += 1
        this.pushRouter()
        this.$emit('updatePage', this.mutableCurrentPage)
      }
    },
    pushRouter () {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: this.mutableCurrentPage
        }
      })
    }
  }
}
</script>
