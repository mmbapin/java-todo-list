package com.mmbapin.taskmanagement.service;

import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface TodoService {
    List<Todo> findAll();

    Page<Todo> findAll(Pageable pageable);

    List<Todo> findAll(Sort sort);

    Todo findById(int taskId);

    Todo save(Todo theTask);

    void deleteById(int taskId);
}
