package com.mmbapin.taskmanagement.rest;


import com.mmbapin.taskmanagement.entity.Person;
import com.mmbapin.taskmanagement.expection.TaskNotFoundException;
import com.mmbapin.taskmanagement.service.PersonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/persons")
public class PersonRestController {

    private PersonService personService;

    public PersonRestController(PersonService personService) {
        this.personService = personService;
    }

    //Get All Persons
    @GetMapping()
    public Page<Person> getAllPersons(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "asc") String sortOrder
    ) {
        Sort.Direction sortDirection = sortOrder.equalsIgnoreCase("asc")? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, sortDirection, sortBy);
        return personService.findAllPaged(pageable);
    }

    // Get a person by ID
    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable int id) {
        Person person = personService.findById(id);

        if(person == null){
            throw new TaskNotFoundException("Person not found");
        }

        return personService.findById(id);
    }

    // Create a new person
    @PostMapping()
    public Person createPerson(@RequestBody Person person) {
        System.out.println("Creating new person: " + person);
        return personService.save(person);
    }


    // Update a person by ID
    @PutMapping("/{id}")
    public Person updatePerson(@PathVariable int id, @RequestBody Person updatedPerson) {
        Person person = personService.findById(id);

        if(person == null){
            throw new TaskNotFoundException("Person not found");
        }

        updatedPerson.setId(id);
        return personService.save(updatedPerson);
    }



    // Delete a person by ID
    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable int id) {
        Person person = personService.findById(id);

        if(person == null){
            throw new TaskNotFoundException("Person not found");
        }

        personService.deleteById(id);
    }
}
