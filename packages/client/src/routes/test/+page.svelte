<script lang="ts">
  import Button from '../../components/atom/Button.svelte';
  import Modal from '../../components/molecule/Modal.svelte';
  import NavigationShell from '../../components/molecule/NavigationShell.svelte';
  import PageTitle from '../../components/atom/PageTitle.svelte';
  import MapCanvas from 'src/components/atom/MapCanvas.svelte';

  let open = false;

  let innerWidth = 0;

  function openModal() {
    open = true;
  }
</script>

<PageTitle name="This is test!" />

<svelte:window bind:innerWidth />

<NavigationShell collapsable={innerWidth <= 1024}>
  <Button on:click={openModal}>모달 열기</Button>
  <MapCanvas class="h-[50vh]" src={`/floorMaps/21/5.png`} highlightSrc={`/floorMaps/21/5/H.svg`} highlightX={0}
             highlightY={0} />
</NavigationShell>

<Modal
  on:close={() => (open = false)}
  bind:open
  title="축하합니다!"
  subtitle="테스트 페이지를 찾았다!">
  테스트 페이지를 찾으셨습니다! 보상은 뿌듯함..이랄까?
</Modal>
