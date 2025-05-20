package com.mmbapin.taskmanagement.service;

import com.mmbapin.taskmanagement.entity.Todo;

import java.util.List;

public interface TodoService {
    List<Todo> findAll();

    Todo findById(int taskId);

    Todo save(Todo theTask);

    void deleteById(int taskId);
}
