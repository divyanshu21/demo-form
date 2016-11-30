var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

router.post('/register', registerUser);
router.post('/authenticate', authenticateUser);
router.get('/contactlist',contactList);
router.post('/contactlist',contact);
router.put('/contactlist/:id',updateEmployee);
router.get('/contactlist/:id',editEmployee);
router.delete('/contactlist/:id',deleteEmployee);

module.exports = router;


/**
 * Process new employee data
 * @param req
 * @param res
 */
function contact(req,res){
    userService.contact(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/**
 * Fetch all employees
 * @param req
 * @param res
 */
function contactList(req,res){
    userService.contactlist(function(err,list){
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).send(list);
        }
    });
}


/**
 * Delete an existing employee
 * @param req
 * @param res
 */
function deleteEmployee(req,res){
    console.log('deleting employee ' ,req.params.id);
    userService.deleteEmployee(req.params.id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/**
 * Edit an existing employee
 * @param req
 * @param res
 */
function editEmployee(req,res){
    console.log('editing employee ' ,req.params.id);
    userService.editEmployee(req.params.id)
        .then(function (emp) {
            res.status(200).send(emp);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/**
 * Update an existing employee
 * @param req
 * @param res
 */
function updateEmployee(req,res){
    console.log('updating employee ' ,req.params.id);
    var emp = req.body;
    console.log("employee" ,emp);
    userService.updateEmployee(req.params.id,emp)
        .then(function (emp) {
            res.status(200).send(emp);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



/**
 * Authenticate user login details
 * @param req
 * @param res
 */
function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                res.send({ token: token });
            } else {

                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Sign up details for a new user
 * @param req
 * @param res
 */
function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}




