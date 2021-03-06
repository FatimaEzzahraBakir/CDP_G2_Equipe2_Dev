const Project = require('../models/project.model');
const Issue = require('../models/issue.model');
const Task = require('../models/task.model');
const Test = require('../models/test.model');
const Release = require('../models/release.model');
const User = require('../models/user.model');
const Sprint = require('../models/sprint.model');
const FlashError = require('../utils/flashError');
const { check, validationResult } = require('express-validator');

exports.validateNewProject = function () {
    return [
        check('name').not().isEmpty(),
        check('description').not().isEmpty()
    ];
}

exports.createProject = function (projectObject, user) {
    return new Promise(function (resolve) {
        let projectInstance = new Project(projectObject);
        projectInstance.save(function (err, project) {
            if (err) throw err;
            User.findOneAndUpdate(
                { login: user.login },
                { $push: { projects: project.id } },
                (err) => {
                    if (err) throw err;
                    resolve();
                }
            );
        });
    });
}

exports.deleteProject = function (project) {
    return new Promise(function (resolve) {

        let promises = [
            Task.deleteMany({ project: project.id }).exec(),
            Issue.deleteMany({ project: project.id }).exec(),
            Release.deleteMany({ project: project.id }).exec(),
            Test.deleteMany({ project: project.id}).exec(),
            Sprint.deleteMany({ project: project.id}).exec()
        ];

        User.updateMany(
            { _id: project.members },
            { $pull: { tasks: { $in: project.tasks }, projects: project.id } },
            (err) => {
                if (err) throw err;
                Promise.all(promises).then(() => {
                    Project.findByIdAndDelete(project.id, () => { resolve(); });
                });
            });
    });
}

exports.getMembers = function (members_id) {
    return new Promise(function (resolve) {
        let res = [];
        if (typeof members_id == 'undefined' || members_id.length == 0) {
            resolve(res);
        }
        let promises = [];
        members_id.forEach(member_id => {
            promises.push(User.findById(member_id).exec());
        });
        Promise.all(promises).then(values => {
            resolve(values);
        });
    });
}

exports.getIssues = function (project) {
    return new Promise(function (resolve) {
        let res = [];
        if (typeof project.issues == 'undefined' || project.issues.length === 0) {
            resolve(res);
        }
        let promises = [];
        project.issues.forEach(issue_id => {
            promises.push(Issue.findById(issue_id).exec());
        });
        Promise.all(promises).then(values => {
            resolve(values);
        });
    });
}

exports.getTasks = function (project) {
    return new Promise(function (resolve) {
        let res = [];
        if (typeof project.tasks == 'undefined' || project.tasks.length === 0) {
            resolve(res);
        }
        let promises = [];
        project.tasks.forEach(task_id => {
            promises.push(Task.findById(task_id).exec());
        });
        Promise.all(promises).then(values => {
            resolve(values);
        });
    });
}

exports.getTests = function (project) {
    return new Promise(function (resolve) {
        let res = [];
        if (typeof project.tests == 'undefined' || project.tests.length === 0) {
            resolve(res);
        }
        let promises = [];
        project.tests.forEach(test_id => {
            promises.push(Test.findById(test_id).exec());
        });
        Promise.all(promises).then(values => {
            resolve(values);
        });
    });
}

exports.getTest = function (project, test_id) {
    return new Promise(function (resolve) {
        let res = [];
        if (typeof project.tests == 'undefined' || project.tests.length === 0
            && typeof test_id == 'undefined') {
            resolve(res);
        }
        let promises = [];
        project.tests.forEach(tid => {
            if (tid == test_id)
                promises.push(Test.findById(tid).exec());
        });
        Promise.all(promises).then(values => {
            resolve(values);
        });
    });
}

exports.addMember = function (query, project_id) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate(
            query,
            { $addToSet: { projects: project_id } }, //ajoute project au user
            function (err, userInvited) {
                if (err) throw err;
                if (!userInvited) {
                    reject(new FlashError('L\'utilisateur n\'a pas été trouvé'));
                    return;
                }
                //ajoute user au project        
                Project.findOneAndUpdate(
                    { _id: project_id },
                    { $addToSet: { members: userInvited.id } },
                    function (err) {
                        if (err) throw err;
                        resolve();
                    }
                )
            }
        )
    });
}

exports.setUserDoc = function (project_id, userDoc) {
    return new Promise(function (resolve) {
        Project.findByIdAndUpdate(
            project_id,
            { userDoc: userDoc },
            (err) => {
                if (err) throw err;
                resolve();
            }
        );
    })
}

exports.setAdminDoc = function (project_id, adminDoc) {
    return new Promise(function (resolve) {
        Project.findByIdAndUpdate(
            project_id,
            { adminDoc: adminDoc },
            (err) => {
                if (err) throw err;
                resolve();
            }
        );
    })
}

exports.updateProject = function (project_id, name, description) {
    return new Promise(function (resolve) {
        Project.findOneAndUpdate({
            _id: project_id
        },
            {
                name: name,
                description: description
            },
            function (err) {
                if (err) throw err;
                resolve();
            });
    });
}