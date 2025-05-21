package com.mmbapin.taskmanagement.repository;

import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Integer> {
    List<Todo> findByPerson_Id(int personId);
}
