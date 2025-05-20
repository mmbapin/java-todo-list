package com.mmbapin.taskmanagement.dao;

import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Integer> {
}
