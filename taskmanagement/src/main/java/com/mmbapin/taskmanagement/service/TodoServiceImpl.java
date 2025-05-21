package com.mmbapin.taskmanagement.service;


import com.mmbapin.taskmanagement.repository.TodoRepository;
import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TodoServiceImpl implements TodoService{

    private TodoRepository todoRepository;

    @Autowired
    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    @Override
    public List<Todo> findAll(Sort sort) {
        return todoRepository.findAll(sort);
    }

    @Override
    public Page<Todo> findAllPaged(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }

    @Override
    public Todo findById(int id) {
        Optional<Todo> result = todoRepository.findById(id);

        Todo todo = null;
        if (result.isPresent()) {
            todo = result.get();
        } else {
            return null;
        }

        return todo;
    }

    @Override
    public List<Todo> findByPersonId(int personId) {
        return todoRepository.findByPerson_Id(personId);
    }

    @Override
    public Todo save(Todo todo) {
        return todoRepository.save(todo);
    }

    @Override
    public void deleteById(int id) {
        todoRepository.deleteById(id);
    }
}
