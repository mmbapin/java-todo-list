package com.mmbapin.taskmanagement.service;

import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface TodoService {
    List<Todo> findAll();

    List<Todo> findAll(Sort sort);

    Todo findById(int id);

    List<Todo> findByPersonId(int personId);

    Todo save(Todo todo);

    void deleteById(int id);
}
