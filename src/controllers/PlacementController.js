const CSV = require("../models/CSV");
const Placement = require("../models/Placement");

const addPlacementRecords = async (req, res) => {
  let responseArray = [];
  try {
    // Fetching all distinct programs for collegeId and year
    const distinct_program_array = await CSV.distinct("program", {
      collegeId: "62fa2a7cfa0d385762e2948c",
      year: "2022",
    });

    // Fetching all distinct branch for each year
    for (let i = 0; i < distinct_program_array.length; i++) {
      distinct_branch_array = await CSV.distinct("branch", {
        program: distinct_program_array[i],
        collegeId: "62fa2a7cfa0d385762e2948c",
        year: "2022",
      });

      for (let j = 0; j < distinct_branch_array.length; j++) {
        const responseObj = {};
        responseObj.collegeId = req.body.collegeId;
        responseObj.program = distinct_program_array[i];
        responseObj.branch = distinct_branch_array[j];
        count_placed_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          status: "Employed",
        });

        responseObj.placedStudentCount = count_placed_student;

        count_unplaced_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          status: "Unemployed",
        });
        responseObj.unplacedStudentCount = count_unplaced_student;

        count_male_placed_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          gender: "Male",
          status: "Employed",
        });

        responseObj.malePlacedStudentCount = count_male_placed_student;

        count_male_unplaced_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          gender: "Male",
          status: "Unemployed",
        });

        responseObj.maleUnplacedStudentCount = count_male_unplaced_student;

        count_female_placed_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          gender: "Female",
          status: "Employed",
        });

        responseObj.femalePlacedStudentCount = count_female_placed_student;

        count_female_unplaced_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          gender: "Female",
          status: "Unemployed",
        });
        responseObj.femaleUnplacedStudentCount = count_female_unplaced_student;

        count_minority_student = await CSV.countDocuments({
          program: distinct_program_array[i],
          branch: distinct_branch_array[j],
          collegeId: "62fa2a7cfa0d385762e2948c",
          year: "2022",
          minority: "true",
          status: { $not: { $eq: "Higher studies" } },
        });
        responseObj.minorityCount = count_minority_student;

        const category = ["Open", "OBC", "SC", "ST", "Other"];
        categoryTotalCount = {};

        for (let k = 0; k < category.length; k++) {
          count_category = await CSV.countDocuments({
            program: distinct_program_array[i],
            branch: distinct_branch_array[j],
            collegeId: "62fa2a7cfa0d385762e2948c",
            year: "2022",
            category: category[k],
            status: { $not: { $eq: "Higher studies" } },
          });

          categoryTotalCount[category[k]] = count_category;
        }
        responseObj.category = categoryTotalCount;

        const company = [
          "Fintech",
          "Product",
          "Startup",
          "Consultant",
          "Other",
        ];
        companyTotalCount = {};

        for (let k = 0; k < company.length; k++) {
          count_company = await CSV.countDocuments({
            program: distinct_program_array[i],
            branch: distinct_branch_array[j],
            collegeId: "62fa2a7cfa0d385762e2948c",
            year: "2022",
            company: company[k],
            status: { $not: { $eq: "Higher studies" } },
          });

          companyTotalCount[company[k]] = count_company;
        }
        responseObj.companyType = companyTotalCount;

        responseObj.year = 2022;
        responseObj.maleCount =
          responseObj.malePlacedStudentCount +
          responseObj.maleUnplacedStudentCount;
        responseObj.femaleCount =
          responseObj.femalePlacedStudentCount +
          responseObj.femaleUnplacedStudentCount;

        responseArray.push(responseObj);
        console.log(responseArray);
      }
    }
    // const placementData = await Placement.insertMany(responseArray);
    res.status(201).json(responseArray);
  } catch (error) {
    console.log(error);
  }
};

const deleteAllRecords = async (req, res) => {
  try {
    const records = await Placement.remove({});
    res.status(200).json({ message: "Deleted Successfully !" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addPlacementRecords, deleteAllRecords };
