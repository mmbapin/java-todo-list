package com.mmbapin.taskmanagement.service;

import com.mmbapin.taskmanagement.entity.Person;
import com.mmbapin.taskmanagement.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class PersonServiceImpl implements PersonService{
    private PersonRepository personRepository;

    @Autowired
    public PersonServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public List<Person> findAll() {
        return personRepository.findAll();
    }

    @Override
    public List<Person> findAllSorted(Sort sort) {
        return personRepository.findAll(sort);
    }

    @Override
    public Page<Person> findAllPaged(Pageable pageable) {
        return personRepository.findAll(pageable);
    }

    @Override
    public Person findById(int id) {
        Optional<Person> result = personRepository.findById(id);

        Person person = null;
        if (result.isPresent()) {
            person = result.get();
        } else {
            throw new RuntimeException("Did not find person id - " + id);
        }

        return person;
    }

    @Override
    public Person save(Person person) {
        return personRepository.save(person);
    }

    @Override
    public void deleteById(int id) {
        personRepository.deleteById(id);
    }
}
