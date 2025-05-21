package com.mmbapin.taskmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="person_id")
    @JsonIgnoreProperties("todos") // Prevents infinite recursion in JSON
    private Person person;

    @Column(name="status")
    private String status;

    // Transient field to maintain backward compatibility
    @Transient
    private String assignPersonName;

    //define constructor
    public Todo() {}

    public Todo(String taskName, String status) {
        this.taskName = taskName;
        this.status = status;
    }

    // Constructor for backward compatibility
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

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and setter for backward compatibility
    public String getAssignPersonName() {
        return person != null ? person.getName() : assignPersonName;
    }

    public void setAssignPersonName(String assignPersonName) {
        this.assignPersonName = assignPersonName;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", taskName='" + taskName + '\'' +
                ", person=" + (person != null ? person.getName() : "null") +
                ", status='" + status + '\'' +
                '}';
    }
}



