<template>
  <div class="message-alert">
    <div class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, index) in messages" :key="index">
      {{ item.message }}
      <button type="button" class="close" @click="removeMessage(i)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      messages: []
    }
  },
  methods: {
    updateMessage (message, status = 'warning') {
      const timestamp = Math.floor(new Date().getTime() / 1000)
      this.messages.push({
        message: message,
        status: status,
        timestamp: timestamp
      })
      this.removeMessageWithTiming(timestamp)
    },
    removeMessage (num) {
      this.messages.splice(num, 1)
    },
    removeMessageWithTiming (timestamp) {
      const vm = this
      setTimeout(function () {
        vm.messages.forEach(function (item, i) {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1)
          }
        })
      }, 5000)
    },
    openMessage (message, status = 'warning') {
      const vm = this
      vm.updateMessage(message, status)
    }
  },
  created () {
    const vm = this

    // 自定義名稱 'messsage:push'
    // message: 傳入參數
    // status: 樣式，預設值為 warning
    vm.$bus.$on('message:push', this.updateMessage)
    // vm.$bus.$emit('message:push')
  },
  beforeDestroy () {
    const vm = this
    vm.$bus.$off('message:push', this.updateMessage)
  }
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>
