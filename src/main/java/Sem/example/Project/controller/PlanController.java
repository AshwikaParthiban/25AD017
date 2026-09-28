package Sem.example.Project.controller;

import Sem.example.Project.entity.Plan;
import Sem.example.Project.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    // GET ALL PLANS
    @GetMapping
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }

    // GET PLAN BY ID
    @GetMapping("/{id}")
    public Plan getPlanById(@PathVariable Long id) {
        return planService.getPlanById(id);
    }

    // CREATE PLAN
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Plan createPlan(@Valid @RequestBody Plan plan) {
        return planService.createPlan(plan);
    }

    // UPDATE PLAN
    @PutMapping("/{id}")
    public Plan updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody Plan plan) {

        return planService.updatePlan(id, plan);
    }

    // DELETE PLAN
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
    }
}
