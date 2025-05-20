package com.mmbapin.taskmanagement.entity;

import jakarta.persistence.*;


@Entity
@Table(name="todo")
public class Todo {

    //define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="task_name")
    private String taskName;

    @Column(name="assign_person_name")
    private String assignPersonName;

    @Column(name="status")
    private String status;

    //define constructor
    public Todo() {}

    public Todo(String taskName, String assignPersonName, String status) {
        this.taskName = taskName;
        this.assignPersonName = assignPersonName;
        this.status = status;
    }


    //define getter/setter

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getAssignPersonName() {
        return assignPersonName;
    }

    public void setAssignPersonName(String assignPersonName) {
        this.assignPersonName = assignPersonName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    //define toString

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", taskName='" + taskName + '\'' +
                ", assignPersonName='" + assignPersonName + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
