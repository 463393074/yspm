<template lang="html">
  <div>
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Helo, world! '
    }
  }
}
</script>

<style lang="css">
.message {
  color: pink;
  font-size: 1.4em;
}
</style>