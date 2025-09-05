package com.ES.ExamScheduler.Exams;



import java.io.Serializable;
import java.util.Objects;

public class ExamPrimKey implements Serializable {
    private String name;
    private String title;

    public ExamPrimKey() {}

    public ExamPrimKey(String name, String title) {
        this.name = name;
        this.title = title;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExamPrimKey)) return false;
        ExamPrimKey examKey = (ExamPrimKey) o;
        return Objects.equals(name, examKey.name) &&
                Objects.equals(title, examKey.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, title);
    }
}