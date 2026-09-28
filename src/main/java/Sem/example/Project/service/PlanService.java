package Sem.example.Project.service;

import Sem.example.Project.entity.Plan;
import Sem.example.Project.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    // CREATE
    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }

    // READ ALL
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    // READ BY ID
    public Plan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Plan not found with ID: " + id));
    }

    // UPDATE
    public Plan updatePlan(Long id, Plan updatedPlan) {

        Plan existingPlan = getPlanById(id);

        existingPlan.setName(updatedPlan.getName());
        existingPlan.setDurationMonths(updatedPlan.getDurationMonths());
        existingPlan.setPrice(updatedPlan.getPrice());

        return planRepository.save(existingPlan);
    }

    // DELETE
    public void deletePlan(Long id) {

        Plan plan = getPlanById(id);

        planRepository.delete(plan);
    }
}
