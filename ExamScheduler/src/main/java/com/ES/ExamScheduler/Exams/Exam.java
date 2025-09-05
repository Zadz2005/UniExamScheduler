package com.ES.ExamScheduler.Exams;



import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ExamSchedule") // <-- change to your actual new table name
@IdClass(ExamPrimKey.class)
public class Exam implements Serializable {

    @Id
    @Column(name = "Name")
    private String name;

    @Id
    @Column(name = "Title")
    private String title;

    @Column(name = "Start_Date")
    private LocalDate startDate;

    @Column(name = "Start_Time")
    private LocalTime startTime;

    @Column(name = "Exam_Duration")
    private String duration;  // HH:MM format

    @Column(name ="Location")
    private String location;  // Split by surname

    public Exam() {}

    public Exam(String name, String title, LocalDate startDate, LocalTime startTime, String duration, String location) {
        this.name = name;
        this.title = title;
        this.startDate = startDate;
        this.startTime = startTime;
        this.duration = duration;
        this.location = location;
    }

    // Getters
    public String getName() { return name; }
    public String getTitle() { return title; }
    public LocalDate getStartDate() { return startDate; }
    public LocalTime getStartTime() { return startTime; }
    public String getDuration() { return duration; }
    public String getLocation() { return location; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setTitle(String title) { this.title = title; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setLocation(String location) { this.location = location; }

    @Override
    public String toString() {
        return "Exam{" +
                "name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", startDate=" + startDate +
                ", startTime=" + startTime +
                ", duration='" + duration + '\'' +
                ", location='" + location + '\'' +
                '}';
    }

    public ExamPrimKey getExamKey() {
        return new ExamPrimKey(this.name, this.title);
    }

    public void setExamKey(ExamPrimKey examKey) {
        this.name = examKey.getName();
        this.title = examKey.getTitle();
    }
}