<template>
  <div class="approve-container">
    <div class="floating-approve">
      <div class="header">
        <strong>APPROVAL</strong>
      </div>
      <div class="body">
        <div>
          <div class="form-number">
            PP/006/X/21
          </div>
          <div class="form-status">
            Approved
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      number: '',
      token: ''
    }
  },
  created () {
    this.number = this.$route.query.number || ''
    this.token = this.$route.query.token || ''
  }
}
</script>

<style scoped>
.approve-container {
  height: 30vw;
  width: 30vw;
  min-width: 250px;
  min-height: 250px;
  margin: 20px;
}

.floating-approve {
  width: 90%;
  height: 90%;
  border: solid 2px black;
  border-radius: 5px;
}

.floating-approve .header {
  width: 100%;
  height: 34px;
  padding: 5px 10px;
  font-size: 12pt;
  background-color: #f6fafa;
}

.floating-approve .body {
  background-color: #fefffe;
  width: 100%;
  height: calc(100% - 34px);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.floating-approve .body .form-number {
  margin-top: -20px;
  margin-bottom: 10px;
  font-size: 20pt;
}

.floating-approve .body .form-status {
  font-size: 18pt;
  background-color: #acdd5e;
  color: white;
  border-radius: 3px;
  padding: 5px;
}
</style>
