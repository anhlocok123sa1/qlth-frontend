<template>
  <h2>Đăng ký lịch giảng dạy</h2>

  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    layout="horizontal"
    :disabled="componentDisabled"
    style="max-width: 600px"
  >
    <!-- Mã giáo viên -->
    <a-form-item label="Mã giáo viên">
      <a-input
        v-model:value="idTeacher"
        style="width: 200px"
        :disabled="true"
        placeholder="Mã giáo viên"
      ></a-input>
    </a-form-item>
    <!-- Tên môn học -->
    <a-form-item label="Tên môn học">
      <a-select
        v-model:value="valueSubject"
        show-search
        placeholder="Tên môn học"
        :options="options"
        :filter-option="filterOption"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      ></a-select>
      <small v-if="errors.ma_mh" class="text-danger">{{
        errors.ma_mh[0]
      }}</small>
    </a-form-item>

    <!-- Nhóm môn học -->
    <a-form-item label="Nhóm môn học">
      <a-radio-group v-model:value="subjectGroup">
        <a-radio :value="1">1</a-radio>
        <a-radio :value="2">2</a-radio>
        <a-radio :value="3">3</a-radio>
        <a-radio :value="4">4</a-radio>
        <a-radio :value="5">5</a-radio>
      </a-radio-group>
    </a-form-item>

    <!-- Phòng học -->
    <a-form-item label="Phòng học">
      <a-input
        v-model:value="classroom"
        style="width: 200px"
        placeholder="C801"
        maxlength="4"
      />
      <br />
      <small v-if="errors.phong_hoc" class="text-danger">{{
        errors.phong_hoc[0]
      }}</small>
    </a-form-item>

    <!-- Ngày bắt đầu -->
    <a-form-item label="Thời gian học">
      <a-range-picker
        v-model:value="valueDayStartEndDay"
        :format="dateFormat"
        :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
        @change="onRangeChange"
      />
      <br />
      <small v-if="errors.ngay_bd" class="text-danger">{{
        errors.ngay_bd[0]
      }}</small>
    </a-form-item>

    <!-- Thứ -->
    <a-form-item label="Thứ">
      <a-input-number
        v-model:value="schoolDay"
        min="2"
        max="8"
        placeholder="2"
        style="width: 60px"
      />
      <br />
      <small v-if="errors.thu_hoc" class="text-danger">{{
        errors.thu_hoc[0]
      }}</small>
    </a-form-item>

    <!-- Số tiết bắt đầu -->
    <a-form-item label="Tiết bắt đầu">
      <a-input-number
        v-model:value="startPeriod"
        min="1"
        max="15"
        style="width: 60px"
      />
      <br />
      <small v-if="errors.st_bd" class="text-danger">{{
        errors.st_bd[0]
      }}</small>
    </a-form-item>

    <!-- Số tiết kết thúc -->
    <a-form-item label="Tiết kết thúc">
      <a-input-number
        v-model:value="endPeriod"
        min="1"
        max="15"
        style="width: 60px"
      />
      <br />
      <small v-if="errors.st_kt" class="text-danger">{{
        errors.st_kt[0]
      }}</small>
    </a-form-item>

    <!-- Học kỳ -->
    <a-form-item label="Học kỳ">
      <a-select
        v-model="selectedSemester"
        placeholder="Chọn học kỳ"
        @change="handleSemesterChange"
        width="10px"
      >
        <a-select-option
          v-for="semester in semesterOptions"
          :key="semester"
          :value="semester"
        >
          {{ semester }}
        </a-select-option>
      </a-select>
      <br />
      <small v-if="errors.st_kt" class="text-danger">{{
        errors.st_kt[0]
      }}</small>
    </a-form-item>

    <a-form-item label="Tạo lịch">
      <a-button @click="createTeachingSchedule()" type="primary"
        >Đăng ký</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script>
import { onMounted, defineComponent, ref, computed } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import dayjs from "dayjs";
import axios from "../../../axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useMenu();
    const subjectGroup = ref(1);
    const valueDayStartEndDay = ref("");
    const value1 = ref(dayjs());
    const options = ref([]);
    const valueSubject = ref(null);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const idTeacher = ref(magv);
    const classroom = ref("");
    const starDate = ref("");
    const endDate = ref("");
    const schoolDay = ref("");
    const startPeriod = ref("1");
    const endPeriod = ref("3");
    const semester = ref("124");
    const errors = ref({});
    const router = useRouter();

    onMounted(() => {
      axios
        .get("/getSubject")
        .then((response) => {
          options.value = response.data.map((item) => ({
            label: item.ten_mh,
            value: item.ma_mh,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const checkSchoolDay = (day) => {
      switch (day) {
        case 2:
          return 1;
        case 3:
          return 2;
        case 4:
          return 3;
        case 5:
          return 4;
        case 6:
          return 5;
        case 7:
          return 6;
        case 8:
          return 0;
        default:
          return null;
      }
    };
    const createTeachingSchedule = () => {
      axios
        .post("/create-schedule", {
          ma_gv: magv.value,
          ma_mh: valueSubject.value,
          nmh: subjectGroup.value,
          phong_hoc: classroom.value,
          ngay_bd: starDate.value,
          ngay_kt: endDate.value,
          st_bd: startPeriod.value,
          st_kt: endPeriod.value,
          hoc_ky: semester.value,
          thu_hoc: checkSchoolDay(schoolDay.value),
        })
        .then((response) => {
          if (response.status == 200) {
            message.success(response.data.message);
            router.push({ name: "admin-lichgiangday" });
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errors.value = error.response.data.errors;
            console.log(errors.value.ma_mh[0]);
          }
          console.log(error);
          message.warn(error.response.data.error);
        });
    };

    const onRangeChange = (dates) => {
      const [start, end] = dates;
      starDate.value = start.format("YYYY-MM-DD");
      endDate.value = end.format("YYYY-MM-DD");
    };
    const filterOption = (input, option) =>
      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const selectedSemester = ref(null);
    const semesterOptions = computed(() => {
      const semesterss = [];
      const currentYearShort = currentYear % 100;
      const nextYearShort = (currentYear + 1) % 100;
      const prevYearShort = (currentYear - 1) % 100;

      if (currentMonth >= 9) {
        // Tháng 9 đến tháng 12 (Học kỳ 1 của năm hiện tại)
        semesterss.push(`1${currentYearShort}`);
        semesterss.push(`2${currentYearShort}`);
      } else if (currentMonth <= 1) {
        // Tháng 1 (Học kỳ 1 của năm học trước)
        semesterss.push(`1${prevYearShort}`);
        semesterss.push(`2${currentYearShort}`);
      } else if (currentMonth >= 2 && currentMonth <= 6) {
        // Tháng 2 đến tháng 6 (Học kỳ 2 của năm hiện tại)
        semesterss.push(`2${currentYearShort}`);
        semesterss.push(`3${currentYearShort}`);
      } else if (currentMonth >= 7 && currentMonth <= 8) {
        // Tháng 7 đến tháng 8 (Học kỳ 3 của năm hiện tại)
        semesterss.push(`3${prevYearShort}`);
        semesterss.push(`1${currentYearShort}`);
        semesterss.push(`2${currentYearShort}`);
      }
      return semesterss;
    });

    const handleSemesterChange = (value) => {
      console.log(value);
      semester.value = value;
    };
    store.onSelectedKeys(["admin-lichgiangday"]);
    return {
      subjectGroup,
      valueDayStartEndDay,
      onRangeChange,
      value1,
      filterOption,
      options,
      valueSubject,
      createTeachingSchedule,
      idTeacher,
      classroom,
      starDate,
      endDate,
      schoolDay,
      startPeriod,
      endPeriod,
      semester,
      errors,
      checkSchoolDay,

      semesterOptions,
      handleSemesterChange,
    };
  },
});
</script>
