<template>
  <BlockUI :message="message">
    <i class="fa fa-cog fa-spin fa-3x fa-fw" />
  </BlockUI>
</template>

<script>

export default {
  props: {
    message: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>
