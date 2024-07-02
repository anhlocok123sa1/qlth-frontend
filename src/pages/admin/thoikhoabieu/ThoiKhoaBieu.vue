<template>
  <div>
    <table border="1" class="classTable">
      <tr class="head-tr">
        <th></th>
        <th>Thứ 2</th>
        <th>Thứ 3</th>
        <th>Thứ 4</th>
        <th>Thứ 5</th>
        <th>Thứ 6</th>
        <th>Thứ 7</th>
        <th>Chủ nhật</th>
        <th></th>
      </tr>
      <tr v-for="n in 15" :key="n">
        <td class="period head-tr">Tiết {{ n }}</td>
        <template v-for="day in days" :key="day">
          <template v-if="isLesson(day, n)">
            <template v-for="lesson in getLessons(day, n)" :key="lesson.ma_mh">
              <template v-if="n == lesson.st_bd">
                <a-popover title="Chi tiết">
                  <template #content>
                    <p>Mã môn học: {{lesson.ma_mh}}</p>
                    <p>Tên môn học: {{lesson.ten_mh}}</p>
                    <p>Phòng: {{lesson.phong_hoc}}</p>
                    <p>Giảng viên: {{lesson.ten_gv}}</p>
                  </template>
                  <td
                    :rowspan="lesson.st_kt - lesson.st_bd + 1"
                    class="active-td"
                  >
                    {{ lesson.ten_mh }}<br />
                    Phòng: {{ lesson.phong_hoc }}<br />
                    {{ lesson.ghi_chu }}
                  </td>
                </a-popover>
              </template>
              <template v-else> </template>
            </template>
          </template>
          <template v-else>
            <td></td>
          </template>
        </template>
        <td class="period head-tr">Tiết {{ n }}</td>
      </tr>
      <tr class="head-tr">
        <th></th>
        <th>Thứ 2</th>
        <th>Thứ 3</th>
        <th>Thứ 4</th>
        <th>Thứ 5</th>
        <th>Thứ 6</th>
        <th>Thứ 7</th>
        <th>Chủ nhật</th>
        <th></th>
      </tr>
    </table>
  </div>
</template>

<script>
import { defineComponent, toRefs } from "vue";

export default defineComponent({
  props: {
    data: Array,
  },
  setup(props) {
    const { data } = toRefs(props);
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const getLessons = (day, period) => {
      return data.value.filter((lesson) => {
        const lessonDay = new Date(lesson.ngay_hoc).toLocaleDateString(
          "en-US",
          { weekday: "long" }
        );
        return (
          lessonDay === day && period >= lesson.st_bd && period <= lesson.st_kt
        );
      });
    };

    const isLesson = (day, period) => {
      return getLessons(day, period).length > 0;
    };

    return {
      days,
      getLessons,
      isLesson,
    };
  },
});
</script>
<style>
.classTable {
  width: 100%;
  border-collapse: collapse;
}

.classTable th,
.classTable td {
  padding: 8px;
  text-align: center;
}

.period {
  font-weight: bold;
  background-color: #f0f0f0;
}
.active-td {
  background: beige;
  color: teal;
  font-weight: 700;
}
.head-tr {
  background-color: #6699cc;
  color: #fff;
}
</style>