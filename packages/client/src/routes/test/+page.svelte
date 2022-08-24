<script lang="ts">
  import Button from "../../components/atom/Button.svelte";
  import Modal from "../../components/molecule/Modal.svelte";

  let open = false;

  function openModal() {
    open = true;
  }
</script>

<Modal on:close={() => open = false} bind:open title="축하합니다!" subtitle="테스트 페이지를 찾았다!">
  테스트 페이지를 찾으셨습니다! 보상은 뿌듯함..이랄까?
</Modal>
<div>
  <Button on:click={openModal}>모달 열기</Button>
</div>