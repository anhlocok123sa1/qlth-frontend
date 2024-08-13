<template>
  <h3>TẠO LỊCH ĐIỂM DANH</h3>
  <br />
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
      <a-input-number
        v-model:value="subjectGroup"
        min="1"
        max="100"
        placeholder="15"
        style="width: 60px"
      />
      <br />
      <small v-if="errors.nmh" class="text-danger">{{ errors.nmh[0] }}</small>
      <!-- <a-radio-group v-model:value="subjectGroup">
        <a-radio :value="1">1</a-radio>
        <a-radio :value="2">2</a-radio>
        <a-radio :value="3">3</a-radio>
        <a-radio :value="4">4</a-radio>
        <a-radio :value="5">5</a-radio>
      </a-radio-group> -->
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
    <!-- Học kỳ -->
    <a-form-item label="Học kỳ">
      <a-select
        v-model="selectedSemester"
        placeholder="Chọn học kỳ"
        @change="handleSemesterChange"
      >
        <a-select-option
          v-for="semester in semesterOptions"
          :key="semester"
          :value="semester"
        >
          Học kỳ {{ semester[0] }} năm học 20{{ semester[1] }}{{ semester[2] }}
        </a-select-option>
      </a-select>
      <br />
      <small v-if="errors.hoc_ky" class="text-danger">{{
        errors.hoc_ky[0]
      }}</small>
    </a-form-item>
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

    <!-- Buổi học -->
    <div v-for="(session, index) in sessions" :key="index">
      <a-form-item :label="'Thứ '">
        <a-input-number
          v-model:value="session.thu_hoc"
          min="2"
          max="8"
          placeholder="Thứ"
          style="width: 60px"
        />
        <br />
        <small
          v-if="errors[`sessions[${index}].thu_hoc`]"
          class="text-danger"
          >{{ errors[`sessions[${index}].thu_hoc`][0] }}</small
        >
      </a-form-item>
      <a-form-item :label="'Tiết bắt đầu '">
        <a-input-number
          v-model:value="session.st_bd"
          min="1"
          max="15"
          placeholder="1"
          style="width: 60px"
        />
        <br />
        <small v-if="errors[`sessions[${index}].st_bd`]" class="text-danger">{{
          errors[`sessions[${index}].st_bd`][0]
        }}</small>
      </a-form-item>
      <a-form-item :label="'Tiết kết thúc '">
        <a-input-number
          v-model:value="session.st_kt"
          min="1"
          max="15"
          placeholder="3"
          style="width: 60px"
        />
        <br />
        <small v-if="errors[`sessions[${index}].st_kt`]" class="text-danger">{{
          errors[`sessions[${index}].st_kt`][0]
        }}</small>
      </a-form-item>
      <a-form-item :label="'Phòng học '">
        <a-input
          v-model:value="session.phong_hoc"
          style="width: 200px"
          placeholder="Phòng học"
          maxlength="4"
        />
        <br />
        <small
          v-if="errors[`sessions[${index}].phong_hoc`]"
          class="text-danger"
          >{{ errors[`sessions[${index}].phong_hoc`][0] }}</small
        >
      </a-form-item>
      <a-button
        v-if="showRemoveButton"
        @click="removeSession(index)"
        style="margin-bottom: 20px"
        >Xóa buổi</a-button
      >
    </div>

    <a-button danger @click="addSession" type="primary">Thêm buổi</a-button>
    <a-button
      @click="createTeachingSchedule()"
      type="primary"
      style="margin-left: 5px; margin-bottom: 20px"
      >Tạo lịch</a-button
    >
    <router-link
      :to="{
        name: 'admin-lichgiangday',
      }"
    >
      <span class="item-link">
        <a-button style="margin-left: 5px">Hủy</a-button>
      </span>
    </router-link>
  </a-form>
</template>

<script>
import { onMounted, defineComponent, ref, computed, watch } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import dayjs from "dayjs";
import axios from "../../../axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useMenu();
    const subjectGroup = ref(null);
    const valueDayStartEndDay = ref("");
    const value1 = ref(dayjs());
    const options = ref([]);
    const valueSubject = ref(null);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const idTeacher = ref(magv);
    const classroom = ref("C801");
    const starDate = ref("");
    const endDate = ref("");
    const showRemoveButton = ref(false);
    const sessions = ref([
      { thu_hoc: null, st_bd: null, st_kt: null, phong_hoc: "C801" },
    ]);
    const semester = ref("124");
    const errors = ref({});
    const router = useRouter();

    onMounted(() => {
      console.log("1", magv.value);
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

    const addSession = () => {
      showRemoveButton.value = true;
      sessions.value.push({
        thu_hoc: null,
        st_bd: null,
        st_kt: null,
        phong_hoc: "",
      });
    };

    const removeSession = (index) => {
      sessions.value.splice(index, 1);
    };

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
      const adjustedSessions = sessions.value.map((session) => ({
        ...session,
        thu_hoc: checkSchoolDay(session.thu_hoc),
      }));

      if (checkOverlap(adjustedSessions)) {
        message.warn("Thông tin đăng ký bị trùng.");
        return;
      }
      axios
        .post("/create-schedule-custom", {
          ma_gv: magv.value,
          ma_mh: valueSubject.value,
          nmh: subjectGroup.value,
          phong_hoc: classroom.value,
          ngay_bd: starDate.value,
          ngay_kt: endDate.value,
          st_bd: sessions.value[0]?.st_bd,
          st_kt: sessions.value[0]?.st_kt,
          hoc_ky: semester.value,
          buoi_hoc: adjustedSessions,
        })
        .then((response) => {
          message.success(response.data.message);
          router.push({ name: "admin-lichgiangday" });
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errors.value = error.response.data.errors;
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
        semesterss.push(`1${currentYearShort}`);
        semesterss.push(`2${currentYearShort}`);
      } else if (currentMonth <= 1) {
        semesterss.push(`1${prevYearShort}`);
        semesterss.push(`2${currentYearShort}`);
      } else if (currentMonth >= 2 && currentMonth <= 6) {
        semesterss.push(`2${currentYearShort}`);
        semesterss.push(`3${currentYearShort}`);
      } else if (currentMonth >= 7 && currentMonth <= 8) {
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

    const checkOverlap = (sessions) => {
      for (let i = 0; i < sessions.length; i++) {
        for (let j = i + 1; j < sessions.length; j++) {
          if (
            sessions[i].thu_hoc === sessions[j].thu_hoc &&
            ((sessions[i].st_bd <= sessions[j].st_kt &&
              sessions[i].st_kt >= sessions[j].st_bd) ||
              (sessions[j].st_bd <= sessions[i].st_kt &&
                sessions[j].st_kt >= sessions[i].st_bd))
          ) {
            return true;
          }
        }
      }
      return false;
    };
    watch(
      semesterOptions,
      (newOptions) => {
        if (newOptions.length > 0) {
          selectedSemester.value = newOptions[0];
        }
      },
      { immediate: true }
    );

    return {
      componentDisabled: ref(false),
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      subjectGroup,
      valueDayStartEndDay,
      value1,
      dateFormat: "YYYY-MM-DD",
      options,
      valueSubject,
      classroom,
      sessions,
      starDate,
      endDate,
      errors,
      semester,
      magv,
      idTeacher,
      filterOption,
      onRangeChange,
      addSession,
      removeSession,
      createTeachingSchedule,
      showRemoveButton,
      semesterOptions,
      selectedSemester,
      handleSemesterChange,
      checkOverlap,
    };
  },
});
</script>
