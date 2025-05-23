package com.mmbapin.taskmanagement.rest;


import com.mmbapin.taskmanagement.entity.Person;
import com.mmbapin.taskmanagement.entity.Todo;
import com.mmbapin.taskmanagement.expection.TaskNotFoundException;
import com.mmbapin.taskmanagement.service.PersonService;
import com.mmbapin.taskmanagement.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class TodoRestController {
    private TodoService todoService;
    private PersonService personService;

    @Autowired
    public TodoRestController(TodoService todoService, PersonService personService) {
        this.todoService = todoService;
        this.personService = personService;
    }


    @GetMapping("/todos")
    public Page<Todo> findAllPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "asc") String sortOrder
    ){
        Sort.Direction sortDirection = sortOrder.equalsIgnoreCase("asc")? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, sortDirection, sortBy);
        return todoService.findAllPaged(pageable);
    }


    @GetMapping("/todos/{todoId}")
    public Todo getTodo(@PathVariable int todoId) {
        Todo todo = todoService.findById(todoId);

        if (todo == null) {
            throw new TaskNotFoundException("Todo id not found - " + todoId);
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

        // Handle the Person relationship
        if (todo.getPerson() != null && todo.getPerson().getId() > 0) {
            int personId = todo.getPerson().getId();
            Person person = personService.findById(personId);

            if (person == null) {
                throw new TaskNotFoundException("Person id not found - " + personId);
            }

            // Replace the detached Person with the managed one
            todo.setPerson(person);
        } else {
            // If no valid person provided, set to null to avoid JPA issues
            todo.setPerson(null);
        }

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


    @DeleteMapping("/todos/{todoId}")
    public void deleteTodo(@PathVariable int todoId) {
        Todo todo = todoService.findById(todoId);
        if (todo == null) {
            throw new TaskNotFoundException("Todo id not found - " + todoId);
        }

        todoService.deleteById(todoId);
    }
}
