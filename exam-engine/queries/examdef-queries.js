const getAll = "SELECT * FROM examDefination"
const getById = "SELECT * FROM examDefination WHERE id=$1"
const deleteById = "DELETE FROM examDefination WHERE id=$1"
const addDef = "INSERT INTO examDefination (name,passing_score,questions,createdby) VALUES ($1,$2,$3,$4)"
const updateDefName = "UPDATE examDefination SET name=$1 WHERE id=$2"

function getAllByFilters (cols) {
    var query = ['SELECT * FROM examDefination WHERE '];
    var set = [];
    Object.keys(cols).forEach(function (key, i) {
        
      set.push(key + ' = ($' + (i + 1) + ')'); 
    });
    query.push(set.join(', '));
    
    return query.join(' ');
  }

module.exports = {
    getAll,
    getById,
    deleteById,
    addDef,
    updateDefName,
    getAllByFilters
}