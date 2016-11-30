var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var mongoose = require('mongoose');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('employees');

var service = {};

service.authenticate = authenticate;
service.create = create;
service.contactlist = contactlist;
service.contact = contact;
service.editEmployee = editEmployee;
service.updateEmployee = updateEmployee;
service.deleteEmployee = deleteEmployee;

module.exports = service;


/**
 * This function adds new employee to the db , if not already present
 * @param empData
 * @returns {*|promise}
 */
function contact(empData) {
    var deferred = Q.defer();           // Q promise library is used

    db.employees.findOne(               // check whether emp exists or not
        {email: empData.email},
        function (err, emp) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (emp) {

                deferred.reject('Employee "' + empData.email + '" already exists');
            } else {
                createEmployee();           // if emp not present in db , add it as a new employee
            }
        });

    function createEmployee() {             // add new emp details to db
        db.employees.insert(
            empData,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


/**
 * This function gets all employees from the db
 * @param cb
 */
function contactlist(cb){
    db.employees.find({}).toArray(function (err, elist) {
                if (err) {console.log(err);cb(err,null);}

                if (elist) {
                    console.log("Elist ",elist);
                    cb(null,elist);

                } else {
                   console.log('No employees exists');
                    cb(null,null);
                }
            });
}


/**
 * This function checks whether user authentication, if authenticated then login is granted
 * @param username
 * @param password
 * @returns {*|promise}
 */
function authenticate(username, password) {
    var deferred = Q.defer();

    console.log('username',username,'password',password);
    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}


/**
 * This function creates a new user to the db , if not already present
 * @param userParam
 * @returns {*|promise}
 */
function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        
        var user = _.omit(userParam, 'password');

        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


/**
 * This function deletes an existing employee from the db
 * @param empID
 * @returns {*|promise}
 */
function deleteEmployee(empID) {
    var deferred = Q.defer();
    empID = new mongo.ObjectID(empID);

    // validation
    db.employees.findOne(
        {_id: empID},
        function (err, emp) {
            console.log(err, emp);

            if (err) deferred.reject(err.name + ': ' + err.message);

            if (emp) {
                deleteEmployee();
            } else {
                deferred.reject('Employee with this ' +empID + ' doesn not exists');
            }
        });

    function deleteEmployee() {


        db.employees.remove(
            {_id: empID},
            function (err, done) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


/**
 * This function edits an existing employee from the db
 * @param empID
 * @returns {*|promise}
 */
function editEmployee(empID) {
    var deferred = Q.defer();
    empID = new mongo.ObjectID(empID);

    // validation
    db.employees.findOne(
        {_id: empID},
        function (err, emp) {
            console.log(err, emp);

            if (err) deferred.reject(err.name + ': ' + err.message);

            if (emp) {
                console.log("Emp with id : " ,empID , "Exists");
                deferred.resolve(emp);
            } else {
                deferred.reject('Employee with this ' +empID + ' doesn not exists');
            }
        });

    return deferred.promise;
}





/**
 * This function updates an existing employee from the db
 * @param empID
 * @returns {*|promise}
 */
function updateEmployee(empID,employee) {
    var deferred = Q.defer();
    empID = new mongo.ObjectID(empID);

    // validation
    db.employees.findOne(
        {_id: empID},
        function (err, emp) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (emp) {
                updateEmp();
            } else {
                deferred.reject('Employee with this ' +empID + ' doesn not exists');
            }
        });

    function updateEmp() {


        db.employees.updateOne(
            {_id: empID},{
                $set:{name:employee.name , email:employee.email,number:employee.number,empid:employee.empid}
            },
            function (err, done) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


