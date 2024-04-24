"use strict";
const { Model } = require("sequelize");
const { Hooks } = require("sequelize/lib/hooks");
const students = require("./students");
module.exports = (sequelize, DataTypes) => {
  class classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      classes.belongsTo(models.assignments, {
        foreignKey: "classId",
      });
      classes.belongsTo(models.grades, {
        foreignKey: "gradeId",
      });
      classes.hasMany(models.belongtoclasses, {
        foreignKey: "classId",
      });
      classes.belongsTo(models.teachers, {
        foreignKey: "homeroomTeacher",
      });
    }
  }
  classes.init(
    {
      classname: DataTypes.STRING,
      total: DataTypes.INTEGER,
      homeroomTeacher: DataTypes.INTEGER,
      gradeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "classes",
    }
  );
  // classes.addHook('afterSave', 'updateTotal', (instance, Option) => {
  //   return students.count({
  //     where: {
  //       classId: instance.id,
  //       isDeleted: 0
  //     }
  //   })
  //   .then(count => {
  //     return instance.update({
  //       total: count
  //     },
  //   {
  //     transaction: Option.transaction
  //   })
  //   })
  // })
  return classes;
};
