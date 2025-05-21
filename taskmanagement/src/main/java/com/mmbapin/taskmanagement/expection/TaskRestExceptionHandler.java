package com.mmbapin.taskmanagement.expection;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class TaskRestExceptionHandler {
    // Add an exception handler for TaskNotFoundException
    @ExceptionHandler
    public ResponseEntity<TaskErrorResponse> handleException(TaskNotFoundException exc) {
        // Create a TodoErrorResponse
        TaskErrorResponse error = new TaskErrorResponse();

        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setMessage(exc.getMessage());
        error.setTimeStamp(System.currentTimeMillis());

        // Return ResponseEntity
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Add another exception handler to catch any exception (catch all)
    @ExceptionHandler
    public ResponseEntity<TaskErrorResponse> handleException(Exception exc) {
        // Create a TodoErrorResponse
        TaskErrorResponse error = new TaskErrorResponse();

        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setMessage(exc.getMessage());
        error.setTimeStamp(System.currentTimeMillis());

        // Return ResponseEntity
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
