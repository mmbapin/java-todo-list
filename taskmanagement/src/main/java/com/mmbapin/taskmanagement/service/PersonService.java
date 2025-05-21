package com.mmbapin.taskmanagement.service;

import com.mmbapin.taskmanagement.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface PersonService {
    List<Person> findAll();

    List<Person> findAllSorted(Sort sort);

    Page<Person> findAllPaged(Pageable pageable);

    Person findById(int id);

    Person save(Person person);

    void deleteById(int id);
}
