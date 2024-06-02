import { where } from "sequelize";
import db, { sequelize } from "../models/index";
import bcrypt from "bcryptjs";
import QueryTypes from "sequelize";
import subjects from "../models/subjects";

const serviceCreateNewTeacher = async (data) => {
  try {
    if (
      !data.teachername ||
      !data.birthDate ||
      !data.startDate ||
      !data.gender ||
      !data.userId ||
      !data.subjectId
    ) {
      return {
        EM: "All fields are required!!!",
        EC: 1,
        DT: [],
      };
    } else {
      let res = await db.teachers.create({
        teachername: data.teachername,
        birthDate: data.birthDate,
        startDate: data.startDate,
        subjectId: data.subjectId,
        gender: data.gender,
        userId: data.userId,
      });
      return {
        EM: "success",
        EC: 0,
        DT: res,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrong with service",
      EC: 1,
      DT: [],
    };
  }
};

const getAllTeacherService = async () => {
  let data = [];
  console.log("CHAYVAO");
  try {
    data = await db.teachers.findAll();
    console.log("DATA", data);
    return {
      EM: "success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrong with service",
      EC: 0,
      DT: data,
    };
  }
};

const getTeacherByIdService = async (id) => {
  let data = {};
  data = await db.teachers.findByPk(id);
  return data.get({ plain: true });
};

const updateTeacherService = async (data, id) => {
  try {
    let user = await db.teachers.findOne({
      where: { id: id },
    });
    if (user) {
      await user.update({
        teachername: data.teachername,
        birthDate: data.birthDate,
        startDate: data.startDate,
        subjectId: data.subjectId,
        gender: data.gender,
        userId: data.userId,
      });
      return {
        EM: "Update user succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "User not found",
        EC: 1,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong with service",
      EC: 1,
      DT: "",
    };
  }
};

const deleteTeacherService = async (id) => {
  try {
    let teacher = await db.teachers.findOne({
      where: {
        id: id,
      },
      include: {
        model: db.User,
      },
    });
    if (teacher) {
      let user = teacher.User;
      console.log(teacher);
      console.log(user);
      await user.update({
        isLocked: 1,
      });
      return {
        EM: "Delete Succeed!!!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "User not found!!!",
        EC: 1,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong with service!!!",
      EC: 1,
      DT: "",
    };
  }
};

const getAllClassNotAssignBySubject = async (teacherId, year) => {
  let subjectId = await db.teachers.findOne({
    where: {
      id: teacherId,
    },
    attributes: ["subjectId"],
  });
  let classes = await sequelize.query(
    `select * from classes 
  where classes.id not in (select classes.id from classes left join assignments 
  on classes.id = assignments.classId left join grades on grades.id = classes.gradeId
  left join teachers on assignments.teacherId = teachers.id
  where teachers.subjectId = :subjectid and grades.year = :year)`,
    {
      replacements: { subjectid: subjectId.subjectId, year: year },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return {
    EM: "success.",
    EC: 1,
    DT: classes,
  };
};

const getAllTeacherBySubjectName = async(subjectName) => {
  try {
    let subjectTemp = await db.subjects.findOne({
      where: {
        subjectname: subjectName,
      }
    })
    let subject = subjectTemp.get({plain: true});
    console.log(subject);
    let teacher = await db.findAll({
      where: {
        subjectId: subject.id,
      }
    })
    return {
      EM: "success.",
      EC: 0,
      DT: teacher,
    };
  } catch(e) {
    console.log(e);
    return {
      EM: "can't find any teacher!!!",
      EC: 1,
      DT: "",
    };
  }
} 

const getAllTeacherForEachSubject = async() => {
  try {
    let data = await db.subjects.findAll({
      attributes:['subjectname', 'id'],
      include:[
        {
          model: db.teacher,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      ]
    });
    return {
      EM: "success.",
      EC: 0,
      DT: data,
    };
  } catch(e) {
    console.log(e);
    return {
      EM: "wrong subject or this school doesn't have teachers!!!",
      EC: 1,
      DT: "",
    };
  }
}

const getAllTeacherBySubjectId = async(subjectId) => {
  try {
    let data = await db.teachers.findAll({
      where: {
        subjectId: subjectId,
      },
      attributes: ['id', 'teachername', 'gender'],
      include: [
        {
          model: db.subjects,
          attributes: ['subjectname'],
        }
      ]
    })
    return {
      EM: "success",
      EC: 1,
      DT: data,
    };
  } catch(e) {
    console.log(e);
    return {
      EM: "teacher not found",
      EC: 1,
      DT: "",
    };
  }
} 

module.exports = {
  serviceCreateNewTeacher,
  getAllTeacherService,
  getTeacherByIdService,
  updateTeacherService,
  deleteTeacherService,
  getAllClassNotAssignBySubject,
  getAllTeacherBySubjectName,
  getAllTeacherForEachSubject,
  getAllTeacherBySubjectId
};
