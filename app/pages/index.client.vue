<script setup lang="ts">
import { useFeedbackStore } from "../stores/feedback";

// const { merchantId } = storeToRefs(useFeedbackStore());
// console.log("merchant", merchantId.value);
</script>
<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <h1>{{ "no merchant" }}</h1>
      <NuxtImg
        src="http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2ZlZWRiYWNrL3VzZXJfcGljdHVyZS9rdXJtYS1hbC1xYXNlZW0tNzUwZy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1LUkNLODVLVzRMNFJTSDhCVlJTUyUyRjIwMjUwMTIyJTJGbWxnLXNrbC13c2wtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTAxMjJUMjIxMTI5WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTFVrTkxPRFZMVnpSTU5GSlRTRGhDVmxKVFV5SXNJbVY0Y0NJNk1UY3pOell5TmpRMk15d2ljR0Z5Wlc1MElqb2lVazlQVkU1QlRVVWlmUS44LURxT2VjYk53LUhBYjlxLUc2MFdOemRIbVZNbWlvNklZRVJVejdSd3BTOXpUcVUzY2pfb01RcVY3eWtmaXhyQzN0UHVQdlNROW1mb01TMElXb0E4ZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTg5MTA5MTFkMzA4OGEyNDM5YjA2ZjBlZDE0N2FjM2RmOGY3YmQyYTgzYjU1OWMyOTFkOTY1NDBkODcyMTc2ZGI"
        alt="mC"
      />
    </div>
  </div>
</template>
<style scoped>
#cropperCanvas {
  :deep(cropper-canvas) {
    height: 300px;
    width: 300px;
  }
}
</style>
