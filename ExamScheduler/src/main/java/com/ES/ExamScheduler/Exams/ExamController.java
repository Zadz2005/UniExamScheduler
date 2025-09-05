package com.ES.ExamScheduler.Exams;



import com.ES.ExamScheduler.Exams.ExamService;
import com.ES.ExamScheduler.Exams.Exam;
import com.ES.ExamScheduler.Exams.ExamPrimKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/exam")
public class ExamController {
    private final ExamService examService;

    @Autowired
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public List<Exam> getExams(@RequestParam(required = false) String name) {
        if (name != null) {
            return examService.getExamsByName(name);
        } else {
            return examService.getExams();
        }
    }

    @GetMapping("/multiple")
    public List<Exam> getExamsByNames(@RequestParam("names") List<String> names) {
        return examService.getExamsByNames(names);
    }

    @PostMapping
    public ResponseEntity<Exam> addExam(@RequestBody Exam newExam) {
        Exam createdExam = examService.addExam(newExam);
        return new ResponseEntity<>(createdExam, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Exam> updateExam(@RequestParam String name, @RequestParam String title, @RequestBody Exam updatedExam) {
        ExamPrimKey examKey = new ExamPrimKey(name, title);
        Exam resultExam = examService.updateExam(examKey, updatedExam);
        return resultExam != null ? new ResponseEntity<>(resultExam, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteExam(@RequestParam String name, @RequestParam String title) {
        ExamPrimKey examKey = new ExamPrimKey(name, title);
        examService.deleteExam(examKey);
        return ResponseEntity.noContent().build();
    }
}
