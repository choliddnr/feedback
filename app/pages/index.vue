<script setup lang="ts">
const router = useRouter();
</script>
<template>
  <UCard>
    <article class="text-wrap text-xl text-center items-center">
      <p class="font-bold">
        Terimakasih telah membeli produk kami. Kami harap anda puas dengan
        produk dan layanan kami.
      </p>
      <p>
        Untuk dapat terus berkembang, Kami butuh kritik dan saran dari anda.Jika
        anda berkenan, mohon berikan kritik dan saran anda dengan menekan tombol
        di bawah. sebagai bentuk terimakasih, kami akan memberikan anda voucher
        <b>discount 50%</b> atau maksimal
        <b>Rp.30.000</b>
        untuk pembelian selanjutnya.
        <br />
      </p>
      <UButton
        class="mt-5"
        :ui="{ block: 'w-20' }"
        size="xl"
        label="Kritik dan Saran"
        @click="router.push('/respondent')"
      />
    </article>
  </UCard>
</template>
