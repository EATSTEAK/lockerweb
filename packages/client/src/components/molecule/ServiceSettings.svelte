<div class="wrap">
  <h3>서비스 설정</h3>
  <section class="service-section">
    <h4>전체 서비스 설정</h4>
    <div class="service">
      <div class="form-group">
        <label for="service_name">서비스 명</label>
        <input id="service_name" type="text" class="form-input rounded-md bg-gray-100 border-transparent focus:bg-white" />
      </div>
      <div class="form-group">
        <label for="activate_from">시작일</label>
        <input id="activate_from" type="datetime-local" class="form-input rounded-md bg-gray-100 border-transparent focus:bg-white" />
      </div>
      <div class="form-group">
        <label for="activate_to">종료일</label>
        <input id="activate_to" type="datetime-local" class="form-input rounded-md bg-gray-100 border-transparent focus:bg-white" />
      </div>
      <div class="my-2">
        <p class="font-bold">건물/사물함 정보</p>
        <ul>
          <li>
            정보과학관
            <ul>
              <li>
                1F
                <ul>
                  <li>
                    A
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
  <div class="department">
    <h4>학부별 설정</h4>
  </div>
</div>

<style>
    .wrap {
        @apply flex flex-col gap-3;
    }

    h4 {
        @apply text-2xl;
    }

    .service-section {
        @apply py-3;
    }

    .form-group {
        @apply my-2;
    }

    .form-group label {
        @apply font-bold block mb-1;
    }
</style>