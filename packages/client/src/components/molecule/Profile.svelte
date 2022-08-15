<script>
  import Tag from "../atom/Tag.svelte";
</script>

<div class="profile">
  <p>반갑습니다!</p>
  <p><span class="name">하선우</span>님</p>
  <Tag class="bg-gray-300 text-gray-700">학부 \ 글로벌미디어학부</Tag>
  <Tag class="bg-gray-300 text-gray-700">학번 \ 20221686</Tag>
</div>

<style>

    .profile {
        @apply flex flex-col items-start gap-1;
    }
    p {
        @apply font-semibold leading-5;
    }
    .name {
        @apply text-5xl font-bold text-primary-800;
    }
</style>


