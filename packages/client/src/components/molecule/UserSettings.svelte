<script lang="ts">
  import { Datatable } from "svelte-simple-datatables";

  const settings = {
    sortable: true,
    pagination: true,
    rowsPerPage: 50,
    columnFilter: true,
    labels: {
      search: '검색하기...',
      filter: '필터',
      noRows: '보여줄 열이 없습니다.',
      info: '항목 {rows} 중 {start}-{end}',
      previous: '이전',
      next: '다음'
    }
  };

  const users: Array<User> = [
    {
      id: "20211561",
      name: "구효민",
      isAdmin: true,
      department: "G"
    },
    {
      id: "20211561",
      name: "구효민",
      isAdmin: true,
      department: "G"
    },
    {
      id: "20211561",
      name: "구효민",
      isAdmin: true,
      department: "G"
    },
    {
      id: "20211561",
      name: "구효민",
      isAdmin: true,
      department: "G"
    },
    {
      id: "20211561",
      name: "구효민",
      isAdmin: true,
      department: "G"
    }
  ];

  let rows;
</script>

<div class="wrap">
  <h3>사용자 설정</h3>
  <div class="table">
    <Datatable {settings} data={users} bind:dataRows={rows}>
      <thead>
      <th data-key="id">학번</th>
      <th data-key="name">이름</th>
      <th data-key="isAdmin">관리자 여부</th>
      <th data-key="department">학부</th>
      <th data-key="lockerId">대여한 사물함</th>
      </thead>
      <tbody>
      {#if rows}
        {#each $rows as row}
          <tr>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.isAdmin}</td>
            <td>{row.department}</td>
            <td>{row.lockerId ? row.lockerId : '없음'}</td>
          </tr>
        {/each}
      {/if}
      </tbody>
    </Datatable>
  </div>
</div>

<style>
    .wrap {
        @apply flex flex-col gap-3 h-full;
    }

    .table {
        @apply grow overflow-scroll;
    }
</style>