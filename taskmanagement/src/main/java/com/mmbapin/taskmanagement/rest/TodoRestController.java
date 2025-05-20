package com.mmbapin.taskmanagement.rest;


import com.mmbapin.taskmanagement.entity.Todo;
import com.mmbapin.taskmanagement.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TodoRestController {
    private TodoService todoService;

    @Autowired
    public TodoRestController(TodoService todoService) {
        this.todoService = todoService;
    }


    //expose "/todos" and return a list of tasks
//    @GetMapping("/todos")
//    public List<Todo> findAll(){
//        return todoService.findAll();
//    }
    @GetMapping("/todos")
    public Object findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "N") String allTasks
    ){
        if(allTasks.equalsIgnoreCase("Y")){
            Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            return todoService.findAll(sort);
        }else{
            Sort.Direction sortDirection = sortOrder.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            return todoService.findAll(pageable);
        }
    }



    //add mapping for GET /todos/{taskId}
    @GetMapping("/todos/{taskId}")
    public Todo getTask(@PathVariable int taskId){
        Todo theTask = todoService.findById(taskId);
        if (theTask == null) {
            throw new TaskNotFoundException("Task not found with id: " + taskId);
        }
        return theTask;
    }


    //add mapping for POST /todos - add new task
    @PostMapping("/todos")
    public Todo addTasks(@RequestBody Todo theTask){
        theTask.setId(0);

        Todo dbTask = todoService.save(theTask);

        return dbTask;
    }


    //add mapping for PUT /todos - update existing task
    @PutMapping("/todos")
    public Todo updateTask(@RequestBody Todo theTask){
        Todo dbTask = todoService.save(theTask);
        return dbTask;
    }


    //add mapping for DELETE /todos/{taskId} - delete task
    @DeleteMapping("/todos/{taskId}")
    public String deleteTask(@PathVariable int taskId){
        Todo tempTask = todoService.findById(taskId);

        if(tempTask == null){
            throw new TaskNotFoundException("Task not found for id - " + taskId);
        }

        todoService.deleteById(taskId);
        return "Deleted employee with id - " + taskId;
    }




}
