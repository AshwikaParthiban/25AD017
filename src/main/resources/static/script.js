async function addMember() {

    const member = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    try {

        const response = await fetch("/api/members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(member)
        });

        if (!response.ok) {
            throw new Error("Failed to add member");
        }

        const data = await response.json();

        alert("Member added successfully!");

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";

        loadMembers();

    } catch (error) {

        alert(error.message);

    }
}


async function loadMembers() {

    try {

        const response = await fetch("/api/members");

        const members = await response.json();

        const container = document.getElementById("members");

        container.innerHTML = "";

        members.forEach(member => {

            const div = document.createElement("div");

            div.className = "member";

            div.innerHTML = `
                <strong>${member.name}</strong><br>
                Email: ${member.email}<br>
                Phone: ${member.phone}
            `;

            container.appendChild(div);

        });

    } catch (error) {

        alert("Could not load members");

    }
}