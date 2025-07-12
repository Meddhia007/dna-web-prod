document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    let db = {};

    const loadDb = async () => {
        const res = await fetch('db.json');
        db = await res.json();
        window.renderServices(); // Render services by default
    };

    const saveDb = async () => {
        // In a real application, this would be a POST request to a server.
        // For this example, we'll just log it to the console.
        console.log('Saving DB:', JSON.stringify(db, null, 2));
    };

    window.renderServices = () => {
        const servicesHtml = `
            <h2>Services</h2>
            <ul>
                ${db.services.map(service => `<li>${service.name} <button onclick="editService('${service.id}')">Edit</button> <button onclick="deleteService('${service.id}')">Delete</button></li>`).join('')}
            </ul>
            <h3>Add Service</h3>
            <form onsubmit="addService(event)">
                <input type="text" name="serviceName" placeholder="Service Name" required>
                <button type="submit">Add</button>
            </form>
        `;
        content.innerHTML = servicesHtml;
    };

    window.addService = (event) => {
        event.preventDefault();
        const form = event.target;
        const newService = {
            id: Date.now().toString(),
            name: form.serviceName.value
        };
        db.services.push(newService);
        saveDb();
        window.renderServices();
    };

    window.editService = (id) => {
        const service = db.services.find(s => s.id === id);
        if (!service) return;
        const newName = prompt('Enter new name:', service.name);
        if (newName) {
            service.name = newName;
            saveDb();
            window.renderServices();
        }
    };

    window.deleteService = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            db.services = db.services.filter(s => s.id !== id);
            saveDb();
            window.renderServices();
        }
    };

    window.renderTeam = () => {
        const teamHtml = `
            <h2>Team</h2>
            <ul>
                ${db.team.map(member => `<li>${member.name} - ${member.role} <button onclick="editTeamMember('${member.id}')">Edit</button> <button onclick="deleteTeamMember('${member.id}')">Delete</button></li>`).join('')}
            </ul>
            <h3>Add Team Member</h3>
            <form onsubmit="addTeamMember(event)">
                <input type="text" name="memberName" placeholder="Member Name" required>
                <input type="text" name="memberRole" placeholder="Role" required>
                <button type="submit">Add</button>
            </form>
        `;
        content.innerHTML = teamHtml;
    };

    window.addTeamMember = (event) => {
        event.preventDefault();
        const form = event.target;
        const newMember = {
            id: Date.now().toString(),
            name: form.memberName.value,
            role: form.memberRole.value
        };
        db.team.push(newMember);
        saveDb();
        window.renderTeam();
    };

    window.editTeamMember = (id) => {
        const member = db.team.find(m => m.id === id);
        if (!member) return;
        const newName = prompt('Enter new name:', member.name);
        const newRole = prompt('Enter new role:', member.role);
        if (newName && newRole) {
            member.name = newName;
            member.role = newRole;
            saveDb();
            window.renderTeam();
        }
    };

    window.deleteTeamMember = (id) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            db.team = db.team.filter(m => m.id !== id);
            saveDb();
            window.renderTeam();
        }
    };

    window.renderPortfolio = () => {
        const portfolioHtml = `
            <h2>Portfolio</h2>
            <ul>
                ${db.portfolio.map(item => `<li>${item.title} <button onclick="editPortfolioItem('${item.id}')">Edit</button> <button onclick="deletePortfolioItem('${item.id}')">Delete</button></li>`).join('')}
            </ul>
            <h3>Add Portfolio Item</h3>
            <form onsubmit="addPortfolioItem(event)">
                <input type="text" name="itemTitle" placeholder="Item Title" required>
                <button type="submit">Add</button>
            </form>
        `;
        content.innerHTML = portfolioHtml;
    };

    window.addPortfolioItem = (event) => {
        event.preventDefault();
        const form = event.target;
        const newItem = {
            id: Date.now().toString(),
            title: form.itemTitle.value
        };
        db.portfolio.push(newItem);
        saveDb();
        window.renderPortfolio();
    };

    window.editPortfolioItem = (id) => {
        const item = db.portfolio.find(i => i.id === id);
        if (!item) return;
        const newTitle = prompt('Enter new title:', item.title);
        if (newTitle) {
            item.title = newTitle;
            saveDb();
            window.renderPortfolio();
        }
    };

    window.deletePortfolioItem = (id) => {
        if (confirm('Are you sure you want to delete this portfolio item?')) {
            db.portfolio = db.portfolio.filter(i => i.id !== id);
            saveDb();
            window.renderPortfolio();
        }
    };

    window.renderEquipment = () => {
        const equipmentHtml = `
            <h2>Equipment</h2>
            <ul>
                ${db.equipment.map(item => `<li>${item.name} <button onclick="editEquipmentItem('${item.id}')">Edit</button> <button onclick="deleteEquipmentItem('${item.id}')">Delete</button></li>`).join('')}
            </ul>
            <h3>Add Equipment</h3>
            <form onsubmit="addEquipmentItem(event)">
                <input type="text" name="itemName" placeholder="Item Name" required>
                <button type="submit">Add</button>
            </form>
        `;
        content.innerHTML = equipmentHtml;
    };

    window.addEquipmentItem = (event) => {
        event.preventDefault();
        const form = event.target;
        const newItem = {
            id: Date.now().toString(),
            name: form.itemName.value
        };
        db.equipment.push(newItem);
        saveDb();
        window.renderEquipment();
    };

    window.editEquipmentItem = (id) => {
        const item = db.equipment.find(i => i.id === id);
        if (!item) return;
        const newName = prompt('Enter new name:', item.name);
        if (newName) {
            item.name = newName;
            saveDb();
            window.renderEquipment();
        }
    };

    window.deleteEquipmentItem = (id) => {
        if (confirm('Are you sure you want to delete this equipment item?')) {
            db.equipment = db.equipment.filter(i => i.id !== id);
            saveDb();
            window.renderEquipment();
        }
    };

    loadDb();
});