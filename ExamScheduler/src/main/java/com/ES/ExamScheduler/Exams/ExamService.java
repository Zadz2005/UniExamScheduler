package com.ES.ExamScheduler.Exams;





import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ExamService {
    private final ExamRepository examRepository;

    @Autowired
    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public List<Exam> getExams() {
        return examRepository.findAll();
    }

    public List<Exam> getExamsByName(String name) {
        return examRepository.findAll().stream()
                .filter(exam -> exam.getName().toLowerCase().startsWith(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Exam addExam(Exam newExam) {
        return examRepository.save(newExam);
    }

    public Exam updateExam(ExamPrimKey examKey, Exam updatedExam) {
        Optional<Exam> optionalExam = examRepository.findByNameAndTitle(examKey.getName(), examKey.getTitle());
        if (optionalExam.isPresent()) {
            Exam currExam = optionalExam.get();
            currExam.setStartDate(updatedExam.getStartDate());
            currExam.setStartTime(updatedExam.getStartTime());
            currExam.setDuration(updatedExam.getDuration());
            currExam.setLocation(updatedExam.getLocation());
            return examRepository.save(currExam);
        }
        return null;
    }

    @Transactional
    public void deleteExam(ExamPrimKey examKey) {
        Optional<Exam> deletedExam = examRepository.findByNameAndTitle(examKey.getName(), examKey.getTitle());
        deletedExam.ifPresent(exam -> examRepository.deleteByNameAndTitle(examKey.getName(), examKey.getTitle()));
    }

    public List<Exam> getExamsByNames(List<String> names) {
        List<String> lowercaseNames = names.stream().map(String::toLowerCase).collect(Collectors.toList());
        return examRepository.findAll().stream()
                .filter(exam -> lowercaseNames.stream().anyMatch(name -> 
                    exam.getName().toLowerCase().startsWith(name)))
                .collect(Collectors.toList());
    }
}