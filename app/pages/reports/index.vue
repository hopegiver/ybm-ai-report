<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

navigateTo('/reports/mobyread', { replace: true })
</script>
