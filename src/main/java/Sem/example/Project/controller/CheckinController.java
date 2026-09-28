package Sem.example.Project.controller;

import Sem.example.Project.entity.CheckIn;
import Sem.example.Project.service.CheckInService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkins")
@CrossOrigin
public class CheckinController {

    private final CheckInService checkInService;

    public CheckinController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    // Get all check-ins
    @GetMapping
    public List<CheckIn> getAllCheckIns() {
        return checkInService.getAllCheckIns();
    }

    // Get check-in by ID
    @GetMapping("/{id}")
    public CheckIn getCheckInById(@PathVariable Long id) {
        return checkInService.getCheckInById(id);
    }

    // Check in a member
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckIn checkInMember(@RequestParam Long memberId) {
        return checkInService.checkInMember(memberId);
    }

    // Get current month's check-ins
    @GetMapping("/month")
    public List<CheckIn> getCurrentMonthCheckIns() {
        return checkInService.getCurrentMonthCheckIns();
    }

    // Get member's current month attendance count
    @GetMapping("/member/{memberId}/count")
    public Map<String, Object> getAttendanceCount(
            @PathVariable Long memberId) {

        return Map.of(
                "memberId", memberId,
                "currentMonthCount",
                checkInService.getCurrentMonthAttendance(memberId)
        );
    }

    // Get member's check-in history
    @GetMapping("/member/{memberId}")
    public List<CheckIn> getMemberCheckIns(
            @PathVariable Long memberId) {

        return checkInService.getMemberCheckIns(memberId);
    }

    // Delete check-in
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCheckIn(@PathVariable Long id) {
        checkInService.deleteCheckIn(id);
    }
}
