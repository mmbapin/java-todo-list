package com.mmbapin.taskmanagement.rest;


import com.mmbapin.taskmanagement.entity.Person;
import com.mmbapin.taskmanagement.entity.Todo;
import com.mmbapin.taskmanagement.service.PersonService;
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
    private PersonService personService;

    @Autowired
    public TodoRestController(TodoService todoService, PersonService personService) {
        this.todoService = todoService;
    }


    //expose "/todos" and return a list of tasks
//    @GetMapping("/todos")
//    public List<Todo> findAll(){
//        return todoService.findAll();
//    }
    @GetMapping("/todos")
    public List<Todo> findAll() {
        return todoService.findAll(Sort.by(Sort.Direction.ASC, "taskName"));
    }

    @GetMapping("/todos/{todoId}")
    public Todo getTodo(@PathVariable int todoId) {
        Todo todo = todoService.findById(todoId);

        if (todo == null) {
            throw new RuntimeException("Todo id not found - " + todoId);
        }

        return todo;
    }

    @GetMapping("/persons/{personId}/todos")
    public List<Todo> getTodosByPersonId(@PathVariable int personId) {
        return todoService.findByPersonId(personId);
    }

    @PostMapping("/todos")
    public Todo addTodo(@RequestBody Todo todo) {
        // Set id to 0 to force a save of new item instead of update
        todo.setId(0);

        return todoService.save(todo);
    }

    @PostMapping("/persons/{personId}/todos")
    public Todo addTodoForPerson(@PathVariable int personId, @RequestBody Todo todo) {
        // Set id to 0 to force a save of new item instead of update
        todo.setId(0);

        // Get the person and associate with todo
        Person person = personService.findById(personId);
        todo.setPerson(person);

        return todoService.save(todo);
    }

    @PutMapping("/todos")
    public Todo updateTodo(@RequestBody Todo todo) {
        return todoService.save(todo);
    }

    @PutMapping("/todos/{todoId}/person/{personId}")
    public Todo assignPersonToTodo(@PathVariable int todoId, @PathVariable int personId) {
        Todo todo = todoService.findById(todoId);
        Person person = personService.findById(personId);

        todo.setPerson(person);
        return todoService.save(todo);
    }
}
