const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth')

//simple testing router
router.post('/task', async ( req, res ) => {
   res.send('Testing')
});


//This is used to read all Tasks
router.get('/users/tasks', auth, async (req, res) => {

    try {
        const tasks = await Task.find({ owner: userProfile._id });
        // await userProfile.populate('tasks').execPopulate()

        res.send({
            Message: 'Tasks Gotten successfully',
            // userProfile.tasks
            tasks
        })
    } catch (e) {
        res.status(500).send(e)
    }
});


//this is used to create task
router.post('/task/create', auth, async (req, res) => {

    //adding the owner id to help know who created the id
    const task = new Task({
        ...req.body,
        owner: userProfile._id
    });

    try {
        const taskNew = await task.save();
        res.status(201).send({taskNew})
    } catch(err) {
        res.status(400).send(err)
    }
});

//This is used to read Task by id
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const _id = req.params.id;
        // const taskId = await Task.findById(_id);

        const taskId = await Task.findOne({ _id, owner: userProfile._id })

        if( !taskId ) {
            return res.status(404).send( 'Error: Message Not Found')
        }
        res.status(200).send({
            Message: 'The Task is Gotten successfully',
            taskId
        })
    } catch(e) {
        res.status(500).send(e)
    }
});

//updating task items
router.patch('/task/update/:id', auth, async ( req, res ) => {

    //setting up validation for the keys to be updated
    const updates = Object.keys(req.body);
    const allowableTask = [ 'description', 'completed' ];
    const isValidTask = updates.every((update) => allowableTask.includes(update));

    //Prompt invalid task inputs
    if ( !isValidTask ) {
        return res.status(404).send(' Error: Invalid Task Input ')
    }

    const _id = req.params.id;

    //Send valid data for update
    try {
        if ( !updateTask ) {
            return res.status(404).send('Task not Found')
        }

        const updateTask = await Task.findOne({ _id, owner: userProfile._id })
        updates.forEach((update) => updateTask[update] = req.body[update])

        await updateTask.save()

        return res.status(200).send({
            Message: 'Update Successful',
            updateTask
        })
    }catch (e) {
        console.log(e)
    }
});

//deleting a single task
router.delete('/task/delete/:id', auth, async ( req, res ) => {

    const _id = req.params.id;

    try {
        const deletedTask = await Task.findByIdAndDelete({ _id, owner: userProfile._id });

        if (! deletedTask ) {
            return res.status(404).send()
        }

        res.send( deletedTask )
    } catch (e) {
        res.status(500).send(e)
    }

});

module.exports = router;