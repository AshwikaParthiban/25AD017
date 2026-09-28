const API = "/api";


// ======================================================
// COMMON
// ======================================================

async function api(path, options = {}) {

    const response = await fetch(API + path, {
        ...options,
        headers: {
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...(options.headers || {})
        }
    });

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {

        let message = "Request failed";

        if (data && typeof data === "object") {
            message =
                data.error ||
                Object.values(data).join(", ") ||
                message;
        } else if (typeof data === "string" && data.trim()) {
            message = data;
        }

        throw new Error(message);
    }

    return data;
}


function toast(message, error = false) {

    const box = document.getElementById("toast");

    if (!box) return;

    box.textContent = message;

    box.className = "show";

    if (error) {
        box.classList.add("error");
    }

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        box.className = "";

    }, 3000);
}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function money(value) {

    return Number(value || 0).toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR"
        }
    );
}


function today() {

    return new Date()
        .toISOString()
        .slice(0, 10);
}


// ======================================================
// NAVIGATION ACTIVE LINK
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const page =
            document.body.dataset.page;

        document
            .querySelectorAll("nav a")
            .forEach(link => {

                const href =
                    link.getAttribute("href");

                if (
                    (page === "dashboard" &&
                        href === "index.html") ||

                    (page === "members" &&
                        href === "members.html") ||

                    (page === "plans" &&
                        href === "plans.html") ||

                    (page === "memberships" &&
                        href === "memberships.html") ||

                    (page === "checkins" &&
                        href === "checkins.html")
                ) {

                    link.style.background =
                        "#303c55";

                    link.style.color =
                        "white";
                }

            });

    }
);


// ======================================================
// MEMBERS
// ======================================================

function showMemberForm() {

    document
        .getElementById("memberFormBox")
        .classList.remove("hidden");
}


function hideMemberForm() {

    document
        .getElementById("memberFormBox")
        .classList.add("hidden");

    document
        .getElementById("memberForm")
        .reset();
}


async function loadMembers() {

    try {

        const members =
            await api("/members");

        const table =
            document.getElementById(
                "membersTable"
            );

        if (!table) return;

        table.innerHTML = "";

        if (members.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No members found.
                    </td>
                </tr>
            `;

            return;
        }

        members.forEach(member => {

            table.innerHTML += `

                <tr>

                    <td>${member.id}</td>

                    <td>
                        ${escapeHtml(member.name)}
                    </td>

                    <td>
                        ${escapeHtml(member.email)}
                    </td>

                    <td>
                        ${escapeHtml(member.phone)}
                    </td>

                    <td>

                        <button
                            class="button secondary"
                            onclick="deleteMember(${member.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        toast(error.message, true);
    }
}


async function deleteMember(id) {

    if (!confirm("Delete this member?")) {
        return;
    }

    try {

        await api(
            `/members/${id}`,
            {
                method: "DELETE"
            }
        );

        toast(
            "Member deleted successfully."
        );

        loadMembers();

    } catch (error) {

        toast(error.message, true);
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "memberForm"
            );

        if (!form) return;

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const member = {

                    name:
                        document
                            .getElementById(
                                "memberName"
                            )
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById(
                                "memberEmail"
                            )
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById(
                                "memberPhone"
                            )
                            .value
                            .trim()
                };

                try {

                    await api(
                        "/members",
                        {
                            method: "POST",

                            body:
                                JSON.stringify(member)
                        }
                    );

                    toast(
                        "Member added successfully."
                    );

                    hideMemberForm();

                    loadMembers();

                } catch (error) {

                    toast(
                        error.message,
                        true
                    );
                }

            }
        );

    }
);


// ======================================================
// PLANS
// ======================================================

function showPlanForm() {

    document
        .getElementById("planFormBox")
        .classList.remove("hidden");
}


function hidePlanForm() {

    document
        .getElementById("planFormBox")
        .classList.add("hidden");

    document
        .getElementById("planForm")
        .reset();
}


async function loadPlans() {

    try {

        const plans =
            await api("/plans");

        const container =
            document.getElementById(
                "plansContainer"
            );

        if (!container) return;

        container.innerHTML = "";

        if (plans.length === 0) {

            container.innerHTML = `
                <div class="panel">
                    No plans available.
                </div>
            `;

            return;
        }

        plans.forEach(plan => {

            container.innerHTML += `

                <div class="plan-card">

                    <p class="label">
                        GYM PLAN
                    </p>

                    <h2>
                        ${escapeHtml(plan.name)}
                    </h2>

                    <div class="plan-price">
                        ${money(plan.price)}
                    </div>

                    <div class="plan-duration">

                        Duration:
                        ${plan.durationMonths}
                        month(s)

                    </div>

                    <div class="card-actions">

                        <button
                            class="button secondary"
                            onclick="deletePlan(${plan.id})">

                            Delete

                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


async function deletePlan(id) {

    if (!confirm("Delete this plan?")) {
        return;
    }

    try {

        await api(
            `/plans/${id}`,
            {
                method: "DELETE"
            }
        );

        toast(
            "Plan deleted successfully."
        );

        loadPlans();

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "planForm"
            );

        if (!form) return;

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const plan = {

                    name:
                        document
                            .getElementById(
                                "planName"
                            )
                            .value
                            .trim(),

                    durationMonths:
                        Number(
                            document
                                .getElementById(
                                    "planDuration"
                                )
                                .value
                        ),

                    price:
                        Number(
                            document
                                .getElementById(
                                    "planPrice"
                                )
                                .value
                        )
                };

                try {

                    await api(
                        "/plans",
                        {
                            method: "POST",

                            body:
                                JSON.stringify(plan)
                        }
                    );

                    toast(
                        "Plan added successfully."
                    );

                    hidePlanForm();

                    loadPlans();

                } catch (error) {

                    toast(
                        error.message,
                        true
                    );
                }

            }
        );

    }
);


// ======================================================
// MEMBERSHIPS
// ======================================================

async function loadMemberships() {

    try {

        const [
            members,
            plans,
            memberships
        ] = await Promise.all([

            api("/members"),

            api("/plans"),

            api("/memberships")

        ]);


        fillSelect(
            "membershipMember",
            members,
            "Select member"
        );

        fillSelect(
            "renewMember",
            members,
            "Select member"
        );


        fillSelect(
            "membershipPlan",
            plans,
            "Select plan",
            plan =>
                `${plan.name} - ${money(plan.price)}`
        );

        fillSelect(
            "renewPlan",
            plans,
            "Select plan",
            plan =>
                `${plan.name} - ${money(plan.price)}`
        );


        const table =
            document.getElementById(
                "membershipTable"
            );

        if (!table) return;

        table.innerHTML = "";


        if (memberships.length === 0) {

            table.innerHTML = `

                <tr>
                    <td colspan="6">
                        No memberships found.
                    </td>
                </tr>

            `;

        } else {

            memberships.forEach(m => {

                const active =
                    m.expiryDate >= today();

                table.innerHTML += `

                    <tr>

                        <td>
                            ${escapeHtml(
                    m.member?.name
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    m.plan?.name
                )}
                        </td>

                        <td>
                            ${m.startDate}
                        </td>

                        <td>
                            ${m.expiryDate}
                        </td>

                        <td>

                            <span class="${
                    active
                        ? "status-active"
                        : "status-expired"
                }">

                                ${
                    active
                        ? "Active"
                        : "Expired"
                }

                            </span>

                        </td>

                        <td>

                            <button
                                class="button secondary"
                                onclick="deleteMembership(${m.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            });

        }


        loadExpiring();

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


function fillSelect(
    id,
    items,
    placeholder,
    textFunction = item => item.name
) {

    const select =
        document.getElementById(id);

    if (!select) return;

    select.innerHTML =
        `<option value="">
            ${placeholder}
        </option>`;


    items.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${escapeHtml(
            textFunction(item)
        )}
            </option>

        `;

    });
}


async function deleteMembership(id) {

    if (!confirm(
        "Delete this membership?"
    )) {
        return;
    }

    try {

        await api(
            `/memberships/${id}`,
            {
                method: "DELETE"
            }
        );

        toast(
            "Membership deleted."
        );

        loadMemberships();

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


async function loadExpiring() {

    try {

        const expiring =
            await api(
                "/memberships/expiring"
            );

        const box =
            document.getElementById(
                "expiringMemberships"
            );

        if (!box) return;

        box.innerHTML = "";

        if (!expiring.length) {

            box.innerHTML =
                "<p>No memberships expiring within 7 days.</p>";

            return;
        }

        expiring.forEach(m => {

            box.innerHTML += `

                <div class="list-item">

                    <div>

                        <strong>
                            ${escapeHtml(
                m.member?.name
            )}
                        </strong>

                        <br>

                        ${escapeHtml(
                m.plan?.name
            )}

                    </div>

                    <strong>
                        ${m.expiryDate}
                    </strong>

                </div>

            `;

        });

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const createForm =
            document.getElementById(
                "membershipForm"
            );

        if (createForm) {

            createForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();

                    const memberId =
                        document.getElementById(
                            "membershipMember"
                        ).value;

                    const planId =
                        document.getElementById(
                            "membershipPlan"
                        ).value;

                    try {

                        await api(
                            `/memberships?memberId=${memberId}&planId=${planId}`,
                            {
                                method: "POST"
                            }
                        );

                        toast(
                            "Membership created successfully."
                        );

                        createForm.reset();

                        loadMemberships();

                    } catch (error) {

                        toast(
                            error.message,
                            true
                        );
                    }

                }
            );

        }


        const renewForm =
            document.getElementById(
                "renewForm"
            );

        if (renewForm) {

            renewForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();

                    const memberId =
                        document.getElementById(
                            "renewMember"
                        ).value;

                    const planId =
                        document.getElementById(
                            "renewPlan"
                        ).value;

                    try {

                        await api(
                            `/memberships/renew?memberId=${memberId}&planId=${planId}`,
                            {
                                method: "POST"
                            }
                        );

                        toast(
                            "Membership renewed successfully."
                        );

                        renewForm.reset();

                        loadMemberships();

                    } catch (error) {

                        toast(
                            error.message,
                            true
                        );
                    }

                }
            );

        }

    }
);


// ======================================================
// CHECK-IN
// ======================================================

async function loadCheckins() {

    try {

        const members =
            await api("/members");

        const checkins =
            await api("/checkins/month");

        fillSelect(
            "checkinMember",
            members,
            "Select member"
        );

        const table =
            document.getElementById(
                "checkinTable"
            );

        if (table) {

            table.innerHTML = "";

            if (checkins.length === 0) {

                table.innerHTML = `

                    <tr>
                        <td colspan="2">
                            No check-ins this month.
                        </td>
                    </tr>

                `;

            } else {

                checkins.forEach(checkin => {

                    table.innerHTML += `

                        <tr>

                            <td>
                                ${escapeHtml(
                        checkin.member?.name
                    )}
                            </td>

                            <td>
                                ${checkin.checkInDate}
                            </td>

                        </tr>

                    `;

                });

            }

        }

        loadAttendanceCounts(
            members
        );

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


async function loadAttendanceCounts(
    members
) {

    const box =
        document.getElementById(
            "attendanceCounts"
        );

    if (!box) return;

    box.innerHTML = "";

    for (const member of members) {

        try {

            const result =
                await api(
                    `/checkins/member/${member.id}/count`
                );

            const count =
                result.currentMonthCount ?? 0;

            box.innerHTML += `

                <div class="attendance-card">

                    <strong>
                        ${escapeHtml(
                member.name
            )}
                    </strong>

                    <div class="attendance-number">
                        ${count}
                    </div>

                    <small>
                        check-ins this month
                    </small>

                </div>

            `;

        } catch {

            box.innerHTML += `

                <div class="attendance-card">

                    <strong>
                        ${escapeHtml(
                member.name
            )}
                    </strong>

                    <div class="attendance-number">
                        0
                    </div>

                </div>

            `;
        }

    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "checkinForm"
            );

        if (!form) return;

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const memberId =
                    document.getElementById(
                        "checkinMember"
                    ).value;

                try {

                    await api(
                        `/checkins?memberId=${memberId}`,
                        {
                            method: "POST"
                        }
                    );

                    toast(
                        "Check-in successful."
                    );

                    form.reset();

                    loadCheckins();

                } catch (error) {

                    toast(
                        error.message,
                        true
                    );
                }

            }
        );

    }
);


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const [
            members,
            plans,
            memberships,
            expiring
        ] = await Promise.all([

            api("/members"),

            api("/plans"),

            api("/memberships"),

            api("/memberships/expiring")

        ]);


        document.getElementById(
            "memberCount"
        ).textContent = members.length;


        document.getElementById(
            "planCount"
        ).textContent = plans.length;


        const active =
            memberships.filter(
                m => m.expiryDate >= today()
            ).length;


        document.getElementById(
            "activeMembershipCount"
        ).textContent = active;


        document.getElementById(
            "expiringCount"
        ).textContent = expiring.length;


        const list =
            document.getElementById(
                "expiringList"
            );

        list.innerHTML = "";


        if (!expiring.length) {

            list.innerHTML =
                "<p>No memberships expiring within 7 days.</p>";

            return;
        }


        expiring.forEach(m => {

            list.innerHTML += `

                <div class="list-item">

                    <div>

                        <strong>
                            ${escapeHtml(
                m.member?.name
            )}
                        </strong>

                        <br>

                        ${escapeHtml(
                m.plan?.name
            )}

                    </div>

                    <strong>
                        ${m.expiryDate}
                    </strong>

                </div>

            `;

        });

    } catch (error) {

        toast(
            error.message,
            true
        );
    }
}


// ======================================================
// INITIAL PAGE LOADING
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const page =
            document.body.dataset.page;

        if (page === "dashboard") {
            loadDashboard();
        }

        if (page === "members") {
            loadMembers();
        }

        if (page === "plans") {
            loadPlans();
        }

        if (page === "memberships") {
            loadMemberships();
        }

        if (page === "checkins") {
            loadCheckins();
        }

    }
);