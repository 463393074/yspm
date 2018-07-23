<template lang="html">
  <div>
    <div class="message1">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Helo, Vue.js 2.0 '
    }
  }
}
</script>

<style lang="css">
.message1 {
  color: blue;
  font-size: 1.4em;
}
</style>