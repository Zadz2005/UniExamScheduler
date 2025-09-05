package com.ES.ExamScheduler.Exams;



import com.ES.ExamScheduler.Exams.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, String> {
    Optional<Exam> findByNameAndTitle(String name, String title);
    void deleteByNameAndTitle(String name, String title);
}
