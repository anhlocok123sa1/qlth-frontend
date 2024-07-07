<template>
  <div class="classTable-warp">
    <table class="classTable">
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
                    <p>Mã môn học: {{ lesson.ma_mh }}</p>
                    <p>Tên môn học: {{ lesson.ten_mh }}</p>
                    <p>Phòng: {{ lesson.phong_hoc }}</p>
                    <p>Giảng viên: {{ lesson.ten_gv }}</p>
                  </template>
                  <td
                    :rowspan="lesson.st_kt - lesson.st_bd + 1"
                    class="active-td"
                  >
                    <span>
                      {{ lesson.ten_mh }}<br />
                      Phòng: {{ lesson.phong_hoc }}<br />
                      {{ lesson.ghi_chu }}
                    </span>
                  </td>
                </a-popover>
              </template>
              <template v-else> </template>
            </template>
          </template>
          <template v-else>
            <td><span></span></td>
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
    <div class="mobile">
      <a-collapse v-model:activeKey="activeKey" @change="changeActivekey">
        <a-collapse-panel
          v-for="(lessons, day) in headers"
          :key="day"
          :header="day"
        >
          <a-collapse>
            <a-collapse-panel
              v-for="(courseLessons, course) in groupByCourse(lessons)"
              :key="course"
              :header="course"
            >
              <ul>
                <li v-for="lesson in courseLessons" :key="lesson.ma_mh">
                  Tiết: {{ lesson.st_bd }} - {{ lesson.st_kt }} -
                  Phòng: {{ lesson.phong_hoc }} - Giảng
                  viên: {{ lesson.ten_gv }}
                </li>
              </ul>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from "vue";

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

    // Mobile
    const headers = ref({});
    const activeKey = ref([]);
    const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;
    const changeActivekey = (key) => {
      console.log(key);
    };

    watch(
      data,
      (newData) => {
        activeKey.value = [];
        const groupedHeaders = {};
        newData.forEach((value) => {
          if (!groupedHeaders[value.dayOfWeek]) {
            groupedHeaders[value.dayOfWeek] = [];
          }
          groupedHeaders[value.dayOfWeek].push(value);
        });
        headers.value = groupedHeaders;
      },
      { immediate: true }
    );

    const groupByCourse = (lessons) => {
      return lessons.reduce((acc, lesson) => {
        if (!acc[lesson.ten_mh]) {
          acc[lesson.ten_mh] = [];
        }
        acc[lesson.ten_mh].push(lesson);
        return acc;
      }, {});
    };

    return {
      days,
      getLessons,
      isLesson,
      activeKey,
      text,
      changeActivekey,
      headers,
      groupByCourse,
    };
  },
});
</script>
<style>
.classTable-warp {
  width: 800px;
}
.classTable {
  border-collapse: collapse;
  font-size: 11px;
}

.classTable td {
  height: 33px;
  border: 1px solid #ccc;
}
.classTable th {
  border: 1px solid #ccc;
}

.classTable th,
.classTable td {
  padding: 4px 8px;
  text-align: center;
  width: 10%;
}
.classTable td span {
  font-weight: 700;
}

.classTable .period {
  font-weight: bold;
}
.active-td {
  background: beige;
  color: teal;
}
.head-tr {
  background-color: #6699cc;
  color: #fff;
}
@media screen and (max-width: 915px) {
  .classTable {
    display: none;
  }
}
@media screen and (min-width: 915px) {
  .mobile {
    display: none;
  }
}
</style>