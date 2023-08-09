const deleteWithExamDefId = "DELETE FROM examInstance WHERE examdif=$1"
const addExamInstance = "INSERT INTO examInstance (examDif,generatedLink,createdBy,takenBy,qStatus) VALUES ($1,$2,$3,$4,$5)"
const getAllExamInstances = "SELECT * FROM examInstance"
const getExamInstanceById = "SELECT * FROM examInstance WHERE id=$1"
const deleteById = "DELETE FROM examInstance WHERE id=$1"


function updateExamInstancetByID (id, cols) {
    var query = ['UPDATE examInstance'];
    query.push('SET');

    var set = [];
    Object.keys(cols).forEach(function (key, i) {
      set.push(key + ' = ($' + (i + 1) + ')'); 
    });
    query.push(set.join(', '));
    query.push('WHERE id = ' + id );
  
    return query.join(' ');
  }

function getExamInstances (cols) {
  var query = ['SELECT * FROM examInstance WHERE '];
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
      
    set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', '));
  
  return query.join(' ');
}

module.exports = {  
    deleteWithExamDefId,
    addExamInstance,
    getAllExamInstances,
    getExamInstanceById,
    deleteById,
    updateExamInstancetByID,
    getExamInstances
}