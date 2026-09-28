const API = "/api";

let members = [];
let plans = [];
let memberships = [];


// ==================================================
// NAVIGATION
// ==================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document
        .getElementById(sectionId)
        .classList.add("active");


    // Load required data

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "members") {
        loadMembers();
    }

    if (sectionId === "plans") {
        loadPlans();
    }

    if (sectionId === "memberships") {

        loadMembers();
        loadPlans();
        loadMemberships();
        loadExpiringMemberships();
    }

    if (sectionId === "checkins") {

        loadMembers();
        loadCheckIns();
    }
}


// ==================================================
// MESSAGE
// ==================================================

function showMessage(message) {

    const element =
        document.getElementById("message");

    element.textContent = message;

    element.style.display = "block";

    setTimeout(() => {

        element.style.display = "none";

    }, 3000);
}


// ==================================================
// MEMBERS
// ==================================================

async function loadMembers() {

    try {

        const response =
            await fetch(`${API}/members`);

        if (!response.ok) {
            throw new Error("Could not load members");
        }

        members = await response.json();


        // Member list

        const list =
            document.getElementById("memberList");

        list.innerHTML = "";


        if (members.length === 0) {

            list.innerHTML =
                "<p>No members found.</p>";

        } else {

            members.forEach(member => {

                list.innerHTML += `

                    <div class="item">

                        <strong>
                            ${escapeHtml(member.name)}
                        </strong>

                        <br>

                        Email:
                        ${escapeHtml(member.email)}

                        <br>

                        Phone:
                        ${escapeHtml(member.phone)}

                        <br><br>

                        <button
                            onclick="deleteMember(${member.id})">
                            Delete
                        </button>

                    </div>
                `;
            });
        }


        // Dropdowns

        fillMemberDropdown(
            "membershipMember"
        );

        fillMemberDropdown(
            "renewMember"
        );

        fillMemberDropdown(
            "checkinMember"
        );


        document
            .getElementById("dashboardMembers")
            .textContent = members.length;

    } catch (error) {

        showMessage(error.message);

    }
}


// ==================================================
// ADD MEMBER
// ==================================================

document
    .getElementById("memberForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const member = {

                name:
                document
                    .getElementById("name")
                    .value,

                email:
                document
                    .getElementById("email")
                    .value,

                phone:
                document
                    .getElementById("phone")
                    .value
            };


            try {

                const response =
                    await fetch(
                        `${API}/members`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(member)
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json();

                    throw new Error(
                        error.error ||
                        "Failed to add member"
                    );
                }


                showMessage(
                    "Member added successfully"
                );


                event.target.reset();

                await loadMembers();

            } catch (error) {

                showMessage(error.message);
            }
        }
    );


// ==================================================
// DELETE MEMBER
// ==================================================

async function deleteMember(id) {

    if (!confirm(
        "Are you sure you want to delete this member?"
    )) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/members/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error(
                "Could not delete member"
            );
        }


        showMessage(
            "Member deleted successfully"
        );

        loadMembers();

    } catch (error) {

        showMessage(error.message);
    }
}


// ==================================================
// PLANS
// ==================================================

async function loadPlans() {

    try {

        const response =
            await fetch(`${API}/plans`);

        if (!response.ok) {
            throw new Error("Could not load plans");
        }

        plans = await response.json();


        const list =
            document.getElementById("planList");

        list.innerHTML = "";


        if (plans.length === 0) {

            list.innerHTML =
                "<p>No plans found.</p>";

        } else {

            plans.forEach(plan => {

                list.innerHTML += `

                    <div class="item">

                        <strong>
                            ${escapeHtml(plan.name)}
                        </strong>

                        <br>

                        Duration:
                        ${plan.durationMonths}
                        month(s)

                        <br>

                        Price:
                        ₹${plan.price}

                        <br><br>

                        <button
                            onclick="deletePlan(${plan.id})">
                            Delete
                        </button>

                    </div>
                `;
            });
        }


        fillPlanDropdown(
            "membershipPlan"
        );

        fillPlanDropdown(
            "renewPlan"
        );


        document
            .getElementById("dashboardPlans")
            .textContent = plans.length;

    } catch (error) {

        showMessage(error.message);

    }
}


// ==================================================
// ADD PLAN
// ==================================================

document
    .getElementById("planForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const plan = {

                name:
                document
                    .getElementById("planName")
                    .value,

                durationMonths:
                    Number(
                        document
                            .getElementById(
                                "durationMonths"
                            )
                            .value
                    ),

                price:
                    Number(
                        document
                            .getElementById("price")
                            .value
                    )
            };


            try {

                const response =
                    await fetch(
                        `${API}/plans`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(plan)
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json();

                    throw new Error(
                        error.error ||
                        "Failed to create plan"
                    );
                }


                showMessage(
                    "Plan added successfully"
                );


                event.target.reset();

                loadPlans();

            } catch (error) {

                showMessage(error.message);
            }
        }
    );


// ==================================================
// DELETE PLAN
// ==================================================

async function deletePlan(id) {

    if (!confirm(
        "Are you sure you want to delete this plan?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/plans/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete plan"
            );
        }


        showMessage(
            "Plan deleted successfully"
        );

        loadPlans();

    } catch (error) {

        showMessage(error.message);
    }
}


// ==================================================
// MEMBERSHIP
// ==================================================

async function loadMemberships() {

    try {

        const response =
            await fetch(
                `${API}/memberships`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load memberships"
            );
        }


        memberships =
            await response.json();


        const list =
            document.getElementById(
                "membershipList"
            );

        list.innerHTML = "";


        const today =
            new Date()
                .toISOString()
                .slice(0, 10);


        if (memberships.length === 0) {

            list.innerHTML =
                "<p>No memberships found.</p>";

        } else {

            memberships.forEach(membership => {

                const expired =
                    membership.expiryDate < today;


                list.innerHTML += `

                    <div class="item">

                        <strong>
                            ${escapeHtml(
                    membership.member.name
                )}
                        </strong>

                        <br>

                        Plan:
                        ${escapeHtml(
                    membership.plan.name
                )}

                        <br>

                        Start:
                        ${membership.startDate}

                        <br>

                        Expiry:
                        ${membership.expiryDate}

                        <br>

                        Status:

                        <span class="${
                    expired
                        ? "expired-status"
                        : "active-status"
                }">

                            ${
                    expired
                        ? "Expired"
                        : "Active"
                }

                        </span>

                        <br><br>

                        <button
                            onclick="deleteMembership(
                                ${membership.id}
                            )">

                            Delete

                        </button>

                    </div>
                `;
            });
        }


        const activeCount =
            memberships.filter(
                m => m.expiryDate >= today
            ).length;


        document
            .getElementById(
                "dashboardMemberships"
            )
            .textContent = activeCount;

    } catch (error) {

        showMessage(error.message);
    }
}


// ==================================================
// CREATE MEMBERSHIP
// ==================================================

document
    .getElementById("membershipForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const memberId =
                document
                    .getElementById(
                        "membershipMember"
                    )
                    .value;


            const planId =
                document
                    .getElementById(
                        "membershipPlan"
                    )
                    .value;


            try {

                const response =
                    await fetch(
                        `${API}/memberships?memberId=${memberId}&planId=${planId}`,
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json();

                    throw new Error(
                        error.error ||
                        "Failed to create membership"
                    );
                }


                showMessage(
                    "Membership created successfully"
                );


                event.target.reset();

                loadMemberships();
                loadExpiringMemberships();

            } catch (error) {

                showMessage(error.message);
            }
        }
    );


// ==================================================
// RENEW MEMBERSHIP
// ==================================================

document
    .getElementById("renewForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const memberId =
                document
                    .getElementById(
                        "renewMember"
                    )
                    .value;


            const planId =
                document
                    .getElementById(
                        "renewPlan"
                    )
                    .value;


            try {

                const response =
                    await fetch(
                        `${API}/memberships/renew?memberId=${memberId}&planId=${planId}`,
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json();

                    throw new Error(
                        error.error ||
                        "Failed to renew membership"
                    );
                }


                showMessage(
                    "Membership renewed successfully"
                );


                event.target.reset();

                loadMemberships();
                loadExpiringMemberships();

            } catch (error) {

                showMessage(error.message);
            }
        }
    );


// ==================================================
// EXPIRING MEMBERSHIPS
// ==================================================

async function loadExpiringMemberships() {

    try {

        const response =
            await fetch(
                `${API}/memberships/expiring`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load expiring memberships"
            );
        }


        const expiring =
            await response.json();


        const list =
            document.getElementById(
                "expiringList"
            );

        list.innerHTML = "";


        document
            .getElementById(
                "dashboardExpiring"
            )
            .textContent = expiring.length;


        if (expiring.length === 0) {

            list.innerHTML =
                "<p>No memberships expiring within 7 days.</p>";

            return;
        }


        expiring.forEach(membership => {

            list.innerHTML += `

                <div class="item">

                    <strong>
                        ${escapeHtml(
                membership.member.name
            )}
                    </strong>

                    <br>

                    Plan:
                    ${escapeHtml(
                membership.plan.name
            )}

                    <br>

                    Expiry:
                    ${membership.expiryDate}

                </div>
            `;
        });

    } catch (error) {

        showMessage(error.message);
    }
}


// ==================================================
// CHECK-IN
// ==================================================

document
    .getElementById("checkinForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const memberId =
                document
                    .getElementById(
                        "checkinMember"
                    )
                    .value;


            try {

                const response =
                    await fetch(
                        `${API}/checkins?memberId=${memberId}`,
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json();

                    throw new Error(
                        error.error ||
                        "Check-in failed"
                    );
                }


                showMessage(
                    "Check-in successful"
                );


                event.target.reset();

                loadCheckIns();

            } catch (error) {

                showMessage(error.message);
            }
        }
    );


// ==================================================
// LOAD CHECK-INS
// ==================================================

async function loadCheckIns() {

    try {

        const response =
            await fetch(
                `${API}/checkins/month`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load check-ins"
            );
        }


        const checkins =
            await response.json();


        const list =
            document.getElementById(
                "checkinList"
            );

        list.innerHTML = "";


        if (checkins.length === 0) {

            list.innerHTML =
                "<p>No check-ins this month.</p>";

            return;
        }


        checkins.forEach(checkin => {

            list.innerHTML += `

                <div class="item">

                    <strong>
                        ${escapeHtml(
                checkin.member.name
            )}
                    </strong>

                    <br>

                    Date:
                    ${checkin.checkInDate}

                </div>
            `;
        });

    } catch (error) {

        showMessage(error.message);
    }
}


// ==================================================
// DROPDOWNS
// ==================================================

function fillMemberDropdown(id) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }


    select.innerHTML =
        `<option value="">
            Select Member
        </option>`;


    members.forEach(member => {

        select.innerHTML += `

            <option value="${member.id}">
                ${escapeHtml(member.name)}
            </option>

        `;
    });
}


function fillPlanDropdown(id) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }


    select.innerHTML =
        `<option value="">
            Select Plan
        </option>`;


    plans.forEach(plan => {

        select.innerHTML += `

            <option value="${plan.id}">
                ${escapeHtml(plan.name)}
            </option>

        `;
    });
}


// ==================================================
// DASHBOARD
// ==================================================

async function loadDashboard() {

    await loadMembers();

    await loadPlans();

    await loadMemberships();

    await loadExpiringMemberships();
}


// ==================================================
// SECURITY / HTML ESCAPING
// ==================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// ==================================================
// INITIAL LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showSection("dashboard");

    }
);