package com.mmbapin.taskmanagement.repository;

import com.mmbapin.taskmanagement.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Integer> {
}
