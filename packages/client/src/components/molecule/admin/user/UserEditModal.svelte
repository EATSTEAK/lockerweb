<script lang="ts">
  import Modal from '../../Modal.svelte';
  import TextInput from '../../../atom/form/TextInput.svelte';
  import Checkbox from '../../../atom/form/Checkbox.svelte';
  import DateTimeInput from '../../../atom/form/DateTimeInput.svelte';
  import SaveEdit from '../../../../icons/SaveEdit.svelte';
  import Dismiss from '../../../../icons/Dismiss.svelte';
  import { createEventDispatcher } from 'svelte';
  import Select from '../../../atom/form/Select.svelte';
  import { config } from '$lib/store';
  import { getDepartmentConfigs } from '$lib/api/config';

  const dispatch = createEventDispatcher<{ submit: User }>();

  export let open = false;
  export let targetUser: User;

  let id = targetUser?.id ?? null;
  let name = targetUser?.name ?? null;
  let department = targetUser?.department ?? null;
  let isAdmin = targetUser?.isAdmin ?? false;
  let lockerId = targetUser?.lockerId ?? null;
  let claimedUntil = targetUser?.claimedUntil ?? null;

  $: departments = $config && $config.success ? getDepartmentConfigs($config.result) : [];

  $: initializeValues(targetUser);

  $: title = targetUser ? '사용자 수정' : '사용자 추가';

  function initializeValues(targetUser: User) {
    id = targetUser?.id ?? null;
    name = targetUser?.name ?? null;
    department = targetUser?.department ?? null;
    isAdmin = targetUser?.isAdmin ?? false;
    lockerId = targetUser?.lockerId ?? null;
    claimedUntil = targetUser?.claimedUntil ?? null;
  }

  function closeModal() {
    open = false;
  }

  function submitUser() {
    const newUser: User = {
      id,
      name,
      department,
      isAdmin,
      ...(lockerId ? { lockerId } : targetUser?.lockerId && { lockerId: null }),
      ...(claimedUntil
        ? { claimedUntil: claimedUntil.getTime() }
        : targetUser?.claimedUntil && { claimedUntil: null }),
    };
    dispatch('submit', newUser);
  }
</script>

<Modal
  on:close
  on:click:secondary={closeModal}
  on:click={submitUser}
  {title}
  bind:open
  primaryText="저장"
  isPrimaryBtnIconRight
  isSecondaryBtnIconRight
  {...$$restProps}
>
  <div class="flex flex-col gap-1">
    <TextInput
      id="id"
      bind:value={id}
      label="학번"
      showLabel
      disabled={!!targetUser ? true : undefined}
      required={!targetUser}
      invalidClass="text-red-800"
      invalidText={id ? '학번은 숫자로만 이루어져야 합니다.' : '이 값은 필수입니다.'}
      pattern="\d+"
    />
    <TextInput
      id="name"
      bind:value={name}
      label="이름"
      showLabel
      invalidClass="text-red-800"
      invalidText="이 값은 필수입니다."
      required
    />
    <div class="department">
      <p class="font-bold">대상 학과(부)</p>
      <Select id={`department`} label="대상 학과(부)" bind:value={department} required>
        {#each departments as department}
          <option value={department.id}>{department.name}</option>
        {/each}
      </Select>
    </div>
    <Checkbox id="is_admin" bind:checked={isAdmin} label="관리자 여부" showLabel />
    <TextInput
      id="locker_id"
      bind:value={lockerId}
      label="대여한 사물함 ID"
      invalidClass="text-red-800"
      invalidText="사물함 ID의 값은 (건물번호)-(층)-(구역)(번호) 형식입니다.(ex. 21-1-A003)"
      showLabel
    />
    <DateTimeInput
      id="claimed_until"
      bind:value={claimedUntil}
      label="사물함 대여 기한(미입력시 무기한)"
      showLabel
    />
  </div>
  <SaveEdit slot="primaryIcon" />
  <Dismiss slot="secondaryIcon" />
</Modal>
