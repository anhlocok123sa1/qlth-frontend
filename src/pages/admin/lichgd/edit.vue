<template>
  <div class="row">
    <h3>{{ ten_mh }} nhóm {{ nmh }}</h3>
    <div class="col-sm-12 d-sm-flex justify-content-sm-end">
      <a-button
        style="margin-right: 3px"
        type="primary"
        @click="viewClassList()"
        >Danh sách lớp</a-button
      >
      <a-button type="primary" danger @click="openModal()"
        >Thêm sinh viên
      </a-button>
    </div>
    <br />
    <br />
    <div class="col-sm-12">
      <a-table :data-source="schedule" bordered>
        <a-table-column key="stt" title="Số buổi học" dataIndex="stt" />
        <a-table-column key="ngay_hoc" title="Ngày học" data-index="ngay_hoc" />
        <a-table-column
          key="phong_hoc"
          title="Phòng học"
          data-index="phong_hoc"
        />
        <a-table-column
          key="st_bd"
          title="Số tiết bắt đầu"
          data-index="st_bd"
        />
        <a-table-column
          key="st_kt"
          title="Số tiết kết thúc"
          data-index="st_kt"
        />
      </a-table>
    </div>
  </div>
  <!--  -->
  <a-modal v-model:open="openAddStudents" title="Basic Modal" @ok="handleOk">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
  <!-- danh sach sinh vien được thêm vào lịch gd -->
  <a-modal
    v-model:open="openStudentsTest"
    width="800px"
    @ok="addStudentsList"
    title="Danh sách sinh viên vừa nhập"
    :ok-button-props="{ style: { display: 'none' } }"
  >
    <a-table :data-source="studentsTest">
      <a-table-column key="stt" title="STT" dataIndex="stt" />
      <a-table-column key="ma_sv" title="Mã sinh viên" dataIndex="ma_sv" />
      <a-table-column key="ma_sv" title="Tên lớp" dataIndex="ten_lop" />
      <a-table-column key="ten_sv" title="Tên sinh viên" data-index="ten_sv" />

      <a-table-column
        key="ngay_sinh"
        title="Ngày sinh"
        data-index="ngay_sinh"
      />
      <a-table-column key="phai" title="Giới tính" data-index="phai" />
    </a-table>
    <a-popconfirm
      title="Nhấn oke để tiếp tục"
      @confirm="confirm"
      @cancel="cancel"
    >
      <a-button type="primary">Thêm</a-button>
    </a-popconfirm>
    <a-button @click="back" style="margin-left: 2px">Edit</a-button>
  </a-modal>
  <!-- modal thêm nhập thêm sinh viên -->
  <a-modal
    width="800px"
    v-model:open="openAddStudent"
    :title="`Thêm sinh viên vào môn học ${ten_mh} nhóm ${nmh}`"
    :ok-button-props="{ style: { display: 'none' } }"
  >
    <div class="row">
      <div class="col-sm-6">
        <a-textarea
          :rows="11"
          v-model:value="listID"
          placeholder="Nhập mã số sinh viên"
          allow-clear
        />
        <a-button type="primary" class="mt-2" @click="addStudent()"
          >Kiểm tra</a-button
        >
      </div>
      <div class="col-sm-6">
        <strong>Một số lưu ý khi nhập Mã số sinh viên:</strong>
        <br />
        <ol>
          <li>Mã sinh viên phải hợp lệ</li>
          <li>Mỗi mã sinh viên nằm trên 1 dòng</li>
          <li>
            Ví dụ:

            <br />
            <img src="../../../assets/addsv.png" alt="" width="100%" />
          </li>
        </ol>
      </div>
    </div>
  </a-modal>

  <!-- modal xem danh sách lớp  -->
  <a-modal
    v-model:open="open"
    width="1000px"
    :title="`Danh sách lớp môn ${ten_mh}`"
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <a-table :data-source="students">
      <a-table-column key="stt" title="STT" dataIndex="stt" />
      <a-table-column key="ma_sv" title="MSSV" dataIndex="ma_sv" />
      <a-table-column key="ten_sv" title="Tên sinh viên" data-index="ten_sv" />
      <a-table-column key="ten_lop" title="Lớp" data-index="ten_lop" />
      <a-table-column
        key="ngay_sinh"
        title="Ngày sinh"
        data-index="ngay_sinh"
      />
      <a-table-column key="phai" title="Giới tính" data-index="gioi_tinh" />
      <a-table-column key="action" title="Thao tác">
        <template #default="{ record }">
          <span>
            <a
              ><a-popconfirm
                title="Xóa sinh viên khỏi danh sách"
                ok-text="Yes"
                cancel-text="No"
                @confirm="() => delelteStudent(record.ma_sv)"
              >
                <a href="#"> <a-button danger block>Delete</a-button></a>
              </a-popconfirm></a
            >
          </span>
        </template>
      </a-table-column>
    </a-table>
  </a-modal>
</template>

<script>
import { onMounted, defineComponent, ref, computed, watch } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import axios from "../../../axios";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useMenu();
    const route = useRoute();
    const ten_mh = ref(route.params.ten_mh);
    const nmh = ref(route.params.nmh);
    const schedule = ref([]);
    const open = ref(false);
    const openAddStudent = ref(false);
    const openList = ref(false);
    const openStudentsTest = ref(false);
    const students = ref([]);
    const listID = ref("");
    const studentsTest = ref([]);
    const openAddStudents = ref(false);
    const router = useRouter();
    const back = () => {
      openAddStudent.value = true;
      openStudentsTest.value = false;
    };
    const delelteStudent = (ma_sv) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000, {});
      }).then(() => {
        axios
          .delete("delele-student-from-schedule", {
            data: {
              ma_sv: ma_sv,
              ma_gd: route.params.ma_gd,
            },
          })
          .then((response) => {
            message.success(response.data.message);
            viewClassList();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    };
    const confirm = (e) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000, {});
      }).then(() => {
        const students = studentsTest.value.map((student) => student.ma_sv);
        axios
          .post("add-students-to-schedule", {
            ma_gd: route.params.ma_gd,
            student_ids: students,
          })
          .then((response) => {
            message.success(response.data.message);
            setTimeout(() => {
              location.reload();
            }, 300);
          })
          .catch((error) => {});
      });
    };
    //
    const addStudentsList = () => {
      openAddStudents.value = true;
    };
    //
    const addStudent = () => {
      const studentIDs = listID.value
        .split("\n")
        .map((id) => id.trim())
        .filter((id) => id !== "");
      axios
        .post("/send-list-id", {
          student_ids: studentIDs,
        })
        .then((response) => {
          if (response.data.length == 0) {
            message.warning("Vui lòng kiểm tra lại mã số sinh viên");
            return;
          }
          studentsTest.value = response.data.map((student, index) => {
            return {
              ...student,
              ten_lop: student.lop.ten_lop,
              phai: student.phai == 1 ? "Nam" : "Nữ",
              stt: index + 1,
            };
          });
          openAddStudent.value = false;
          openStudentsTest.value = true;
          console.log(studentsTest.value);
        });
    };
    // Thêm sinh viên vào lịch gd
    const openModal = () => {
      openAddStudent.value = true;
    };

    // xem danh sách lớp
    const viewClassList = () => {
      axios.get(`/students/${route.params.ma_gd}`).then((response) => {
        if (response.data.length == 0) {
          message.warn("Chưa có sinh viên");
          return;
        }
        students.value = response.data.map((item, index) => ({
          ...item,
          stt: index + 1,
          gioi_tinh: item.phai == 1 ? "Nam" : "Nữ",
        }));
        open.value = true;
      });
    };

    onMounted(() => {
      // lấy danh sách thời khóa biểu
      axios.get(`/schedule/${route.params.ma_gd}`).then((response) => {
        schedule.value = response.data.map((item, index) => ({
          ...item,
          stt: index + 1,
        }));
        // console.log(response.data);
      });
    });
    store.onSelectedKeys(["admin-lichgiangday"]);
    return {
      ten_mh,
      nmh,
      schedule,
      open,
      openAddStudent,
      viewClassList,
      students,
      openModal,
      addStudent,
      listID,
      openList,
      studentsTest,
      openStudentsTest,
      addStudentsList,
      openAddStudents,
      confirm,
      delelteStudent,
      back,
    };
  },
});
</script>
