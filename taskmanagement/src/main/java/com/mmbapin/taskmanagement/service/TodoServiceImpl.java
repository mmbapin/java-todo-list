package com.mmbapin.taskmanagement.service;


import com.mmbapin.taskmanagement.dao.TodoRepository;
import com.mmbapin.taskmanagement.entity.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class TodoServiceImpl implements TodoService{

    private TodoRepository todoRepository;

    @Autowired
    public TodoServiceImpl(TodoRepository theTodoRepository) {
        this.todoRepository = theTodoRepository;
    }


    @Override
    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    @Override
    public Page<Todo> findAll(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }

    @Override
    public List<Todo> findAll(Sort sort) {
        return todoRepository.findAll(sort);
    }

    @Override
    public Todo findById(int taskId) {
        Optional<Todo> result = todoRepository.findById(taskId);

        Todo theTask = null;

        if(result.isPresent()){
            theTask = result.get();
        }else{
            throw new RuntimeException("Did not find task id -" + taskId);
        }

        return theTask;
    }

    @Transactional
    @Override
    public Todo save(Todo theTask) {
        return todoRepository.save(theTask);
    }


    @Transactional
    @Override
    public void deleteById(int taskId) {
        todoRepository.deleteById(taskId);
    }
}
