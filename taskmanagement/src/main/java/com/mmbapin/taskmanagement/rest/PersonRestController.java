package com.mmbapin.taskmanagement.rest;


import com.mmbapin.taskmanagement.entity.Person;
import com.mmbapin.taskmanagement.expection.TaskNotFoundException;
import com.mmbapin.taskmanagement.service.PersonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonRestController {

    private PersonService personService;

    public PersonRestController(PersonService personService) {
        this.personService = personService;
    }

    //Get All Persons
    @GetMapping()
    public List<Person> getAllPersons() {
        return personService.findAll();
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
        return personService.save(person);
    }


    // Update a person by ID
    @PutMapping("/{id}")
    public Person updatePerson(@PathVariable int id, @RequestBody Person updatedPerson) {
        Person person = personService.findById(id);

        if(person == null){
            throw new TaskNotFoundException("Person not found");
        }

//        updatedPerson.setId(id);
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
